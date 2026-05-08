import { createSupabaseAdminClient } from "@/lib/supabase";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { earnPointsOnChain } from "@/lib/solana";

const POINTS_PER_IDR = 8000; // 1 point per 8,000 IDR spent

// GET /api/orders — list orders
export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, total_amount, points_earned, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

// POST /api/orders — checkout: pay from cart, earn points, clear cart
export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const supabase = createSupabaseAdminClient();

  // 1. load cart with product details
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products(id, name, price, stock)")
    .eq("user_id", user.id);

  if (cartError)
    return Response.json({ error: cartError.message }, { status: 500 });
  if (!cartItems || cartItems.length === 0) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  type CartProduct = { id: string; name: string; price: number; stock: number };

  // 2. validate stock for every item
  for (const item of cartItems) {
    const product = item.product as unknown as CartProduct;
    if (product.stock < item.quantity) {
      return Response.json(
        {
          error: `Not enough stock for "${product.name}" (available: ${product.stock})`,
        },
        { status: 400 },
      );
    }
  }

  // 3. calculate total and points
  const total = cartItems.reduce((sum, item) => {
    const product = item.product as unknown as CartProduct;
    return sum + product.price * item.quantity;
  }, 0);

  const pointsEarned = Math.floor(total / POINTS_PER_IDR);

  // 4. create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: total,
      points_earned: pointsEarned,
    })
    .select()
    .single();

  if (orderError)
    return Response.json({ error: orderError.message }, { status: 500 });

  // 5. create order items (snapshot product name + price)
  const orderItems = cartItems.map((item) => {
    const product = item.product as unknown as CartProduct;
    return {
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (itemsError)
    return Response.json({ error: itemsError.message }, { status: 500 });

  // 6. reduce product stock
  for (const item of cartItems) {
    const product = item.product as unknown as CartProduct;
    await supabase
      .from("products")
      .update({ stock: product.stock - item.quantity })
      .eq("id", product.id);
  }

  // 7. upsert user_points balance
  const { data: currentPoints } = await supabase
    .from("user_points")
    .select("total_points, wallet_address")
    .eq("user_id", user.id)
    .single();

  const newTotal = (currentPoints?.total_points ?? 0) + pointsEarned;

  await supabase.from("user_points").upsert({
    user_id: user.id,
    total_points: newTotal,
    updated_at: new Date().toISOString(),
  });

  // 8. record point transaction
  if (pointsEarned > 0) {
    await supabase.from("point_transactions").insert({
      user_id: user.id,
      order_id: order.id,
      points: pointsEarned,
      type: "earned",
      note: `Earned from order #${order.id.slice(0, 8)}`,
    });
  }

  // 9. clear cart
  await supabase.from("cart_items").delete().eq("user_id", user.id);

  // 10. mint points on-chain (non-blocking — DB is the source of truth)
  let chainTx: string | null = null;
  let chainSynced = false;
  if (pointsEarned > 0 && currentPoints?.wallet_address) {
    try {
      chainTx = await earnPointsOnChain(currentPoints.wallet_address, total);
      chainSynced = true;
    } catch (err) {
      console.error("[solana] earn_points failed:", err);
    }
  }

  return Response.json(
    {
      order: {
        id: order.id,
        total_amount: total,
        points_earned: pointsEarned,
        status: order.status,
        items: orderItems.map((i) => ({
          product_name: i.product_name,
          quantity: i.quantity,
          subtotal: i.subtotal,
        })),
      },
      points_summary: {
        earned: pointsEarned,
        total: newTotal,
        message:
          pointsEarned > 0
            ? `You earned ${pointsEarned} point${pointsEarned > 1 ? "s" : ""}!`
            : `Spend at least Rp${POINTS_PER_IDR.toLocaleString("id-ID")} to earn points.`,
      },
      chain: {
        synced: chainSynced,
        tx: chainTx,
      },
    },
    { status: 201 },
  );
}

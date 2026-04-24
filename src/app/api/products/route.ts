import { createSupabaseAdminClient } from "@/lib/supabase";
import { getAuthUser, unauthorized } from "@/lib/auth";

// GET /api/products
export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

// POST /api/products
export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  let body: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    image_url?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, description, price, stock, image_url } = body;

  if (!name || price == null) {
    return Response.json(
      { error: "name and price are required" },
      { status: 400 },
    );
  }
  if (price < 0) {
    return Response.json(
      { error: "price must be 0 or greater" },
      { status: 400 },
    );
  }
  if (stock != null && stock < 0) {
    return Response.json(
      { error: "stock must be 0 or greater" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      description,
      price,
      stock: stock ?? 0,
      image_url,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}

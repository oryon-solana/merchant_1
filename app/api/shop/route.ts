import { createSupabaseAdminClient } from "@/lib/supabase";

// GET /api/shop — public product browse, no auth required
export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, stock, image_url")
    .is("user_id", null)
    .order("name");

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

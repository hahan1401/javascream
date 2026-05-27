// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2"

const model = new Supabase.ai.Session("gte-small")

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data: posts, error: fetchError } = await supabase
    .from("posts")
    .select("id, title, excerpt, content")
    .is("embedding", null)

  if (fetchError) {
    return Response.json({ error: fetchError.message }, { status: 500 })
  }

  const results = []

  for (const post of posts ?? []) {
    const input = [post.title, post.excerpt, post.content]
      .filter(Boolean)
      .join("\n\n")

    const embedding = await model.run(input, { mean_pool: true, normalize: true })

    const { error: updateError } = await supabase
      .from("posts")
      .update({ embedding: Array.from(embedding) })
      .eq("id", post.id)

    results.push({ postId: post.id, success: !updateError, error: updateError?.message })
  }

  return Response.json({ seeded: results.length, results })
})

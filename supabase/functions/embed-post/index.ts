// import OpenAI from "npm:openai@4"
import { createClient } from "npm:@supabase/supabase-js@2"

// const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") })
const model = new Supabase.ai.Session("gte-small")

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 })
  }

  const { postId } = await req.json()
  if (!postId) {
    return Response.json({ error: "postId is required" }, { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("id, title, excerpt, content")
    .eq("id", postId)
    .single()

  if (fetchError || !post) {
    return Response.json({ error: "Post not found" }, { status: 404 })
  }

  const input = [post.title, post.excerpt, post.content]
    .filter(Boolean)
    .join("\n\n")

  // OpenAI version (uncomment when OPENAI_API_KEY is available):
  // const { data } = await openai.embeddings.create({ input, model: "text-embedding-3-small" })
  // const embedding = data[0].embedding

  const embedding = await model.run(input, { mean_pool: true, normalize: true })

  const { error: updateError } = await supabase
    .from("posts")
    .update({ embedding: Array.from(embedding) })
    .eq("id", postId)

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  return Response.json({ success: true, postId })
})
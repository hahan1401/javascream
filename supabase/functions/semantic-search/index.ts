// import OpenAI from "npm:openai@4"
import { createClient } from "npm:@supabase/supabase-js@2"

// const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") })
const model = new Supabase.ai.Session("gte-small")

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 })
  }

  const { query, matchThreshold = 0.5, matchCount = 5 } = await req.json()
  if (!query) {
    return Response.json({ error: "query is required" }, { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  // OpenAI version (uncomment when OPENAI_API_KEY is available):
  // const { data: embeddingData } = await openai.embeddings.create({ input: query, model: "text-embedding-3-small" })
  // const queryEmbedding = embeddingData[0].embedding

  const queryEmbedding = await model.run(query, { mean_pool: true, normalize: true })

  const { data: posts, error } = await supabase.rpc("match_posts", {
    query_embedding: Array.from(queryEmbedding),
    match_threshold: matchThreshold,
    match_count: matchCount,
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ posts })
})
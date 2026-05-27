import { supabase } from "@/src/lib/supabase"
import { getPostsByIds } from "@/src/queries/posts"
import type { PostSummary } from "@/src/types"

type SemanticHit = {
  id: string
  similarity: number
}

export const semanticSearch = async (
  query: string,
  matchThreshold = 0.3,
  matchCount = 20
): Promise<PostSummary[]> => {
  const { data, error } = await supabase.functions.invoke("semantic-search", {
    body: { query, matchThreshold, matchCount },
  })

  if (error) throw error

  const hits: SemanticHit[] = data.posts ?? []
  const ids = hits.map((h) => h.id)
  return getPostsByIds(ids)
}

export const embedPost = async (postId: string): Promise<void> => {
  const { error } = await supabase.functions.invoke("embed-post", {
    body: { postId },
  })
  if (error) throw error
}
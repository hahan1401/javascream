import { supabase } from '@/src/lib/supabase'
import type { Post, PostSummary, RelatedPost } from '@/src/types'

const POST_FULL_SELECT = `
  id, title, slug, excerpt, content, read_time_minutes, published_at, view_count, series_id, series_order,
  categories ( id, name, slug, color, description ),
  profiles ( id, username, full_name, avatar_url, bio ),
  post_tags ( tags ( id, name, slug ) )
`

const POST_SUMMARY_SELECT = `
  id, title, slug, excerpt, read_time_minutes, published_at, view_count,
  categories ( id, name, slug, color, description ),
  profiles ( id, username, full_name ),
  post_tags ( tags ( id, name, slug ) )
`

const RELATED_POST_SELECT = `
  id, title, slug, excerpt, read_time_minutes,
  categories ( id, name, slug, color, description )
`

export const getFeaturedPost = async (): Promise<Post | null> => {
  const { data } = await supabase
    .from('posts')
    .select(POST_FULL_SELECT)
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(1)

  return (data?.[0] as unknown as Post) ?? null
}

export const getLatestPosts = async (excludeId: string, limit = 6): Promise<PostSummary[]> => {
  const { data } = await supabase
    .from('posts')
    .select(POST_SUMMARY_SELECT)
    .eq('status', 'published')
    .neq('id', excludeId || '00000000-0000-0000-0000-000000000000')
    .order('published_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as unknown as PostSummary[]
}

export const getFilteredPosts = async (
  q: string,
  categoryId: string | null
): Promise<PostSummary[]> => {
  let query = supabase
    .from('posts')
    .select(POST_SUMMARY_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (q) {
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
  }
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data } = await query
  return (data ?? []) as unknown as PostSummary[]
}

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const { data } = await supabase
    .from('posts')
    .select(POST_FULL_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  return data ? (data as unknown as Post) : null
}

export const getRelatedPosts = async (
  categoryId: string,
  excludeId: string,
  limit = 3
): Promise<RelatedPost[]> => {
  const { data } = await supabase
    .from('posts')
    .select(RELATED_POST_SELECT)
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .limit(limit)

  return (data ?? []) as unknown as RelatedPost[]
}

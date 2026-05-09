import { supabase } from '@/src/lib/supabase'
import type { Tag } from '@/src/types'

export const getTags = async (limit?: number): Promise<Tag[]> => {
  let query = supabase.from('tags').select('id, name, slug').order('name')

  if (limit !== undefined) {
    query = query.limit(limit)
  }

  const { data } = await query
  return (data ?? []) as Tag[]
}

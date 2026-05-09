import { supabase } from '@/src/lib/supabase'
import type { Category } from '@/src/types'

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, color, description')
    .order('name')

  return (data ?? []) as Category[]
}

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, color, description')
    .eq('slug', slug)
    .single()

  return data as Category | null
}

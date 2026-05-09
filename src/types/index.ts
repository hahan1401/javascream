export type Category = {
  id: string
  name: string
  slug: string
  color: string | null
  description: string | null
}

export type Tag = {
  id: string
  name: string
  slug: string
}

export type Profile = {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
}

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  read_time_minutes: number | null
  published_at: string | null
  view_count: number
  series_id: string | null
  series_order: number | null
  categories: Category | null
  profiles: Profile | null
  post_tags: { tags: Tag | null }[]
}

export type PostSummary = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  read_time_minutes: number | null
  published_at: string | null
  view_count: number
  categories: Category | null
  profiles: Pick<Profile, 'id' | 'username' | 'full_name'> | null
  post_tags: { tags: Tag | null }[]
}

export type RelatedPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  read_time_minutes: number | null
  categories: Category | null
}

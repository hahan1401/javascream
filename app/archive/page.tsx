import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  const category = typeof sp.category === 'string' ? sp.category : ''
  const tag = typeof sp.tag === 'string' ? sp.tag : ''

  // Resolve category id for filtering
  let categoryId: string | null = null
  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()
    categoryId = cat?.id ?? null
  }

  let query = supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, read_time_minutes, published_at, view_count,
      categories ( id, name, slug, color, description ),
      profiles ( id, username, full_name ),
      post_tags ( tags ( id, name, slug ) )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (q) {
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
  }
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data: postsData } = await query

  // Filter by tag client-side (nested relation)
  let posts = postsData ?? []
  if (tag) {
    posts = posts.filter((p: any) =>
      p.post_tags?.some((pt: any) => pt.tags?.slug === tag)
    )
  }

  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from('categories').select('id, name, slug').order('name'),
    supabase.from('tags').select('id, name, slug').order('name'),
  ])

  const activeCategory = (categories ?? []).find((c: any) => c.slug === category)
  const activeTag = (tags ?? []).find((t: any) => t.slug === tag)

  return (
    <div>
      {/* Header */}
      <div className="border-b border-[#c6c6cd] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <p className="font-mono text-xs text-[#76777d] mb-2">root / archive</p>
          <h1 className="text-3xl font-bold text-[#171c1f] mb-2">Search & Archive</h1>
          <p className="text-[#45464d] mb-8">
            Browse all technical articles on JavaScript, TypeScript, and the web platform.
          </p>

          <form method="GET" className="flex gap-3 max-w-2xl">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search articles..."
              className="flex-1 border border-[#c6c6cd] bg-[#f6fafe] px-4 py-2.5 text-sm font-mono rounded-sm outline-none focus:border-[#171c1f] transition-colors"
            />
            {category && <input type="hidden" name="category" value={category} />}
            {tag && <input type="hidden" name="tag" value={tag} />}
            <button
              type="submit"
              className="font-mono text-sm font-medium bg-[#171c1f] text-white px-6 py-2.5 rounded-sm hover:bg-[#f7df1e] hover:text-[#171c1f] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex gap-10">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-20 space-y-8">
              <div>
                <h3 className="font-mono text-xs font-medium tracking-widest text-[#76777d] mb-3">
                  CATEGORY
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={q ? `/archive?q=${q}` : '/archive'}
                      className={`block text-sm font-mono transition-colors ${
                        !category
                          ? 'text-[#171c1f] font-semibold'
                          : 'text-[#45464d] hover:text-[#171c1f]'
                      }`}
                    >
                      All Topics
                    </Link>
                  </li>
                  {(categories ?? []).map((cat: any) => (
                    <li key={cat.id}>
                      <Link
                        href={`/archive?category=${cat.slug}${q ? `&q=${q}` : ''}${tag ? `&tag=${tag}` : ''}`}
                        className={`block text-sm font-mono transition-colors ${
                          category === cat.slug
                            ? 'text-[#171c1f] font-semibold'
                            : 'text-[#45464d] hover:text-[#171c1f]'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-mono text-xs font-medium tracking-widest text-[#76777d] mb-3">
                  TAGS
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(tags ?? []).map((t: any) => (
                    <Link
                      key={t.id}
                      href={`/archive?tag=${t.slug}${q ? `&q=${q}` : ''}${category ? `&category=${category}` : ''}`}
                      className={`font-mono text-xs px-2 py-1 rounded-sm transition-colors ${
                        tag === t.slug
                          ? 'bg-[#f7df1e] text-[#171c1f] font-medium'
                          : 'bg-[#eaeef2] text-[#45464d] hover:bg-[#c6c6cd]'
                      }`}
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-6">
              <p className="font-mono text-sm text-[#76777d]">
                <span className="font-medium text-[#171c1f]">{posts.length}</span>{' '}
                {posts.length === 1 ? 'result' : 'results'}
                {q && ` for "${q}"`}
                {activeCategory && ` in ${activeCategory.name}`}
                {activeTag && ` tagged ${activeTag.name}`}
              </p>
              {(q || category || tag) && (
                <Link
                  href="/archive"
                  className="font-mono text-xs text-[#45464d] hover:text-[#171c1f] transition-colors"
                >
                  Clear filters ×
                </Link>
              )}
            </div>

            <div className="space-y-3">
              {posts.map((post: any) => {
                const postTags =
                  post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) ?? []
                return (
                  <article
                    key={post.id}
                    className="border border-[#c6c6cd] bg-white p-6 rounded-sm hover:border-[#171c1f] transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        {post.categories && (
                          <span className="font-mono text-xs font-medium tracking-widest text-[#45464d]">
                            {post.categories.name.toUpperCase()}
                          </span>
                        )}
                        <h2 className="mt-1 text-lg font-bold text-[#171c1f] leading-snug group-hover:underline">
                          <Link href={`/articles/${post.slug}`}>{post.title}</Link>
                        </h2>
                        {post.excerpt && (
                          <p className="mt-1.5 text-sm text-[#45464d] leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs text-[#76777d]">
                            {post.published_at && formatDate(post.published_at)}
                            {post.read_time_minutes &&
                              ` • ${post.read_time_minutes} MIN READ`}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {postTags.slice(0, 3).map(
                              (t: any) =>
                                t && (
                                  <span
                                    key={t.id}
                                    className="font-mono text-xs bg-[#eaeef2] text-[#45464d] px-2 py-0.5 rounded-sm"
                                  >
                                    {t.name}
                                  </span>
                                )
                            )}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/articles/${post.slug}`}
                        className="shrink-0 font-mono text-xs font-medium text-[#45464d] hover:text-[#171c1f] transition-colors mt-1"
                      >
                        Read →
                      </Link>
                    </div>
                  </article>
                )
              })}

              {posts.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-mono text-[#76777d]">No articles found.</p>
                  <Link
                    href="/archive"
                    className="mt-4 inline-block font-mono text-sm text-[#45464d] hover:text-[#171c1f] transition-colors"
                  >
                    Clear filters →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

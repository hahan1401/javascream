import { supabase } from '@/lib/supabase'
import { Post, Category, Tag } from '@/lib/types'
import Link from 'next/link'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function CategoryLabel({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/archive?category=${slug}`}
      className="font-mono text-xs font-medium tracking-widest text-[#45464d] hover:text-[#171c1f] transition-colors"
    >
      {name.toUpperCase()}
    </Link>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="border border-[#c6c6cd] bg-white p-6 rounded-sm hover:border-[#171c1f] transition-colors group flex flex-col">
      {post.categories && (
        <CategoryLabel name={post.categories.name} slug={post.categories.slug} />
      )}
      <h3 className="mt-2 text-base font-bold text-[#171c1f] leading-snug group-hover:underline flex-1">
        <Link href={`/articles/${post.slug}`}>{post.title}</Link>
      </h3>
      {post.excerpt && (
        <p className="mt-2 text-sm text-[#45464d] leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#76777d]">
        {post.published_at && <span>{formatDate(post.published_at)}</span>}
        {post.read_time_minutes && (
          <span>• {post.read_time_minutes} MIN READ</span>
        )}
      </div>
    </article>
  )
}

export default async function HomePage() {
  const selectQuery = `
    id, title, slug, excerpt, content, read_time_minutes, published_at, view_count, series_id, series_order,
    categories ( id, name, slug, color, description ),
    profiles ( id, username, full_name, avatar_url, bio ),
    post_tags ( tags ( id, name, slug ) )
  `

  const { data: featuredPosts } = await supabase
    .from('posts')
    .select(selectQuery)
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(1)

  const featured = featuredPosts?.[0] as Post | undefined

  const { data: latestData } = await supabase
    .from('posts')
    .select(selectQuery)
    .eq('status', 'published')
    .neq('id', featured?.id ?? '00000000-0000-0000-0000-000000000000')
    .order('published_at', { ascending: false })
    .limit(6)

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, color, description')
    .order('name')

  const { data: tags } = await supabase
    .from('tags')
    .select('id, name, slug')
    .limit(12)

  const latestPosts = (latestData ?? []) as unknown as Post[]

  return (
    <div>
      {/* Featured hero */}
      {featured && (
        <section className="border-b border-[#c6c6cd] bg-white">
          <div className="max-w-[1200px] mx-auto px-6 py-16">
            <div className="max-w-3xl">
              {featured.categories && (
                <CategoryLabel
                  name={featured.categories.name}
                  slug={featured.categories.slug}
                />
              )}
              <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-[#171c1f] leading-tight tracking-tight">
                <Link href={`/articles/${featured.slug}`} className="hover:underline">
                  {featured.title}
                </Link>
              </h1>
              {featured.excerpt && (
                <p className="mt-4 text-lg text-[#45464d] leading-relaxed max-w-2xl">
                  {featured.excerpt}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {featured.profiles && (
                  <div className="flex items-center gap-2">
                    {featured.profiles.avatar_url && (
                      <img
                        src={featured.profiles.avatar_url}
                        alt={featured.profiles.full_name ?? featured.profiles.username}
                        className="w-8 h-8 rounded-full border border-[#c6c6cd]"
                      />
                    )}
                    <span className="text-sm font-medium text-[#171c1f]">
                      {featured.profiles.full_name ?? featured.profiles.username}
                    </span>
                  </div>
                )}
                <span className="text-sm font-mono text-[#76777d]">
                  {featured.published_at && formatDate(featured.published_at)}
                  {featured.read_time_minutes &&
                    ` • ${featured.read_time_minutes} min read`}
                </span>
                <Link
                  href={`/articles/${featured.slug}`}
                  className="ml-auto text-sm font-mono font-medium bg-[#171c1f] text-white px-5 py-2 rounded-sm hover:bg-[#f7df1e] hover:text-[#171c1f] transition-colors"
                >
                  Read Article →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Main */}
          <div className="flex-1 min-w-0">
            <section>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#171c1f]">Latest Articles</h2>
                <Link
                  href="/archive"
                  className="text-sm font-mono text-[#45464d] hover:text-[#171c1f] transition-colors"
                >
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Newsletter */}
            <section
              id="newsletter"
              className="mt-16 border border-[#c6c6cd] bg-white p-8 rounded-sm"
            >
              <p className="font-mono text-xs font-medium tracking-widest text-[#76777d] mb-2">
                NEWSLETTER
              </p>
              <h2 className="text-2xl font-bold text-[#171c1f] mb-2">
                JS Internals Weekly
              </h2>
              <p className="text-[#45464d] mb-6 max-w-md">
                15,000+ developers getting weekly deep dives on JS internals, V8
                optimizations, and advanced patterns.
              </p>
              <form className="flex gap-3 max-w-md">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 border border-[#c6c6cd] bg-[#f6fafe] px-4 py-2.5 text-sm font-mono rounded-sm outline-none focus:border-[#171c1f] transition-colors"
                />
                <button
                  type="submit"
                  className="font-mono text-sm font-medium bg-[#f7df1e] text-[#171c1f] px-5 py-2.5 rounded-sm hover:bg-[#e8d01a] transition-colors whitespace-nowrap"
                >
                  Subscribe →
                </button>
              </form>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-20 space-y-10">
              <section>
                <h3 className="font-mono text-xs font-medium tracking-widest text-[#76777d] mb-4">
                  TOPICS
                </h3>
                <ul className="space-y-2.5">
                  {(categories as Category[] ?? []).map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/archive?category=${cat.slug}`}
                        className="flex items-center justify-between group"
                      >
                        <span className="text-sm font-mono text-[#45464d] group-hover:text-[#171c1f] transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-xs font-mono text-[#76777d]">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="font-mono text-xs font-medium tracking-widest text-[#76777d] mb-4">
                  POPULAR TAGS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(tags as Tag[] ?? []).map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/archive?tag=${tag.slug}`}
                      className="font-mono text-xs font-medium bg-[#eaeef2] text-[#45464d] px-2.5 py-1 rounded-sm hover:bg-[#c6c6cd] transition-colors"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

import { getPostBySlug, getRelatedPosts } from '@/src/queries/posts'
import type { Post, RelatedPost } from '@/src/types'
import { markdownToHtml, extractHeadings } from '@/src/lib/markdown'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const ArticlePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params

  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const html = markdownToHtml(post.content)
  const headings = extractHeadings(post.content)
  const tags = post.post_tags?.map((pt) => pt.tags).filter(Boolean) ?? []

  const related = post.categories
    ? await getRelatedPosts(post.categories.id, post.id)
    : []

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-[#c6c6cd] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-3">
          <p className="font-mono text-xs text-[#76777d]">
            <Link href="/" className="hover:text-[#171c1f] transition-colors">
              root
            </Link>
            {' / '}
            <Link href="/archive" className="hover:text-[#171c1f] transition-colors">
              articles
            </Link>
            {' / '}
            <span className="text-[#45464d]">{slug}</span>
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex gap-16">
          {/* Article body */}
          <article className="flex-1 min-w-0 max-w-[720px]">
            {post.categories && (
              <Link
                href={`/archive?category=${post.categories.slug}`}
                className="font-mono text-xs font-medium tracking-widest text-[#45464d] hover:text-[#171c1f] transition-colors"
              >
                {post.categories.name.toUpperCase()}
              </Link>
            )}

            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-[#171c1f] leading-tight tracking-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-3 text-lg text-[#45464d] leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Author + meta */}
            <div className="mt-6 pb-6 border-b border-[#c6c6cd] flex flex-wrap items-center gap-4">
              {post.profiles && (
                <div className="flex items-center gap-2">
                  {post.profiles.avatar_url && (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name ?? post.profiles.username}
                      className="w-9 h-9 rounded-full border border-[#c6c6cd]"
                    />
                  )}
                  <span className="text-sm font-medium text-[#171c1f]">
                    {post.profiles.full_name ?? post.profiles.username}
                  </span>
                </div>
              )}
              <span className="text-sm font-mono text-[#76777d]">
                {post.published_at && formatDate(post.published_at)}
                {post.read_time_minutes && ` • ${post.read_time_minutes} min read`}
              </span>
            </div>

            {/* Content */}
            <div
              className="article-content mt-8"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-[#c6c6cd] flex flex-wrap gap-2">
                {tags.map(
                  (tag) =>
                    tag && (
                      <Link
                        key={tag.id}
                        href={`/archive?tag=${tag.slug}`}
                        className="font-mono text-xs font-medium bg-[#eaeef2] text-[#45464d] px-3 py-1.5 rounded-sm hover:bg-[#c6c6cd] transition-colors"
                      >
                        {tag.name.toUpperCase()}
                      </Link>
                    )
                )}
              </div>
            )}
          </article>

          {/* TOC sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-20">
              {headings.length > 0 && (
                <nav>
                  <p className="font-mono text-xs font-medium tracking-widest text-[#76777d] mb-4">
                    ON THIS PAGE
                  </p>
                  <ul className="space-y-2">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className={`block font-mono text-xs text-[#45464d] hover:text-[#171c1f] transition-colors leading-snug ${
                            h.level === 3 ? 'pl-3 border-l border-[#c6c6cd]' : ''
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </aside>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#c6c6cd]">
            <h2 className="text-xl font-bold text-[#171c1f] mb-6">
              Related Technical Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p: RelatedPost) => (
                <article
                  key={p.id}
                  className="border border-[#c6c6cd] bg-white p-5 rounded-sm hover:border-[#171c1f] transition-colors group"
                >
                  {p.categories && (
                    <span className="font-mono text-xs font-medium tracking-widest text-[#45464d]">
                      {p.categories.name.toUpperCase()}
                    </span>
                  )}
                  <h3 className="mt-2 text-base font-bold text-[#171c1f] leading-snug group-hover:underline">
                    <Link href={`/articles/${p.slug}`}>{p.title}</Link>
                  </h3>
                  {p.read_time_minutes && (
                    <p className="mt-3 font-mono text-xs text-[#76777d]">
                      {p.read_time_minutes} MIN READ
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ArticlePage

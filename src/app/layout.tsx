import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'JS_CORE — JavaScript Technical Blog',
  description:
    'Deep dives on JavaScript internals, performance, and modern patterns for serious developers.',
}

const Navbar = () => {
  return (
    <nav className="border-b border-[#c6c6cd] bg-white sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono font-bold text-[#171c1f] tracking-tight text-lg"
        >
          JS_CORE
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-mono font-medium text-[#45464d]">
          <Link href="/" className="hover:text-[#171c1f] transition-colors">
            Articles
          </Link>
          <Link href="/archive" className="hover:text-[#171c1f] transition-colors">
            Archive
          </Link>
          <Link href="/archive" className="hover:text-[#171c1f] transition-colors">
            Topics
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/archive"
            className="text-sm text-[#45464d] hover:text-[#171c1f] font-mono transition-colors"
          >
            search
          </Link>
          <Link
            href="#newsletter"
            className="text-sm font-mono font-medium bg-[#f7df1e] text-[#171c1f] px-4 py-1.5 rounded-sm hover:bg-[#e8d01a] transition-colors"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </nav>
  )
}

const Footer = () => {
  return (
    <footer className="border-t border-[#c6c6cd] bg-white mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono font-bold text-[#171c1f]">JS_CORE</span>
        <p className="text-sm text-[#76777d] font-mono">
          © 2024 JS_CORE Technical Blog. Built for developers.
        </p>
        <div className="flex items-center gap-6 text-sm font-mono text-[#45464d]">
          <a href="#" className="hover:text-[#171c1f] transition-colors">
            RSS Feed
          </a>
          <a href="#" className="hover:text-[#171c1f] transition-colors">
            Github
          </a>
          <a href="#" className="hover:text-[#171c1f] transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[#f6fafe] text-[#171c1f] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

export default RootLayout

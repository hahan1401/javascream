export const markdownToHtml = (md: string): string => {
  const blocks: string[] = []
  const lines = md.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      const code = escapeHtml(codeLines.join('\n'))
      blocks.push(
        `<div class="code-block">` +
        `<div class="code-header"><span class="code-lang">${lang || 'code'}</span><span class="code-copy">content_copy &nbsp;Copy</span></div>` +
        `<pre><code>${code}</code></pre>` +
        `</div>`
      )
      i++
      continue
    }

    if (line.startsWith('## ')) {
      const text = line.slice(3)
      blocks.push(`<h2 id="${slugify(text)}">${text}</h2>`)
      i++
      continue
    }

    if (line.startsWith('### ')) {
      const text = line.slice(4)
      blocks.push(`<h3 id="${slugify(text)}">${text}</h3>`)
      i++
      continue
    }

    if (line.startsWith('> ')) {
      blocks.push(`<blockquote><p>${parseInline(line.slice(2))}</p></blockquote>`)
      i++
      continue
    }

    if (/^(\d+\.|-) /.test(line)) {
      const isOrdered = /^\d+\./.test(line)
      const items: string[] = []
      while (i < lines.length && /^(\d+\.|-) /.test(lines[i])) {
        items.push(`<li>${parseInline(lines[i].replace(/^(\d+\.|-)\ /, ''))}</li>`)
        i++
      }
      blocks.push(`<${isOrdered ? 'ol' : 'ul'}>${items.join('')}</${isOrdered ? 'ol' : 'ul'}>`)
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    blocks.push(`<p>${parseInline(line)}</p>`)
    i++
  }

  return blocks.join('\n')
}

export const extractHeadings = (md: string): { id: string; text: string; level: number }[] => {
  return md
    .split('\n')
    .filter(line => /^#{2,3} /.test(line))
    .map(line => {
      const level = line.startsWith('### ') ? 3 : 2
      const text = line.replace(/^#{2,3} /, '')
      return { id: slugify(text), text, level }
    })
}

const parseInline = (text: string): string => {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

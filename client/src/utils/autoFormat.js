/**
 * Auto-formats pasted plain text into structured HTML
 * Rules:
 * - Short lines (< 60 chars) ending without punctuation → heading
 * - Lines starting with - or * → bullet list items
 * - Lines starting with number. → ordered list items
 * - Consecutive ALL CAPS lines → strong headings
 * - Empty lines → paragraph breaks
 * - Everything else → paragraph
 */

export const autoFormatPastedText = (text) => {
  if (!text || typeof text !== 'string') return ''

  const lines = text.split('\n')
  const result = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    // Skip empty lines
    if (!line) {
      i++
      continue
    }

    // Bullet list item
    if (/^[-*•]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(`<li>${lines[i].trim().replace(/^[-*•]\s+/, '')}</li>`)
        i++
      }
      result.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    // Ordered list item
    if (/^\d+[.)]\s+/.test(line)) {
      const items = []
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(`<li>${lines[i].trim().replace(/^\d+[.)]\s+/, '')}</li>`)
        i++
      }
      result.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    // ALL CAPS short line → h2
    if (
      line === line.toUpperCase() &&
      line.length > 2 &&
      line.length < 80 &&
      /[A-Z]/.test(line)
    ) {
      result.push(`<h2>${line}</h2>`)
      i++
      continue
    }

    // Short line without ending punctuation → heading
    const endsWithPunctuation = /[.!?:,;]$/.test(line)
    if (!endsWithPunctuation && line.length < 60 && line.length > 2) {
      result.push(`<h3>${line}</h3>`)
      i++
      continue
    }

    // Everything else → paragraph
    result.push(`<p>${line}</p>`)
    i++
  }

  return result.join('')
}
export function stripHtml(html = '') {
  const element = document.createElement('div')
  element.innerHTML = html
  return element.textContent || element.innerText || ''
}

export function formatUpdatedAt(value) {
  if (!value) return 'Never'

  const diff = Date.now() - new Date(value).getTime()
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24

  if (diff < minute) return 'Just now'
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`
  if (diff < day) return `${Math.floor(diff / hour)}h ago`
  if (diff < day * 7) return `${Math.floor(diff / day)}d ago`

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export function createSummary(text) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return 'Start writing and NoteFlow will summarize the important parts.'
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean)
  return sentences.slice(0, 2).join(' ').slice(0, 220)
}

export function suggestTags(title, text) {
  const source = `${title} ${text}`.toLowerCase()
  const map = [
    ['meeting', ['meeting', 'sync', 'agenda', 'discussion']],
    ['writing', ['draft', 'essay', 'story', 'publish']],
    ['planning', ['roadmap', 'plan', 'priority', 'quarter']],
    ['research', ['research', 'source', 'study', 'insight']],
    ['product', ['feature', 'user', 'release', 'product']],
    ['personal', ['journal', 'habit', 'idea', 'reflection']],
  ]

  return map
    .filter(([, words]) => words.some((word) => source.includes(word)))
    .map(([tag]) => tag)
    .slice(0, 4)
}

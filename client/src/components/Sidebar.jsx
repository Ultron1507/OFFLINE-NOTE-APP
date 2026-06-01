import { FileText, Plus, Search, Star, Tag, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { useNoteStore } from '../store/useNoteStore.js'
import { StatusIndicator } from './StatusIndicator.jsx'

const navItems = [
  { id: 'all', label: 'All Notes', icon: FileText },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'tags', label: 'Tags', icon: Tag },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]

export function Sidebar() {
  const notes = useNoteStore((state) => state.notes)
  const query = useNoteStore((state) => state.query)
  const filter = useNoteStore((state) => state.filter)
  const activeTag = useNoteStore((state) => state.activeTag)
  const setQuery = useNoteStore((state) => state.setQuery)
  const setFilter = useNoteStore((state) => state.setFilter)
  const setActiveTag = useNoteStore((state) => state.setActiveTag)
  const createNote = useNoteStore((state) => state.createNote)

  const tags = useMemo(() => {
    return [...new Set(notes.flatMap((note) => note.tags))].sort()
  }, [notes])

  return (
    <aside className="sidebar" aria-label="Workspace navigation">
      <div className="sidebar-header">
        <div className="brand-mark" aria-hidden="true">
          N
        </div>
        <div>
          <h1>NoteFlow</h1>
          <p>Offline AI notes</p>
        </div>
      </div>

      <div className="search-field">
        <Search size={17} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search notes"
          aria-label="Search notes"
        />
      </div>

      <button className="primary-action" onClick={createNote}>
        <Plus size={18} aria-hidden="true" />
        New Note
      </button>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = filter === item.id
          return (
            <button
              key={item.id}
              className={active ? 'nav-item active' : 'nav-item'}
              onClick={() => setFilter(item.id)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <section className="tag-section" aria-label="Tags">
        <div className="section-label">Tags</div>
        <div className="tag-cloud">
          {tags.length ? (
            tags.map((tag) => (
              <button
                key={tag}
                className={activeTag === tag ? 'tag-pill active' : 'tag-pill'}
                onClick={() => setActiveTag(tag)}
              >
                #{tag}
              </button>
            ))
          ) : (
            <p className="muted-copy">Tags appear as you write.</p>
          )}
        </div>
      </section>

      <StatusIndicator />
    </aside>
  )
}

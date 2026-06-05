import { ArrowLeft, FilePlus2, Search, X } from 'lucide-react'
import { useMemo } from 'react'
import { useNoteStore } from '../store/useNoteStore.js'
import { formatUpdatedAt } from '../utils/notes.js'
import { EmptyState } from './EmptyState.jsx'

export function SearchScreen({ active, onBack, onOpenEditor, onCreateNote }) {
  const notes = useNoteStore((state) => state.notes)
  const query = useNoteStore((state) => state.query)
  const setQuery = useNoteStore((state) => state.setQuery)
  const selectNote = useNoteStore((state) => state.selectNote)

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return notes.filter((note) => !note.trashed).slice(0, 8)

    return notes.filter((note) => {
      if (note.trashed) return false
      return [note.title, note.text, note.tags.join(' ')].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      )
    })
  }, [notes, query])

  const openNote = (id) => {
    selectNote(id)
    onOpenEditor?.()
  }

  return (
    <section className={active ? 'search-screen active' : 'search-screen'} aria-label="Search notes">
      <header className="screen-topbar">
        <button className="icon-button" onClick={onBack} aria-label="Back to notes">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <h1>Search</h1>
        <button className="icon-button" onClick={onCreateNote} aria-label="Create note">
          <FilePlus2 size={19} aria-hidden="true" />
        </button>
      </header>

      <div className="search-screen-field">
        <Search size={18} aria-hidden="true" />
        <input
          autoFocus={active}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles, notes, tags"
          aria-label="Search titles, notes, tags"
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear search">
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="search-results">
        {results.length ? (
          results.map((note) => (
            <button key={note.id} className="search-result" onClick={() => openNote(note.id)}>
              <span>{note.title || 'Untitled note'}</span>
              <small>{note.text || 'No content yet'}</small>
              <em>{formatUpdatedAt(note.updatedAt)}</em>
            </button>
          ))
        ) : (
          <EmptyState
            icon={Search}
            title="No matches"
            message="Try a different phrase, title, or tag."
            action="Create note"
            onAction={onCreateNote}
          />
        )}
      </div>
    </section>
  )
}

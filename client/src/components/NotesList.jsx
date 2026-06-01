import { ArchiveX, FilePlus2, Search } from 'lucide-react'
import { useMemo } from 'react'
import { useNoteStore } from '../store/useNoteStore.js'
import { formatUpdatedAt } from '../utils/notes.js'
import { EmptyState } from './EmptyState.jsx'

export function NotesList() {
  const notes = useNoteStore((state) => state.notes)
  const query = useNoteStore((state) => state.query)
  const filter = useNoteStore((state) => state.filter)
  const activeTag = useNoteStore((state) => state.activeTag)
  const selectedId = useNoteStore((state) => state.selectedId)
  const selectNote = useNoteStore((state) => state.selectNote)
  const createNote = useNoteStore((state) => state.createNote)
  const setQuery = useNoteStore((state) => state.setQuery)

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return notes.filter((note) => {
      const matchesFilter =
        filter === 'trash'
          ? note.trashed
          : !note.trashed &&
            (filter === 'all' ||
              filter === 'tags' ||
              (filter === 'favorites' && note.favorite) ||
              (filter === 'tag' && note.tags.includes(activeTag)))

      const matchesQuery =
        !normalizedQuery ||
        [note.title, note.text, note.tags.join(' ')].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        )

      return matchesFilter && matchesQuery
    })
  }, [activeTag, filter, notes, query])

  const heading =
    filter === 'favorites'
      ? 'Favorites'
      : filter === 'trash'
        ? 'Trash'
        : filter === 'tag'
          ? `#${activeTag}`
          : 'All Notes'

  return (
    <section className="notes-list" aria-label="Notes">
      <div className="mobile-topbar">
        <div className="mobile-brand">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          <div>
            <h1>NoteFlow</h1>
            <p>Offline notes</p>
          </div>
        </div>
        <button className="icon-button" onClick={createNote} aria-label="Create note">
          <FilePlus2 size={19} aria-hidden="true" />
        </button>
      </div>

      <div className="mobile-search">
        <Search size={17} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search notes"
          aria-label="Search notes"
        />
      </div>

      <header className="list-header">
        <div>
          <p className="eyebrow">{filteredNotes.length} notes</p>
          <h2>{heading}</h2>
        </div>
        <button className="icon-button" onClick={createNote} aria-label="Create note">
          <FilePlus2 size={19} aria-hidden="true" />
        </button>
      </header>

      <div className="note-scroll">
        {filteredNotes.length ? (
          filteredNotes.map((note) => (
            <button
              key={note.id}
              className={selectedId === note.id ? 'note-card active' : 'note-card'}
              onClick={() => selectNote(note.id)}
            >
              <span className="note-card-title">{note.title || 'Untitled note'}</span>
              <span className="note-preview">{note.text || 'No content yet'}</span>
              <span className="note-meta">
                <span>{formatUpdatedAt(note.updatedAt)}</span>
                <span className="mini-tags">
                  {note.tags.slice(0, 2).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </span>
              </span>
            </button>
          ))
        ) : (
          <EmptyState
            icon={ArchiveX}
            title="Nothing here yet"
            message="Create a note or change your search to bring ideas back into view."
            action="Create note"
            onAction={createNote}
          />
        )}
      </div>
    </section>
  )
}

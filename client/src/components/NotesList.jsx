import { ArchiveX, FilePlus2, Menu, Search, Trash2 } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { useNoteStore } from '../store/useNoteStore.js'
import { formatUpdatedAt } from '../utils/notes.js'
import { EmptyState } from './EmptyState.jsx'
import { StatusIndicator } from './StatusIndicator.jsx'

export function NotesList({ onOpenMenu, onOpenSearch, onOpenEditor, onCreateNote }) {
  const notes = useNoteStore((state) => state.notes)
  const query = useNoteStore((state) => state.query)
  const filter = useNoteStore((state) => state.filter)
  const activeTag = useNoteStore((state) => state.activeTag)
  const selectedId = useNoteStore((state) => state.selectedId)
  const selectNote = useNoteStore((state) => state.selectNote)
  const moveToTrash = useNoteStore((state) => state.moveToTrash)
  const touchStart = useRef(null)

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

  const openNote = (id) => {
    selectNote(id)
    onOpenEditor?.()
  }

  const handlePointerDown = (event, id) => {
    touchStart.current = { id, x: event.clientX, y: event.clientY }
  }

  const handlePointerUp = (event, note) => {
    if (!touchStart.current || touchStart.current.id !== note.id) return
    const deltaX = event.clientX - touchStart.current.x
    const deltaY = Math.abs(event.clientY - touchStart.current.y)
    touchStart.current = null

    if (!note.trashed && deltaX < -78 && deltaY < 44) {
      moveToTrash(note.id)
    }
  }

  return (
    <section className="notes-list" aria-label="Notes">
      <div className="mobile-topbar">
        <button className="icon-button" onClick={onOpenMenu} aria-label="Open menu">
          <Menu size={21} aria-hidden="true" />
        </button>
        <div className="mobile-brand">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          <div>
            <h1>NoteFlow</h1>
            <p>Offline notes</p>
          </div>
        </div>
        <StatusIndicator compact />
      </div>

      <button className="mobile-search-trigger" onClick={onOpenSearch}>
        <Search size={18} aria-hidden="true" />
        <span>{query || 'Search notes'}</span>
      </button>

      <header className="list-header">
        <div>
          <p className="eyebrow">{filteredNotes.length} notes</p>
          <h2>{heading}</h2>
        </div>
        <button className="icon-button desktop-create" onClick={onCreateNote} aria-label="Create note">
          <FilePlus2 size={19} aria-hidden="true" />
        </button>
      </header>

      <div className="note-scroll">
        {filteredNotes.length ? (
          filteredNotes.map((note) => (
            <button
              key={note.id}
              className={selectedId === note.id ? 'note-card active' : 'note-card'}
              onClick={() => openNote(note.id)}
              onPointerDown={(event) => handlePointerDown(event, note.id)}
              onPointerUp={(event) => handlePointerUp(event, note)}
            >
              <span className="note-swipe-hint">
                <Trash2 size={15} aria-hidden="true" />
                Swipe left
              </span>
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
            onAction={onCreateNote}
          />
        )}
      </div>

      <button className="mobile-fab" onClick={onCreateNote} aria-label="Create note">
        <FilePlus2 size={24} aria-hidden="true" />
      </button>
    </section>
  )
}

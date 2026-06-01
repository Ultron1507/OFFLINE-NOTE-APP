import { FileText, Plus, Star, Tags, Trash2 } from 'lucide-react'
import { useNoteStore } from '../store/useNoteStore.js'

const items = [
  { id: 'all', label: 'All', icon: FileText },
  { id: 'favorites', label: 'Saved', icon: Star },
  { id: 'tags', label: 'Tags', icon: Tags },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]

export function BottomNav() {
  const filter = useNoteStore((state) => state.filter)
  const setFilter = useNoteStore((state) => state.setFilter)
  const createNote = useNoteStore((state) => state.createNote)

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {items.slice(0, 2).map((item) => {
        const Icon = item.icon
        return (
          <button key={item.id} className={filter === item.id ? 'active' : ''} onClick={() => setFilter(item.id)}>
            <Icon size={18} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        )
      })}
      <button className="compose-button" onClick={createNote} aria-label="Create note">
        <Plus size={22} aria-hidden="true" />
      </button>
      {items.slice(2).map((item) => {
        const Icon = item.icon
        return (
          <button key={item.id} className={filter === item.id ? 'active' : ''} onClick={() => setFilter(item.id)}>
            <Icon size={18} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

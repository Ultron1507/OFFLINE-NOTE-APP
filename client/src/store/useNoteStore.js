import { create } from 'zustand'
import { getAllNotes, saveNote, saveNotes } from '../db/notesDb.js'

const now = () => new Date().toISOString()

const sampleNotes = [
  {
    id: crypto.randomUUID(),
    title: 'Welcome to NoteFlow',
    content:
      '<p>This is your calm, offline-first note space. Every title change, paragraph, tag, and favorite is saved locally as you work.</p><p>Try the AI actions above the editor. They run locally as polished helpers, so the interface feels complete even before you connect a model API.</p>',
    text:
      'This is your calm, offline-first note space. Every title change, paragraph, tag, and favorite is saved locally as you work. Try the AI actions above the editor.',
    tags: ['getting-started', 'offline'],
    favorite: true,
    trashed: false,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Product Ideas',
    content:
      '<h2>June roadmap</h2><ul><li>Capture notes instantly on mobile.</li><li>Keep the editor quiet and focused.</li><li>Sync in the background when online.</li></ul>',
    text: 'June roadmap. Capture notes instantly on mobile. Keep the editor quiet and focused. Sync in the background when online.',
    tags: ['planning', 'product'],
    favorite: false,
    trashed: false,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Writing Draft',
    content:
      '<p>The best note apps disappear while you think. They give structure only when you need it and otherwise leave the page open.</p>',
    text: 'The best note apps disappear while you think. They give structure only when you need it and otherwise leave the page open.',
    tags: ['writing'],
    favorite: false,
    trashed: false,
    createdAt: now(),
    updatedAt: now(),
  },
]

const normalize = (note) => ({
  ...note,
  tags: Array.isArray(note.tags) ? note.tags : [],
  favorite: Boolean(note.favorite),
  trashed: Boolean(note.trashed),
})

const persist = (note) => {
  saveNote(note).catch((error) => {
    console.error('Unable to persist note', error)
  })
}

export const useNoteStore = create((set, get) => ({
  hydrated: false,
  notes: [],
  selectedId: null,
  query: '',
  filter: 'all',
  activeTag: null,
  toast: [],
  syncing: false,

  loadNotes: async () => {
    const storedNotes = await getAllNotes()
    const notes = storedNotes.length ? storedNotes.map(normalize) : sampleNotes

    if (!storedNotes.length) {
      await saveNotes(notes)
    }

    set({
      hydrated: true,
      notes,
      selectedId: notes.find((note) => !note.trashed)?.id ?? notes[0]?.id ?? null,
    })
  },

  setQuery: (query) => set({ query }),
  setFilter: (filter) => set({ filter, activeTag: null }),
  setActiveTag: (activeTag) => set({ activeTag, filter: 'tag' }),
  selectNote: (selectedId) => set({ selectedId }),

  createNote: () => {
    const timestamp = now()
    const note = {
      id: crypto.randomUUID(),
      title: 'Untitled note',
      content: '<p></p>',
      text: '',
      tags: [],
      favorite: false,
      trashed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    persist(note)
    set((state) => ({
      notes: [note, ...state.notes],
      selectedId: note.id,
      filter: 'all',
      activeTag: null,
    }))
    get().notify('New note created')
  },

  updateNote: (id, patch) => {
    set((state) => {
      const updatedNotes = state.notes
        .map((note) => {
          if (note.id !== id) return note
          const updatedNote = normalize({ ...note, ...patch, updatedAt: now() })
          persist(updatedNote)
          return updatedNote
        })
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

      return { notes: updatedNotes }
    })
  },

  toggleFavorite: (id) => {
    const note = get().notes.find((item) => item.id === id)
    if (!note) return
    get().updateNote(id, { favorite: !note.favorite })
    get().notify(note.favorite ? 'Removed from favorites' : 'Added to favorites')
  },

  moveToTrash: (id) => {
    get().updateNote(id, { trashed: true })
    const nextNote = get().notes.find((note) => note.id !== id && !note.trashed)
    set({ selectedId: nextNote?.id ?? null, filter: 'trash' })
    get().notify('Moved note to trash')
  },

  restoreNote: (id) => {
    get().updateNote(id, { trashed: false })
    set({ selectedId: id, filter: 'all' })
    get().notify('Note restored')
  },

  notify: (message) => {
    const id = crypto.randomUUID()
    set((state) => ({ toast: [...state.toast, { id, message }] }))
    window.setTimeout(() => {
      set((state) => ({ toast: state.toast.filter((item) => item.id !== id) }))
    }, 2600)
  },

  simulateSync: () => {
    if (!navigator.onLine) {
      get().notify('Offline changes are saved locally')
      return
    }

    set({ syncing: true })
    window.setTimeout(() => {
      set({ syncing: false })
      get().notify('Workspace synced')
    }, 900)
  },
}))

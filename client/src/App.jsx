import { useEffect } from 'react'
import './App.css'
import { BottomNav } from './components/BottomNav.jsx'
import { EditorPane } from './components/EditorPane.jsx'
import { NotesList } from './components/NotesList.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { ToastStack } from './components/ToastStack.jsx'
import { useNoteStore } from './store/useNoteStore.js'

function App() {
  const loadNotes = useNoteStore((state) => state.loadNotes)
  const hydrated = useNoteStore((state) => state.hydrated)

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  return (
    <div className="app-shell">
      <Sidebar />
      <NotesList />
      <EditorPane />
      <BottomNav />
      <ToastStack />
      {!hydrated && (
        <div className="boot-screen" role="status" aria-live="polite">
          <div className="brand-mark">N</div>
          <p>Opening your workspace...</p>
        </div>
      )}
    </div>
  )
}

export default App

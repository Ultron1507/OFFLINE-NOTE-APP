import { useEffect, useState } from 'react'
import './App.css'
import { BottomNav } from './components/BottomNav.jsx'
import { EditorPane } from './components/EditorPane.jsx'
import { NotesList } from './components/NotesList.jsx'
import { SearchScreen } from './components/SearchScreen.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { ToastStack } from './components/ToastStack.jsx'
import { useNoteStore } from './store/useNoteStore.js'

function App() {
  const loadNotes = useNoteStore((state) => state.loadNotes)
  const hydrated = useNoteStore((state) => state.hydrated)
  const createNote = useNoteStore((state) => state.createNote)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileScreen, setMobileScreen] = useState('home')
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleCreateNote = () => {
    createNote()
    setMobileScreen('editor')
    setDrawerOpen(false)
  }

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  const openEditor = () => setMobileScreen('editor')
  const closeEditor = () => setMobileScreen('home')
  const openSearch = () => setMobileScreen('search')
  const openHome = () => setMobileScreen('home')

  return (
    <div className={`app-shell mobile-${mobileScreen}`}>
      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreateNote={handleCreateNote}
        onNavigate={openHome}
        canInstall={Boolean(installPrompt)}
        onInstall={handleInstall}
      />

      <NotesList
        onOpenMenu={() => setDrawerOpen(true)}
        onOpenSearch={openSearch}
        onOpenEditor={openEditor}
        onCreateNote={handleCreateNote}
      />

      <SearchScreen
        active={mobileScreen === 'search'}
        onBack={openHome}
        onOpenEditor={openEditor}
        onCreateNote={handleCreateNote}
      />

      <EditorPane
        mobileOpen={mobileScreen === 'editor'}
        onBack={closeEditor}
      />

      <BottomNav
        activeScreen={mobileScreen}
        onHome={openHome}
        onSearch={openSearch}
        onCreateNote={handleCreateNote}
        canInstall={Boolean(installPrompt)}
        onInstall={handleInstall}
      />

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

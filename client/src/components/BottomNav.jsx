import { Download, Home, Plus, Search, UserRound } from 'lucide-react'
import { useState } from 'react'
import { StatusIndicator } from './StatusIndicator.jsx'

export function BottomNav({ activeScreen, onHome, onSearch, onCreateNote, canInstall, onInstall }) {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <button className={activeScreen === 'home' ? 'active' : ''} onClick={onHome}>
          <Home size={20} aria-hidden="true" />
          <span>Home</span>
        </button>
        <button className={activeScreen === 'search' ? 'active' : ''} onClick={onSearch}>
          <Search size={20} aria-hidden="true" />
          <span>Search</span>
        </button>
        <button className="compose-button" onClick={onCreateNote} aria-label="Create note">
          <Plus size={25} aria-hidden="true" />
        </button>
        <button onClick={() => setProfileOpen(true)}>
          <UserRound size={20} aria-hidden="true" />
          <span>Profile</span>
        </button>
      </nav>

      <div className={profileOpen ? 'sheet-backdrop open' : 'sheet-backdrop'} onClick={() => setProfileOpen(false)} />
      <section className={profileOpen ? 'mobile-sheet open' : 'mobile-sheet'} aria-label="Profile and app actions">
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>NoteFlow</h2>
          </div>
          <StatusIndicator compact />
        </div>
        <button className="sheet-action" onClick={onInstall} disabled={!canInstall}>
          <Download size={18} aria-hidden="true" />
          <span>{canInstall ? 'Install app' : 'App ready offline'}</span>
        </button>
      </section>
    </>
  )
}

import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNoteStore } from '../store/useNoteStore.js'

export function StatusIndicator({ compact = false }) {
  const [online, setOnline] = useState(navigator.onLine)
  const syncing = useNoteStore((state) => state.syncing)
  const simulateSync = useNoteStore((state) => state.simulateSync)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  useEffect(() => {
    if (online) simulateSync()
  }, [online, simulateSync])

  return (
    <button
      className={compact ? 'status-card compact' : 'status-card'}
      onClick={simulateSync}
      aria-live="polite"
      aria-label={online ? 'Online. Sync workspace.' : 'Offline. Changes are saved locally.'}
    >
      <span className={online ? 'status-dot online' : 'status-dot offline'} />
      <span>{online ? 'Online' : 'Offline'}</span>
      {online && <RefreshCw size={15} className={syncing ? 'spin' : ''} aria-hidden="true" />}
    </button>
  )
}

import { CheckCircle2 } from 'lucide-react'
import { useNoteStore } from '../store/useNoteStore.js'

export function ToastStack() {
  const toast = useNoteStore((state) => state.toast)

  return (
    <div className="toast-stack" aria-live="polite" aria-relevant="additions">
      {toast.map((item) => (
        <div className="toast" key={item.id}>
          <CheckCircle2 size={17} aria-hidden="true" />
          {item.message}
        </div>
      ))}
    </div>
  )
}

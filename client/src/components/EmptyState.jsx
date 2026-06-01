export function EmptyState({ icon: Icon, title, message, action, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      {action && (
        <button className="secondary-button" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  )
}

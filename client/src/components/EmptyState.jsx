import './EmptyState.css'

const EmptyState = ({ icon, title, subtitle, action }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-subtitle">{subtitle}</p>
      {action && action}
    </div>
  )
}

export default EmptyState
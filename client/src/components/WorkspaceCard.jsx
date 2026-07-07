import { useNavigate } from 'react-router-dom'
import './WorkspaceCard.css'

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const WorkspaceCard = ({ workspace, onDelete }) => {
  const navigate = useNavigate()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleDelete = (e) => {
    e.stopPropagation() // prevent card click when clicking delete
    onDelete(workspace)
  }

  return (
    <div
      className="workspace-card"
      onClick={() => navigate(`/workspace/${workspace._id}`)}
    >
      {/* Color strip */}
      <div
        className="workspace-card-strip"
        style={{ backgroundColor: workspace.color || '#0ABFBC' }}
      />

      {/* Header */}
      <div className="workspace-card-header">
        <span className="workspace-card-icon">{workspace.icon}</span>
        <div className="workspace-card-menu">
          <button
            className="workspace-card-delete"
            onClick={handleDelete}
            title="Delete workspace"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="workspace-card-body">
        <h3 className="workspace-card-name">{workspace.name}</h3>
        {workspace.description && (
          <p className="workspace-card-desc">{workspace.description}</p>
        )}
      </div>

      {/* Footer */}
      <div className="workspace-card-footer">
        <span className="workspace-card-date">
          {formatDate(workspace.createdAt)}
        </span>
      </div>
    </div>
  )
}

export default WorkspaceCard
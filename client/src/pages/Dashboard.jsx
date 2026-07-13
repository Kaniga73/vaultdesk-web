import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import WorkspaceCard from '../components/WorkspaceCard'
import Modal from '../components/Modal'
import { useToast } from '../context/ToastContext'
import EmptyState from '../components/EmptyState'
import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
} from '../services/workspaceService'
import './Dashboard.css'
import {motion} from 'motion/react'

// ── Icons ─────────────────────────────────────
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

// ── Workspace Icons to pick from ───────────────
const WORKSPACE_ICONS = [
  '📁', '🎓', '💼', '🚀', '🔬', '📝',
  '💡', '🎯', '📊', '🌟', '🔥', '💻',
]

const WORKSPACE_COLORS = [
  '#0ABFBC', '#6366f1', '#f59e0b',
  '#10b981', '#ef4444', '#8b5cf6',
  '#ec4899', '#3b82f6', '#14b8a6',
]

// ── Loading Skeleton ───────────────────────────
const SkeletonGrid = () => (
  <div className="skeleton-grid">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="skeleton-card" />
    ))}
  </div>
)

// ── Main Component ─────────────────────────────
const Dashboard = () => {
  const { user } = useAuth()
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    color: '#0ABFBC',
  })

  // Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      const data = await getWorkspaces()
      setWorkspaces(data)
    } catch (error) {
      console.error('Failed to fetch workspaces:', error)
    } finally {
      setLoading(false)
    }
  }

const handleCreate = async () => {
  if (!formData.name.trim()) return
  setCreating(true)
  try {
    const newWorkspace = await createWorkspace(formData)
    setWorkspaces(prev => [newWorkspace, ...prev])
    setShowCreateModal(false)
    setFormData({ name: '', description: '', icon: '📁', color: '#0ABFBC' })
    showToast('Workspace created successfully!')
  } catch (error) {
    showToast('Failed to create workspace', 'error')
  } finally {
    setCreating(false)
  }
}

  const handleDeleteClick = (workspace) => {
    setSelectedWorkspace(workspace)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
  if (!selectedWorkspace) return
  setDeleting(true)
  try {
    await deleteWorkspace(selectedWorkspace._id)
    setWorkspaces(prev =>
      prev.filter(w => w._id !== selectedWorkspace._id)
    )
    setShowDeleteModal(false)
    setSelectedWorkspace(null)
    showToast('Workspace deleted')
  } catch (error) {
    showToast('Failed to delete workspace', 'error')
  } finally {
    setDeleting(false)
  }
}

  return (
    <div className="dashboard">
      <Navbar />

         <motion.div
      className="dashboard-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              My Workspaces
            </h1>
            <p className="page-subtitle">
              {workspaces.length > 0
                ? `${workspaces.length} workspace${workspaces.length > 1 ? 's' : ''}`
                : 'Organize your knowledge into workspaces'}
            </p>
          </div>
          <button
            className="btn-create"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusIcon />
            New Workspace
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid />
        ) : workspaces.length === 0 ? (
          <EmptyState
            icon="📁"
            title="No workspaces yet"
            subtitle="Create your first workspace to start organizing your knowledge and notes."
            action={
              <button
                className="btn-create"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon />
                Create Workspace
              </button>
            }
          />
        ) : (
        <div className="workspace-grid">
  {workspaces.map((workspace, index) => (
    <motion.div
      key={workspace._id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <WorkspaceCard
        workspace={workspace}
        onDelete={handleDeleteClick}
      />
    </motion.div>
  ))}
</div>
   )}      


      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          title="Create Workspace"
          onClose={() => setShowCreateModal(false)}
        >
          <div className="modal-body">

            {/* Name */}
            <div className="form-field">
              <label className="form-label">Workspace Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. College Stuff"
                  className="form-input"
                  autoFocus
                  maxLength={50}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-field">
              <label className="form-label">Description (optional)</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="What's this workspace about?"
                  className="form-input"
                  maxLength={200}
                />
              </div>
            </div>

            {/* Icon Picker */}
            <div className="form-field">
              <label className="form-label">Icon</label>
              <div className="icon-picker">
                {WORKSPACE_ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                    onClick={() => setFormData(p => ({ ...p, icon }))}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="form-field">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {WORKSPACE_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, color }))}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: formData.color === color
                        ? `3px solid ${color}`
                        : '3px solid transparent',
                      outline: formData.color === color
                        ? `2px solid ${color}`
                        : 'none',
                      outlineOffset: '2px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  />
                ))}
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button
              className="btn-secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleCreate}
              disabled={creating || !formData.name.trim()}
              style={{ flex: 1 }}
            >
              {creating ? (
                <>
                  <span className="spinner" />
                  Creating...
                </>
              ) : (
                'Create Workspace'
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <Modal
          title="Delete Workspace"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="modal-body">
            <p className="delete-modal-text">
              Are you sure you want to delete{' '}
              <span className="delete-modal-name">
                "{selectedWorkspace?.name}"
              </span>
              ? This will also delete all topics inside it. This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button
              className="btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Workspace'}
            </button>
          </div>
        </Modal>
      )}

    </motion.div>
    </div>
  )
}

export default Dashboard
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TopicCard from '../components/TopicCard'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import { getWorkspace } from '../services/workspaceService'
import {
  getTopics,
  createTopic,
  deleteTopic,
} from '../services/topicService'
import './WorkspacePage.css'
import { motion } from "motion/react";

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const TOPIC_ICONS = [
  '📌', '📝', '🗃️', '💡', '🔬', '📊',
  '🎯', '🔥', '💻', '🌟', '📚', '⚡',
]

const SkeletonList = () => (
  <div className="skeleton-list">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="skeleton-topic" />
    ))}
  </div>
)

const WorkspacePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [workspace, setWorkspace] = useState(null)
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📌',
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [workspaceData, topicsData] = await Promise.all([
        getWorkspace(id),
        getTopics(id),
      ])
      setWorkspace(workspaceData)
      setTopics(topicsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.name.trim()) return
    setCreating(true)
    try {
      const newTopic = await createTopic(id, formData)
      setTopics(prev => [newTopic, ...prev])
      setShowCreateModal(false)
      setFormData({ name: '', description: '', icon: '📌' })
    } catch (error) {
      console.error('Failed to create topic:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteClick = (topic) => {
    setSelectedTopic(topic)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTopic) return
    setDeleting(true)
    try {
      await deleteTopic(selectedTopic._id)
      setTopics(prev => prev.filter(t => t._id !== selectedTopic._id))
      setShowDeleteModal(false)
      setSelectedTopic(null)
    } catch (error) {
      console.error('Failed to delete topic:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="workspace-page">
      <Navbar />
      <motion.div
        className="workspace-page-content"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >

        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <BackIcon />
          Back to Workspaces
        </button>

        {/* Header */}
        {workspace && (
          <div className="workspace-page-header">
            <div>
              <div className="workspace-page-title-row">
                <span className="workspace-page-icon">{workspace.icon}</span>
                <h1 className="workspace-page-name">{workspace.name}</h1>
              </div>
              {workspace.description && (
                <p className="workspace-page-desc">{workspace.description}</p>
              )}
            </div>
            <button
              className="btn-create"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusIcon />
              New Topic
            </button>
          </div>
        )}

        {/* Topics */}
        {loading ? (
          <SkeletonList />
        ) : topics.length === 0 ? (
          <EmptyState
            icon="📌"
            title="No topics yet"
            subtitle="Create your first topic to start adding notes inside this workspace."
            action={
              <button
                className="btn-create"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon />
                Create Topic
              </button>
            }
          />
        ) : (
          <div className="topics-list">
            {topics.map(topic => (
              <TopicCard
                key={topic._id}
                topic={topic}
                onDelete={handleDeleteClick}
                onClick={() => navigate(`/topic/${topic._id}`)}
              />
            ))}
          </div>
        )}

      
       </motion.div>
       

      {/* Create Topic Modal */}
      {showCreateModal && (
        <Modal
          title="Create Topic"
          onClose={() => setShowCreateModal(false)}
        >
          <div className="modal-body">

            <div className="form-field">
              <label className="form-label">Topic Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. DBMS"
                  className="form-input"
                  autoFocus
                  maxLength={100}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Description (optional)</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="What's this topic about?"
                  className="form-input"
                  maxLength={300}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Icon</label>
              <div className="icon-picker">
                {TOPIC_ICONS.map(icon => (
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
                'Create Topic'
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Topic Modal */}
      {showDeleteModal && (
        <Modal
          title="Delete Topic"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="modal-body">
            <p className="delete-modal-text">
              Are you sure you want to delete{' '}
              <span className="delete-modal-name">
                "{selectedTopic?.name}"
              </span>
              ? All notes inside it will also be deleted. This cannot be undone.
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
              {deleting ? 'Deleting...' : 'Delete Topic'}
            </button>
          </div>
        </Modal>
      )}

   
   
    </div>
  )
}

export default WorkspacePage
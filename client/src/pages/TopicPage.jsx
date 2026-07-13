import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import { getWorkspace } from '../services/workspaceService'
import { getTopics } from '../services/topicService'
import {
  getNotes,
  createNote,
  deleteNote,
} from '../services/noteService'
import './TopicPage.css'
import {motion} from 'motion/react'

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const REVISION_LABELS = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'completed': 'Completed',
}

const SkeletonNotes = () => (
  <div className="skeleton-notes">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="skeleton-note" />
    ))}
  </div>
)

const TopicPage = () => {
  const { topicId } = useParams()
  const navigate = useNavigate()

  const [topic, setTopic] = useState(null)
  const [workspace, setWorkspace] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')

  useEffect(() => {
    fetchData()
  }, [topicId])

const fetchData = async () => {
  try {
    console.log('Fetching notes for topicId:', topicId)
    const notesData = await getNotes(topicId)
    console.log('Notes fetched:', notesData)
    setNotes(notesData)
    setTopic({ _id: topicId })
  } catch (error) {
    console.error('Failed to fetch notes — full error:', error)
    console.error('Response:', error.response?.data)
    // Temporarily comment out navigate so we can see the error
    // navigate('/dashboard')
  } finally {
    setLoading(false)
  }
}

  const handleCreate = async () => {
    if (!noteTitle.trim()) return
    setCreating(true)
    try {
      const newNote = await createNote(topicId, {
        title: noteTitle,
        content: '',
        tags: [],
        revisionStatus: 'not-started',
      })
      // Navigate directly to editor for new note
      navigate(`/note/${newNote._id}`)
    } catch (error) {
      console.error('Failed to create note:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteClick = (e, note) => {
    e.stopPropagation()
    setSelectedNote(note)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedNote) return
    setDeleting(true)
    try {
      await deleteNote(selectedNote._id)
      setNotes(prev => prev.filter(n => n._id !== selectedNote._id))
      setShowDeleteModal(false)
      setSelectedNote(null)
    } catch (error) {
      console.error('Failed to delete note:', error)
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="topic-page">
      <Navbar />

      <motion.div
  className="topic-page-content"
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button
            className="breadcrumb-link"
            onClick={() => navigate('/dashboard')}
          >
            Workspaces
          </button>
          <span className="breadcrumb-sep">›</span>
          <button
            className="breadcrumb-link"
            onClick={() => navigate(-1)}
          >
            Topics
          </button>
          <span className="breadcrumb-sep">›</span>
          <span>Notes</span>
        </div>

        {/* Header */}
        <div className="workspace-page-header">
          <div>
            <h1 className="workspace-page-name">Notes</h1>
            <p className="workspace-page-desc">
              {notes.length > 0
                ? `${notes.length} note${notes.length > 1 ? 's' : ''}`
                : 'Start capturing your knowledge'}
            </p>
          </div>
          <button
            className="btn-create"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusIcon />
            New Note
          </button>
        </div>

        {/* Notes */}
        {loading ? (
          <SkeletonNotes />
        ) : notes.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No notes yet"
            subtitle="Create your first note and start capturing your knowledge."
            action={
              <button
                className="btn-create"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon />
                Create Note
              </button>
            }
          />
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <div
                key={note._id}
                className="note-card"
                onClick={() => navigate(`/note/${note._id}`)}
              >
                <div className="note-card-header">
                  <h3 className="note-card-title">{note.title}</h3>
                  <button
                    className="note-card-delete"
                    onClick={(e) => handleDeleteClick(e, note)}
                    title="Delete note"
                  >
                    <TrashIcon />
                  </button>
                </div>

                {note.tags && note.tags.length > 0 && (
                  <div className="note-card-tags">
                    {note.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="note-tag">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="note-card-footer">
                  <span className="note-card-date">
                    {formatDate(note.updatedAt)}
                  </span>
                  <span className={`revision-badge ${note.revisionStatus}`}>
                    {REVISION_LABELS[note.revisionStatus]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </motion.div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <Modal
          title="New Note"
          onClose={() => setShowCreateModal(false)}
        >
          <div className="modal-body">
            <div className="form-field">
              <label className="form-label">Note Title</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="e.g. Normalization in DBMS"
                  className="form-input"
                  autoFocus
                  maxLength={200}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleCreate()
                  }}
                />
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
              disabled={creating || !noteTitle.trim()}
              style={{ flex: 1 }}
            >
              {creating ? (
                <>
                  <span className="spinner" />
                  Creating...
                </>
              ) : (
                'Create & Open →'
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal
          title="Delete Note"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="modal-body">
            <p className="delete-modal-text">
              Are you sure you want to delete{' '}
              <span className="delete-modal-name">
                "{selectedNote?.title}"
              </span>
              ? This cannot be undone.
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
              {deleting ? 'Deleting...' : 'Delete Note'}
            </button>
          </div>
        </Modal>
      )}

    </div>
  )
}

export default TopicPage
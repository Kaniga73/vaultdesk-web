import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Navbar from '../components/Navbar'
import { getNote, updateNote } from '../services/noteService'
import { autoFormatPastedText } from '../utils/autoFormat'
import './NotePage.css'
import { exportNotePDF } from '../services/noteService'

// ── Save Status ────────────────────────────────
const SAVE_STATUS = {
  IDLE: 'idle',
  SAVING: 'saving',
  SAVED: 'saved',
}

// ── Toolbar Button ─────────────────────────────
const ToolbarBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    className={`toolbar-btn ${active ? 'active' : ''}`}
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
)

// ── Main Component ─────────────────────────────
const NotePage = () => {
  const { noteId } = useParams()
  const navigate = useNavigate()

  const [note, setNote] = useState(null)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [revisionStatus, setRevisionStatus] = useState('not-started')
  const [saveStatus, setSaveStatus] = useState(SAVE_STATUS.IDLE)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const saveTimerRef = useRef(null)

  // ── Tiptap Editor Setup ──────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note... or paste rough text to auto-format it.',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
      // Auto-format on paste
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData
        if (!clipboardData) return false

        const plainText = clipboardData.getData('text/plain')
        const htmlText = clipboardData.getData('text/html')

        // Only auto-format if plain text is pasted (not already HTML)
        if (plainText && !htmlText) {
          event.preventDefault()
          const formatted = autoFormatPastedText(plainText)
          editor.commands.insertContent(formatted)
          return true
        }

        return false
      },
    },
    onUpdate: () => {
      // Auto-save with debounce
      triggerAutoSave()
    },
  })

  // ── Fetch Note ───────────────────────────────
  useEffect(() => {
    fetchNote()
  }, [noteId])

  const fetchNote = async () => {
    try {
      const data = await getNote(noteId)
      setNote(data)
      setTitle(data.title)
      setTags(data.tags || [])
      setRevisionStatus(data.revisionStatus)

      if (editor && data.content) {
        editor.commands.setContent(data.content)
      }
  } catch (error) {
  console.error('Failed to fetch note — full error:', error)
  console.error('Response data:', error.response?.data)
  console.error('Status:', error.response?.status)
  // Don't navigate away yet, show error instead
  setLoading(false)
}
  }

  // When editor loads after note data is ready
  useEffect(() => {
    if (editor && note?.content) {
      editor.commands.setContent(note.content)
    }
  }, [editor, note])

  // ── Auto-save Logic ──────────────────────────
  const triggerAutoSave = useCallback(() => {
    setSaveStatus(SAVE_STATUS.SAVING)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveNote()
    }, 1500) // save 1.5 seconds after user stops typing
  }, [title, tags, revisionStatus])

  const saveNote = useCallback(async () => {
    if (!editor) return
    try {
      await updateNote(noteId, {
        title,
        content: editor.getHTML(),
        tags,
        revisionStatus,
      })
      setSaveStatus(SAVE_STATUS.SAVED)
      setTimeout(() => setSaveStatus(SAVE_STATUS.IDLE), 2000)
    } catch (error) {
      console.error('Failed to save note:', error)
      setSaveStatus(SAVE_STATUS.IDLE)
    }
  }, [noteId, title, tags, revisionStatus, editor])

  // Save when title/tags/status change too
  useEffect(() => {
    if (note) triggerAutoSave()
  }, [title, tags, revisionStatus])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  // ── Tag Handling ─────────────────────────────
  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (!tags.includes(newTag) && tags.length < 10) {
        setTags(prev => [...prev, newTag])
      }
      setTagInput('')
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(t => t !== tagToRemove))
  }

  if (loading) {
    return (
      <div className="note-page">
        <Navbar />
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', flex: 1, minHeight: '60vh'
        }}>
          <div style={{
            width: '32px', height: '32px',
            border: '2px solid var(--border-color)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite'
          }} />
        </div>
      </div>
    )
  }
  const handleExport = async () => {
  setExporting(true)
  try {
    await exportNotePDF(noteId, title)
  } catch (error) {
    console.error('Export failed:', error)
  } finally {
    setExporting(false)
  }
}

  return (
    <div className="note-page">
      <Navbar />

      {/* Toolbar */}
      <div className="editor-topbar">
        <div className="editor-toolbar-wrap">

          {/* Back */}
          <button
            className="editor-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          {/* Formatting Toolbar */}
          {editor && (
            <div className="editor-toolbar">
              {/* Text style */}
              <div className="toolbar-group">
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  active={editor.isActive('bold')}
                  title="Bold (Ctrl+B)"
                >
                  <strong>B</strong>
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  active={editor.isActive('italic')}
                  title="Italic (Ctrl+I)"
                >
                  <em>I</em>
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  active={editor.isActive('underline')}
                  title="Underline (Ctrl+U)"
                >
                  <u>U</u>
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  active={editor.isActive('highlight')}
                  title="Highlight"
                >
                  H
                </ToolbarBtn>
              </div>

              {/* Headings */}
              <div className="toolbar-group">
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  active={editor.isActive('heading', { level: 1 })}
                  title="Heading 1"
                >
                  H1
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  active={editor.isActive('heading', { level: 2 })}
                  title="Heading 2"
                >
                  H2
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  active={editor.isActive('heading', { level: 3 })}
                  title="Heading 3"
                >
                  H3
                </ToolbarBtn>
              </div>

              {/* Lists */}
              <div className="toolbar-group">
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  active={editor.isActive('bulletList')}
                  title="Bullet List"
                >
                  •≡
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  active={editor.isActive('orderedList')}
                  title="Numbered List"
                >
                  1≡
                </ToolbarBtn>
              </div>

              {/* Blocks */}
              <div className="toolbar-group">
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  active={editor.isActive('blockquote')}
                  title="Blockquote"
                >
                  "
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  active={editor.isActive('codeBlock')}
                  title="Code Block"
                >
                  {'</>'}
                </ToolbarBtn>
              </div>

              {/* Align */}
              <div className="toolbar-group">
                <ToolbarBtn
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  active={editor.isActive({ textAlign: 'left' })}
                  title="Align Left"
                >
                  ≡
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  active={editor.isActive({ textAlign: 'center' })}
                  title="Align Center"
                >
                  ≡
                </ToolbarBtn>
              </div>
            </div>
          )}
        </div>

        {/* Save status + export */}
        <div className="editor-actions">
          <span className={`save-indicator ${saveStatus}`}>
            {saveStatus === SAVE_STATUS.SAVING && '● Saving...'}
            {saveStatus === SAVE_STATUS.SAVED && '✓ Saved'}
          </span>

          <button
            type="button"
            className={`export-pdf-btn ${exporting ? 'is-exporting' : ''}`}
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <span className="spinner" />
                Exporting...
              </>
            ) : (
              <>
                ↓ Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="editor-body">

        {/* Title */}
        <textarea
          className="note-title-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title..."
          rows={1}
          onInput={e => {
            e.target.style.height = 'auto'
            e.target.style.height = e.target.scrollHeight + 'px'
          }}
        />

        {/* Meta row */}
        <div className="note-meta">
          <span className="note-meta-date">
            {note && new Date(note.updatedAt).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </span>

          {/* Revision Status */}
          <select
            className="revision-select"
            value={revisionStatus}
            onChange={e => setRevisionStatus(e.target.value)}
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed ✓</option>
          </select>
        </div>

        {/* Tags */}
        <div className="tags-container" style={{ marginBottom: '20px' }}>
          {tags.map(tag => (
            <span key={tag} className="tag-badge">
              #{tag}
              <button
                type="button"
                className="tag-remove"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className="tag-input"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? 'Add tags (press Enter)...' : ''}
            maxLength={20}
          />
        </div>

        <div className="editor-divider" />

        {/* Tiptap Editor */}
        <EditorContent editor={editor} />

      </div>
    </div>
  )
}

export default NotePage
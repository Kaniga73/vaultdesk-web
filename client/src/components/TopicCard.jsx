import './TopicCard.css'

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const TopicCard = ({ topic, onDelete, onClick }) => {
  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(topic)
  }

  return (
    <div className="topic-card" onClick={onClick}>
      <div className="topic-card-icon">{topic.icon}</div>

      <div className="topic-card-body">
        <h3 className="topic-card-name">{topic.name}</h3>
        {topic.description && (
          <p className="topic-card-desc">{topic.description}</p>
        )}
      </div>

      <div className="topic-card-actions">
        <button
          className="topic-card-btn"
          onClick={handleDelete}
          title="Delete topic"
        >
          <TrashIcon />
        </button>
      </div>

      <ChevronIcon />
    </div>
  )
}

export default TopicCard
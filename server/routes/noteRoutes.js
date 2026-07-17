const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  exportNotePDF,
} = require('../controllers/noteController');

// Search
router.get('/search', protect, searchNotes);

// Nested under topic
router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

// Export PDF
router.get('/:id/export/pdf', protect, exportNotePDF);

// Standalone note operations
router.route('/:id')
  .get(protect, getNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
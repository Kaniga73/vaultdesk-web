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
} = require('../controllers/noteController');

// Search — must be before /:id to avoid conflict
router.get('/search', protect, searchNotes);

// Nested under topic
router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

// Standalone note operations
router.route('/:id')
  .get(protect, getNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
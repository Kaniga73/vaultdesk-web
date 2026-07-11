const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

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
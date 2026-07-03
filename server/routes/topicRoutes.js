const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/authMiddleware');
const {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicController');

// Routes nested under workspace
router.route('/')
  .get(protect, getTopics)
  .post(protect, createTopic);

// Routes for specific topic (not nested)
router.route('/:id')
  .put(protect, updateTopic)
  .delete(protect, deleteTopic);

module.exports = router;
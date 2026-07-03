const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
} = require('../controllers/workspaceController');

router.route('/')
  .get(protect, getWorkspaces)
  .post(protect, createWorkspace);

router.route('/:id')
  .get(protect, getWorkspace)
  .put(protect, updateWorkspace)
  .delete(protect, deleteWorkspace);

module.exports = router;
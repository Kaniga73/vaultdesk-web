const Topic = require('../models/Topic');
const Workspace = require('../models/Workspace');
const Note = require('../models/Note');


// @desc   Get all topics in a workspace
// @route  GET /api/workspaces/:workspaceId/topics
const getTopics = async (req, res) => {
  try {
    // First verify the workspace belongs to this user
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const topics = await Topic.find({ workspace: req.params.workspaceId })
      .sort({ createdAt: -1 });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create a topic
// @route  POST /api/workspaces/:workspaceId/topics
const createTopic = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, icon } = req.body;

    const topic = await Topic.create({
      name,
      description,
      icon,
      workspace: req.params.workspaceId,
      user: req.user._id,
    });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update topic
// @route  PUT /api/topics/:id
const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, icon } = req.body;

    topic.name = name || topic.name;
    topic.description = description ?? topic.description;
    topic.icon = icon || topic.icon;

    const updated = await topic.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete topic
// @route  DELETE /api/topics/:id
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Cascade delete all notes in this topic
    await Note.deleteMany({ topic: req.params.id });

    await topic.deleteOne();
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
};
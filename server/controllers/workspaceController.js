const Workspace = require('../models/Workspace');
const Topic = require('../models/Topic');

// @desc   Get all workspaces for logged in user
// @route  GET /api/workspaces
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create a workspace
// @route  POST /api/workspaces
const createWorkspace = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      icon,
      color,
      user: req.user._id,
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single workspace
// @route  GET /api/workspaces/:id
const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Authorization check - does this workspace belong to the logged in user?
    if (workspace.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update workspace
// @route  PUT /api/workspaces/:id
const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, icon, color } = req.body;

    workspace.name = name || workspace.name;
    workspace.description = description ?? workspace.description;
    workspace.icon = icon || workspace.icon;
    workspace.color = color || workspace.color;

    const updated = await workspace.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete workspace + cascade delete topics
// @route  DELETE /api/workspaces/:id
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Cascade delete - remove all topics belonging to this workspace
    await Topic.deleteMany({ workspace: req.params.id });

    // Now delete the workspace itself
    await workspace.deleteOne();

    // Inside deleteWorkspace, update the cascade section:
    await Note.deleteMany({ workspace: req.params.id });
    await Topic.deleteMany({ workspace: req.params.id });
    await workspace.deleteOne();

    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
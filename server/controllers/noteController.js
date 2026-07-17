const Note = require('../models/Note');
const Topic = require('../models/Topic');
const { generateNotePDF } = require('../services/pdfService');

// @desc   Get all notes in a topic
// @route  GET /api/topics/:topicId/notes
const getNotes = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const notes = await Note.find({ topic: req.params.topicId })
      .select('-content')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single note
// @route  GET /api/notes/:id
const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create note
// @route  POST /api/topics/:topicId/notes
const createNote = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, tags, revisionStatus } = req.body;

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      revisionStatus: revisionStatus || 'not-started',
      topic: req.params.topicId,
      workspace: topic.workspace,
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update note
// @route  PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, tags, revisionStatus, isPinned } = req.body;

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    note.tags = tags ?? note.tags;
    note.revisionStatus = revisionStatus ?? note.revisionStatus;
    note.isPinned = isPinned ?? note.isPinned;

    const updated = await note.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete note
// @route  DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc   Search notes by keyword
// @route  GET /api/notes/search?q=keyword
const searchNotes = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const notes = await Note.find({
      user: req.user._id,
      $text: { $search: q },
    })
      .select('-content')
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const exportNotePDF = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    generateNotePDF(note, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  exportNotePDF,
};
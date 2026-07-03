const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '',
    },
    icon: {
      type: String,
      default: '📁',
    },
    color: {
      type: String,
      default: '#0ABFBC',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
workspaceSchema.index({ user: 1, createdAt: -1 });

const Workspace = mongoose.model('Workspace', workspaceSchema);
module.exports = Workspace;
import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['workout', 'nutrition', 'exercise', 'meal', 'tip'],
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { _id: false });

const MessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant'],
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  liked: {
    type: Boolean,
    default: null,
  },
  cards: [CardSchema],
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
  _id: {
    type: String, // Store client-side UUID as the document ID
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  messages: [MessageSchema],
  pinned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Conversation', ConversationSchema);

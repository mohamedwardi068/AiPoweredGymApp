import Conversation from '../models/Conversation.js';

export async function getConversations(req, res) {
  try {
    const conversations = await Conversation.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
    
    const formatted = conversations.map((c) => ({
      id: c._id,
      title: c.title,
      messages: c.messages,
      pinned: c.pinned,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch conversations error:', error);
    res.status(500).json({ error: 'Server error loading chats' });
  }
}

export async function syncConversation(req, res) {
  try {
    const { id, title, messages, pinned } = req.body;
    if (!id || !title || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Conversation id, title, and messages array are required' });
    }

    let conversation = await Conversation.findOne({ _id: id, userId: req.user.userId });
    
    if (conversation) {
      conversation.title = title;
      conversation.messages = messages;
      if (pinned !== undefined) conversation.pinned = pinned;
      conversation.updatedAt = new Date();
    } else {
      conversation = new Conversation({
        _id: id,
        userId: req.user.userId,
        title,
        messages,
        pinned: pinned || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await conversation.save();
    res.json({ success: true, conversation });
  } catch (error) {
    console.error('Save conversation error:', error);
    res.status(500).json({ error: 'Server error saving conversation' });
  }
}

export async function renameConversation(req, res) {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, updatedAt: new Date() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ success: true, title: conversation.title });
  } catch (error) {
    console.error('Rename error:', error);
    res.status(500).json({ error: 'Server error renaming chat' });
  }
}

export async function pinConversation(req, res) {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.pinned = !conversation.pinned;
    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({ success: true, pinned: conversation.pinned });
  } catch (error) {
    console.error('Pin error:', error);
    res.status(500).json({ error: 'Server error pinning chat' });
  }
}

export async function deleteConversation(req, res) {
  try {
    const result = await Conversation.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error deleting chat' });
  }
}

export async function likeMessage(req, res) {
  try {
    const { liked } = req.body;
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const message = conversation.messages.find((m) => m.id === req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.liked = liked;
    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({ success: true, liked: message.liked });
  } catch (error) {
    console.error('Like message error:', error);
    res.status(500).json({ error: 'Server error setting like status' });
  }
}

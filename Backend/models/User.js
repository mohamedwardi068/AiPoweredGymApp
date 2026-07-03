import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastActiveDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  totalWorkouts: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 175,
  },
  weight: {
    type: Number,
    default: 70,
  },
  goal: {
    type: String,
    enum: ['bulk', 'cut', 'maintain'],
    default: 'maintain',
  },
  targetCaloriesOverride: {
    type: Number,
    default: null,
  },
  favoriteFoods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
  }],
  recentFoods: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', UserSchema);

import mongoose from 'mongoose';

const UserNutritionPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'snack', // breakfast, lunch, dinner, snack
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  ingredients: [String],
  instructions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('UserNutritionPlan', UserNutritionPlanSchema);

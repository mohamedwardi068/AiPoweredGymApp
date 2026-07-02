import mongoose from 'mongoose';

const UserWorkoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  equipment: [String],
  days: [
    {
      dayName: { type: String, required: true },
      targetMuscles: [String],
      exercises: [
        {
          name: { type: String, required: true },
          sets: { type: Number, required: true },
          reps: { type: String, required: true },
          rest: { type: String, required: true },
          notes: String,
        },
      ],
    }
  ],
  calories: Number,
  targetMuscles: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('UserWorkoutPlan', UserWorkoutPlanSchema);

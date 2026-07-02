import mongoose from 'mongoose';

const UserWorkoutScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // Store as ISO date string "YYYY-MM-DD" for easy timezone-safe comparisons
    required: true,
  },
  workoutPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserWorkoutPlan',
    required: true,
  },
  dayIndex: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('UserWorkoutSchedule', UserWorkoutScheduleSchema);

import UserWorkoutPlan from '../models/UserWorkoutPlan.js';
import UserWorkoutSchedule from '../models/UserWorkoutSchedule.js';

export async function getPlans(req, res) {
  try {
    const plans = await UserWorkoutPlan.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    console.error('Fetch validated workouts error:', error);
    res.status(500).json({ error: 'Server error fetching workout plans' });
  }
}

export async function savePlan(req, res) {
  try {
    const { title, difficulty, duration, equipment, exercises, days, calories, targetMuscles } = req.body;
    if (!title || !difficulty || !duration || (!Array.isArray(exercises) && !Array.isArray(days))) {
      return res.status(400).json({ error: 'Workout title, difficulty, duration, and days/exercises are required' });
    }

    const plan = new UserWorkoutPlan({
      userId: req.user.userId,
      title,
      difficulty,
      duration,
      equipment: equipment || [],
      exercises: exercises || [],
      days: days || [],
      calories,
      targetMuscles: targetMuscles || []
    });

    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    console.error('Save validated workout error:', error);
    res.status(500).json({ error: 'Server error saving workout plan' });
  }
}

export async function deletePlan(req, res) {
  try {
    const result = await UserWorkoutPlan.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete validated workout error:', error);
    res.status(500).json({ error: 'Server error deleting workout plan' });
  }
}

export async function getSchedule(req, res) {
  try {
    const schedule = await UserWorkoutSchedule.find({ userId: req.user.userId })
      .populate('workoutPlanId')
      .sort({ date: 1 });
    res.json(schedule);
  } catch (error) {
    console.error('Fetch schedule error:', error);
    res.status(500).json({ error: 'Server error fetching workout schedule' });
  }
}

export async function addSchedule(req, res) {
  try {
    const { date, workoutPlanId, dayIndex = 0 } = req.body;
    if (!date || !workoutPlanId) {
      return res.status(400).json({ error: 'Date and workoutPlanId are required' });
    }

    const workoutPlan = await UserWorkoutPlan.findOne({ _id: workoutPlanId, userId: req.user.userId });
    if (!workoutPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    let scheduleEntry = await UserWorkoutSchedule.findOne({ date, userId: req.user.userId });
    if (scheduleEntry) {
      scheduleEntry.workoutPlanId = workoutPlanId;
      scheduleEntry.dayIndex = dayIndex;
    } else {
      scheduleEntry = new UserWorkoutSchedule({
        userId: req.user.userId,
        date,
        workoutPlanId,
        dayIndex,
      });
    }

    await scheduleEntry.save();
    
    const populated = await UserWorkoutSchedule.findById(scheduleEntry._id).populate('workoutPlanId');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Save schedule error:', error);
    res.status(500).json({ error: 'Server error saving workout schedule' });
  }
}

export async function deleteSchedule(req, res) {
  try {
    const result = await UserWorkoutSchedule.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Schedule entry not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Server error deleting workout schedule' });
  }
}

export async function autoSchedule(req, res) {
  try {
    const { startDate, durationWeeks, trainDays, restDays, workoutPlanId } = req.body;
    if (!startDate || !durationWeeks || trainDays === undefined || restDays === undefined || !workoutPlanId) {
      return res.status(400).json({ error: 'Missing required auto-schedule parameters' });
    }

    const workoutPlan = await UserWorkoutPlan.findOne({ _id: workoutPlanId, userId: req.user.userId });
    if (!workoutPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    const totalDays = parseInt(durationWeeks) * 7;
    const trainCount = parseInt(trainDays);
    const restCount = parseInt(restDays);
    
    const cycleLength = trainCount + restCount;
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + totalDays - 1);
    
    const startDateString = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
    const endDateString = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    await UserWorkoutSchedule.deleteMany({
      userId: req.user.userId,
      date: { $gte: startDateString, $lte: endDateString }
    });

    const newSchedules = [];
    const planDays = workoutPlan.days && workoutPlan.days.length > 0 ? workoutPlan.days.length : 1;
    let currentPlanDayIndex = 0;

    for (let i = 0; i < totalDays; i++) {
      const isRestDay = (i % cycleLength) >= trainCount;
      
      if (!isRestDay) {
        const currentDate = new Date(start);
        currentDate.setDate(currentDate.getDate() + i);
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        newSchedules.push({
          userId: req.user.userId,
          date: dateString,
          workoutPlanId,
          dayIndex: currentPlanDayIndex % planDays
        });
        currentPlanDayIndex++;
      }
    }

    if (newSchedules.length > 0) {
      await UserWorkoutSchedule.insertMany(newSchedules);
    }

    res.json({ success: true, inserted: newSchedules.length });
  } catch (error) {
    console.error('Auto-schedule error:', error);
    res.status(500).json({ error: 'Server error auto-scheduling workouts' });
  }
}

export async function pushSchedule(req, res) {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const schedules = await UserWorkoutSchedule.find({
      userId: req.user.userId,
      date: { $gte: date }
    }).sort({ date: -1 });

    for (const schedule of schedules) {
      const year = parseInt(schedule.date.substring(0, 4));
      const month = parseInt(schedule.date.substring(5, 7)) - 1;
      const day = parseInt(schedule.date.substring(8, 10));
      
      const nextDay = new Date(year, month, day + 1);
      const newDateString = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
      
      schedule.date = newDateString;
      await schedule.save();
    }

    res.json({ success: true, pushedCount: schedules.length });
  } catch (error) {
    console.error('Push schedule error:', error);
    res.status(500).json({ error: 'Server error pushing workout schedule' });
  }
}

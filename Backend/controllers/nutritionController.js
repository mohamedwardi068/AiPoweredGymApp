import UserNutritionPlan from '../models/UserNutritionPlan.js';

export async function getPlans(req, res) {
  try {
    const meals = await UserNutritionPlan.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    console.error('Fetch validated nutrition error:', error);
    res.status(500).json({ error: 'Server error fetching nutrition plans' });
  }
}

export async function savePlan(req, res) {
  try {
    const { name, type, calories, protein, carbs, fat, ingredients, instructions } = req.body;
    if (!name || !calories || !protein || !carbs || !fat) {
      return res.status(400).json({ error: 'Meal name, calories, protein, carbs, and fat are required' });
    }

    const meal = new UserNutritionPlan({
      userId: req.user.userId,
      name,
      type: type || 'snack',
      calories,
      protein,
      carbs,
      fat,
      ingredients: ingredients || [],
      instructions: instructions || []
    });

    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    console.error('Save validated nutrition error:', error);
    res.status(500).json({ error: 'Server error saving nutrition plan' });
  }
}

export async function deletePlan(req, res) {
  try {
    const result = await UserNutritionPlan.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Nutrition plan not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete validated nutrition error:', error);
    res.status(500).json({ error: 'Server error deleting nutrition plan' });
  }
}

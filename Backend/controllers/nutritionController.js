import UserNutritionPlan from '../models/UserNutritionPlan.js';
import Food from '../models/Food.js';
import User from '../models/User.js';

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
    const { name, type, calories, protein, carbs, fat, ingredients, instructions, createdAt } = req.body;
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
      instructions: instructions || [],
      createdAt: createdAt ? new Date(createdAt) : new Date()
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

export async function updatePlan(req, res) {
  try {
    const { name, type, calories, protein, carbs, fat, ingredients, instructions, createdAt } = req.body;
    const updateData = {
      name,
      type,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      instructions
    };
    if (createdAt) {
      updateData.createdAt = new Date(createdAt);
    }

    const meal = await UserNutritionPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updateData,
      { new: true }
    );
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    console.error('Update nutrition error:', error);
    res.status(500).json({ error: 'Server error updating nutrition plan' });
  }
}

export async function searchFoods(req, res) {
  try {
    const { search, category } = req.query;
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    const foods = await Food.find(query).limit(50);
    res.json(foods);
  } catch (error) {
    console.error('Search foods error:', error);
    res.status(500).json({ error: 'Server error searching foods' });
  }
}

export async function getFavorites(req, res) {
  try {
    const user = await User.findById(req.user.userId).populate('favoriteFoods');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.favoriteFoods || []);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error fetching favorites' });
  }
}

export async function addFavorite(req, res) {
  try {
    const { foodId } = req.body;
    if (!foodId) return res.status(400).json({ error: 'Food ID is required' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.favoriteFoods) user.favoriteFoods = [];
    if (!user.favoriteFoods.includes(foodId)) {
      user.favoriteFoods.push(foodId);
      await user.save();
    }
    res.json({ success: true, favoriteFoods: user.favoriteFoods });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Server error adding favorite' });
  }
}

export async function removeFavorite(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.favoriteFoods) {
      user.favoriteFoods = user.favoriteFoods.filter(fid => fid.toString() !== id);
      await user.save();
    }
    res.json({ success: true, favoriteFoods: user.favoriteFoods });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Server error removing favorite' });
  }
}

export async function getRecents(req, res) {
  try {
    const user = await User.findById(req.user.userId).populate('recentFoods.foodId');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const sorted = (user.recentFoods || [])
      .filter(r => r.foodId != null)
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
      .map(r => r.foodId);

    res.json(sorted);
  } catch (error) {
    console.error('Get recents error:', error);
    res.status(500).json({ error: 'Server error fetching recents' });
  }
}

export async function addRecent(req, res) {
  try {
    const { foodId } = req.body;
    if (!foodId) return res.status(400).json({ error: 'Food ID is required' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.recentFoods) user.recentFoods = [];

    const index = user.recentFoods.findIndex(r => r.foodId && r.foodId.toString() === foodId);
    if (index !== -1) {
      user.recentFoods[index].lastUsed = new Date();
    } else {
      user.recentFoods.push({ foodId, lastUsed: new Date() });
    }

    if (user.recentFoods.length > 15) {
      user.recentFoods.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
      user.recentFoods = user.recentFoods.slice(0, 15);
    }

    await user.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Add recent error:', error);
    res.status(500).json({ error: 'Server error adding recent' });
  }
}

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

async function updateStreak(user) {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastActive = user.lastActiveDate;

  if (!lastActive) {
    user.lastActiveDate = todayStr;
    user.streak = 1;
    await user.save();
    return;
  }

  if (lastActive === todayStr) {
    return;
  }

  const todayDate = new Date(todayStr);
  const lastActiveDate = new Date(lastActive);
  const diffTime = Math.abs(todayDate - lastActiveDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    user.streak += 1;
  } else if (diffDays > 1) {
    user.streak = 1;
  }

  user.lastActiveDate = todayStr;
  await user.save();
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      streak: 1,
      totalWorkouts: 0,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'super_secret_gymbot_jwt_token_key_12345!',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        totalWorkouts: user.totalWorkouts,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        targetCaloriesOverride: user.targetCaloriesOverride,
      },
    });
  } catch (error) {
    console.error('Signup server error:', error);
    res.status(500).json({ error: 'An error occurred during signup' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    await updateStreak(user);

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'super_secret_gymbot_jwt_token_key_12345!',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        streak: user.streak,
        totalWorkouts: user.totalWorkouts,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        targetCaloriesOverride: user.targetCaloriesOverride,
      },
    });
  } catch (error) {
    console.error('Login server error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    await updateStreak(user);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      streak: user.streak,
      totalWorkouts: user.totalWorkouts,
      height: user.height,
      weight: user.weight,
      goal: user.goal,
      targetCaloriesOverride: user.targetCaloriesOverride,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error loading profile' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { height, weight, goal, targetCaloriesOverride } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (goal !== undefined) user.goal = goal;
    if (targetCaloriesOverride !== undefined) user.targetCaloriesOverride = targetCaloriesOverride;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      streak: user.streak,
      totalWorkouts: user.totalWorkouts,
      height: user.height,
      weight: user.weight,
      goal: user.goal,
      targetCaloriesOverride: user.targetCaloriesOverride,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
}

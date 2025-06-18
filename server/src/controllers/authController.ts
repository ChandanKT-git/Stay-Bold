import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const generateToken = (userId: string, email: string, isHost: boolean) => {
  return jwt.sign(
    { id: userId, email, isHost },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

export const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, isHost } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email,
      password,
      isHost: isHost || false
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.email, user.isHost);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isHost: user.isHost
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString(), user.email, user.isHost);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isHost: user.isHost
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { uid, email, name, avatar } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Firebase UID and email are required' 
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user from Google account
      user = new User({
        name: name || email.split('@')[0],
        email,
        password: uid, // Use Firebase UID as password (won't be used for login)
        isHost: false,
        avatar: avatar || '',
        firebaseUid: uid
      });
      await user.save();
    } else if (!user.firebaseUid) {
      // Link existing account with Firebase
      user.firebaseUid = uid;
      if (avatar) user.avatar = avatar;
      await user.save();
    }

    const token = generateToken(user._id.toString(), user.email, user.isHost);

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isHost: user.isHost,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during Google authentication' 
    });
  }
};
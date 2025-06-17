import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, ApiResponse } from '../types/index.js';

interface JwtPayload {
  userId: string;
  email: string;
  isHost: boolean;
}

export const authenticateToken = (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const requireHost = (req: AuthRequest, res: Response<ApiResponse>, next: NextFunction) => {
  if (!req.user?.isHost) {
    return res.status(403).json({
      success: false,
      message: 'Host privileges required'
    });
  }
  next();
};
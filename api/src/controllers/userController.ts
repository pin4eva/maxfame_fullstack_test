import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User';

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'admin']).optional(),
  isActive: z.boolean().optional(),
});

export class UserController {
  // Get all users
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find({ isActive: true })
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments({ isActive: true });

      res.json({
        success: true,
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Create new user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
        return;
      }

      const user = new User(validatedData);
      await user.save();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Update user
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateUserSchema.parse(req.body);

      // Check if email is being updated and if it already exists
      if (validatedData.email) {
        const existingUser = await User.findOne({
          email: validatedData.email,
          _id: { $ne: id },
        });
        if (existingUser) {
          res.status(400).json({
            success: false,
            message: 'User with this email already exists',
          });
          return;
        }
      }

      const user = await User.findByIdAndUpdate(id, validatedData, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Delete user (soft delete)
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true },
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deleted successfully',
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Hard delete user
  static async hardDeleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'User permanently deleted',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

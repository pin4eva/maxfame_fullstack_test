import { Request, Response } from 'express';
import { z } from 'zod';
import { Feedback } from '../models/Feedback';

// Validation schemas
const createFeedbackSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters long'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
});

const updateFeedbackSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  feedback: z
    .string()
    .min(10, 'Feedback must be at least 10 characters long')
    .optional(),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .optional(),
});

export class FeedbackController {
  // Get all feedback
  static async getAllFeedback(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Optional filter by rating
      const rating = req.query.rating
        ? parseInt(req.query.rating as string)
        : undefined;
      const filter = rating ? { rating } : {};

      const feedback = await Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Feedback.countDocuments(filter);

      res.json({
        success: true,
        data: feedback,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalFeedback: total,
          limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching feedback',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get feedback by ID
  static async getFeedbackById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const feedback = await Feedback.findById(id);

      if (!feedback) {
        res.status(404).json({
          success: false,
          message: 'Feedback not found',
        });
        return;
      }

      res.json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching feedback',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Create new feedback
  static async createFeedback(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createFeedbackSchema.parse(req.body);

      const feedback = new Feedback(validatedData);
      await feedback.save();

      res.status(201).json({
        success: true,
        message: 'Feedback created successfully',
        data: feedback,
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
        message: 'Error creating feedback',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Update feedback
  static async updateFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateFeedbackSchema.parse(req.body);

      const feedback = await Feedback.findByIdAndUpdate(id, validatedData, {
        new: true,
        runValidators: true,
      });

      if (!feedback) {
        res.status(404).json({
          success: false,
          message: 'Feedback not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Feedback updated successfully',
        data: feedback,
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
        message: 'Error updating feedback',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Delete feedback
  static async deleteFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const feedback = await Feedback.findByIdAndDelete(id);

      if (!feedback) {
        res.status(404).json({
          success: false,
          message: 'Feedback not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Feedback deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting feedback',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get feedback statistics
  static async getFeedbackStats(req: Request, res: Response): Promise<void> {
    try {
      const totalFeedback = await Feedback.countDocuments();

      const ratingStats = await Feedback.aggregate([
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const averageRating = await Feedback.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
          },
        },
      ]);

      res.json({
        success: true,
        data: {
          totalFeedback,
          averageRating:
            (averageRating[0] as { averageRating: number })?.averageRating || 0,
          ratingDistribution: ratingStats,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching feedback statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get feedback by email
  static async getFeedbackByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const feedback = await Feedback.find({
        email: email.toLowerCase(),
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Feedback.countDocuments({
        email: email.toLowerCase(),
      });

      res.json({
        success: true,
        data: feedback,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalFeedback: total,
          limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching feedback by email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

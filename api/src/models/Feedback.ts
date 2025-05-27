import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  email: string;
  feedback: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    feedback: {
      type: String,
      required: [true, 'Feedback is required'],
      trim: true,
      minlength: [10, 'Feedback must be at least 10 characters long'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  {
    timestamps: true,
  },
);

FeedbackSchema.index({ createdAt: -1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

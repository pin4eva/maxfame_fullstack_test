// Feedback form data interface matching backend model
export interface FeedbackFormData {
  name: string;
  email: string;
  feedback: string;
  rating: number;
}

// Form steps for navigation
export enum FormStep {
  PERSONAL_INFO = 'PERSONAL_INFO',
  FEEDBACK_DETAILS = 'FEEDBACK_DETAILS',
  REVIEW = 'REVIEW'
}

// Initial form data
export const INITIAL_FORM_DATA: FeedbackFormData = {
  name: '',
  email: '',
  feedback: '',
  rating: 0
};

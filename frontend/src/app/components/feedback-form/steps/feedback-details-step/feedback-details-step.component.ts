import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TextareaModule } from 'primeng/textarea';
import { RatingModule } from 'primeng/rating';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InvalidMessageComponent } from '../../../shared/invalid-message/invalid-message.component';

import { FeedbackFormData } from '../../../../models/feedback-form.model';

@Component({
  selector: 'app-feedback-details-step',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    RatingModule,
    FloatLabelModule,
    InvalidMessageComponent
  ],
  templateUrl: './feedback-details-step.component.html',
  styleUrls: ['./feedback-details-step.component.css']
})
export class FeedbackDetailsStepComponent {
  @Input() formData!: FeedbackFormData;
  @Output() dataChange = new EventEmitter<Partial<FeedbackFormData>>();

  onFeedbackChange(feedback: string): void {
    this.dataChange.emit({ feedback });
  }

  onRatingChange(rating: number): void {
    this.dataChange.emit({ rating });
  }

  get feedbackErrors(): string[] {
    const errors: string[] = [];
    if (this.formData.feedback && this.formData.feedback.trim().length < 10) {
      errors.push('Feedback must be at least 10 characters long');
    }
    return errors;
  }

  get ratingErrors(): string[] {
    const errors: string[] = [];
    if (this.formData.rating === 0) {
      errors.push('Please provide a rating');
    }
    return errors;
  }
}

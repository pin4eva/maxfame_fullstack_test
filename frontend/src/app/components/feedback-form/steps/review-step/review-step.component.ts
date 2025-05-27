import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';

import { FeedbackFormData } from '../../../../models/feedback-form.model';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DividerModule,
    RatingModule
  ],
  templateUrl: './review-step.component.html',
  styleUrls: ['./review-step.component.css']
})
export class ReviewStepComponent {
  @Input() formData!: FeedbackFormData;
}

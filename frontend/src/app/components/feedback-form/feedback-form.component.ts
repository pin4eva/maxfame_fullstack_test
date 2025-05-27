import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import { PersonalInfoStepComponent } from './steps/personal-info-step/personal-info-step.component';
import { FeedbackDetailsStepComponent } from './steps/feedback-details-step/feedback-details-step.component';
import { ReviewStepComponent } from './steps/review-step/review-step.component';

import { FormStateService } from '../../services/form-state.service';
import { FeedbackService } from '../../services/feedback.service';
import { FormStep, FeedbackFormData } from '../../models/feedback-form.model';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [
    CommonModule,
    StepsModule,
    CardModule,
    ButtonModule,
    ToastModule,
    ProgressSpinnerModule,
    PersonalInfoStepComponent,
    FeedbackDetailsStepComponent,
    ReviewStepComponent
  ],
  providers: [MessageService],
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentStep: FormStep = FormStep.PERSONAL_INFO;
  isSubmitting = false;
  formData: FeedbackFormData = { name: '', email: '', feedback: '', rating: 0 };

  // Step configuration for PrimeNG Steps component
  steps = [
    { label: 'Personal Information' },
    { label: 'Feedback Details' },
    { label: 'Review & Submit' }
  ];

  constructor(
    private formStateService: FormStateService,
    private feedbackService: FeedbackService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to form state changes
    this.formStateService.formData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.formData = data);

    this.formStateService.currentStep$
      .pipe(takeUntil(this.destroy$))
      .subscribe(step => this.currentStep = step);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get currentStepIndex(): number {
    return Object.values(FormStep).indexOf(this.currentStep);
  }

  get canGoNext(): boolean {
    switch (this.currentStep) {
      case FormStep.PERSONAL_INFO:
        return this.formData.name.trim().length > 0 &&
          this.formData.email.trim().length > 0 &&
          this.isValidEmail(this.formData.email);
      case FormStep.FEEDBACK_DETAILS:
        return this.formData.feedback.trim().length > 0 && this.formData.rating > 0;
      default:
        return true;
    }
  }

  get canGoPrevious(): boolean {
    return this.currentStep !== FormStep.PERSONAL_INFO;
  }

  onDataChange(data: Partial<FeedbackFormData>): void {
    this.formStateService.updateFormData(data);
  }

  onNext(): void {
    if (!this.canGoNext) return;

    switch (this.currentStep) {
      case FormStep.PERSONAL_INFO:
        this.formStateService.setCurrentStep(FormStep.FEEDBACK_DETAILS);
        break;
      case FormStep.FEEDBACK_DETAILS:
        this.formStateService.setCurrentStep(FormStep.REVIEW);
        break;
    }
  }

  onPrevious(): void {
    if (!this.canGoPrevious) return;

    switch (this.currentStep) {
      case FormStep.FEEDBACK_DETAILS:
        this.formStateService.setCurrentStep(FormStep.PERSONAL_INFO);
        break;
      case FormStep.REVIEW:
        this.formStateService.setCurrentStep(FormStep.FEEDBACK_DETAILS);
        break;
    }
  }

  onSubmit(): void {
    if (!this.canGoNext) return;

    this.isSubmitting = true;

    this.feedbackService.submitFeedback(this.formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Feedback submitted successfully!'
          });
          this.formStateService.clearFormData();
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error || 'Failed to submit feedback'
          });
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

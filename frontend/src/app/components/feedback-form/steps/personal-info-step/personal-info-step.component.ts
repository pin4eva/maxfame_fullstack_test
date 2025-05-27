import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InvalidMessageComponent } from '../../../shared/invalid-message/invalid-message.component';

import { FeedbackFormData } from '../../../../models/feedback-form.model';

@Component({
  selector: 'app-personal-info-step',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    InvalidMessageComponent
  ],
  templateUrl: './personal-info-step.component.html',
  styleUrls: ['./personal-info-step.component.css']
})
export class PersonalInfoStepComponent {
  @Input() formData!: FeedbackFormData;
  @Output() dataChange = new EventEmitter<Partial<FeedbackFormData>>();

  onNameChange(name: string): void {
    this.dataChange.emit({ name });
  }

  onEmailChange(email: string): void {
    this.dataChange.emit({ email });
  }

  get nameErrors(): string[] {
    const errors: string[] = [];
    if (this.formData.name && this.formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    return errors;
  }

  get emailErrors(): string[] {
    const errors: string[] = [];
    if (this.formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        errors.push('Please enter a valid email address');
      }
    }
    return errors;
  }
}

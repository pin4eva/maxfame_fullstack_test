import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FeedbackFormData, FormStep, INITIAL_FORM_DATA } from '../models/feedback-form.model';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  private readonly STORAGE_KEY = 'feedback_form_data';

  private formDataSubject = new BehaviorSubject<FeedbackFormData>(this.loadFromStorage());
  private currentStepSubject = new BehaviorSubject<FormStep>(FormStep.PERSONAL_INFO);

  public formData$ = this.formDataSubject.asObservable();
  public currentStep$ = this.currentStepSubject.asObservable();

  constructor() { }

  getCurrentFormData(): FeedbackFormData {
    return this.formDataSubject.value;
  }

  updateFormData(data: Partial<FeedbackFormData>): void {
    const currentData = this.formDataSubject.value;
    const updatedData = { ...currentData, ...data };
    this.formDataSubject.next(updatedData);
    this.saveToStorage(updatedData);
  }

  setCurrentStep(step: FormStep): void {
    this.currentStepSubject.next(step);
  }

  getCurrentStep(): FormStep {
    return this.currentStepSubject.value;
  }

  clearFormData(): void {
    this.formDataSubject.next(INITIAL_FORM_DATA);
    this.currentStepSubject.next(FormStep.PERSONAL_INFO);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private loadFromStorage(): FeedbackFormData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_FORM_DATA;
    } catch {
      return INITIAL_FORM_DATA;
    }
  }

  private saveToStorage(data: FeedbackFormData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Handle storage errors silently
    }
  }
}

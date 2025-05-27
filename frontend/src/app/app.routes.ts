import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/feedback',
    pathMatch: 'full'
  },
  {
    path: 'feedback',
    loadComponent: () => import('./components/feedback-form/feedback-form.component').then(m => m.FeedbackFormComponent),
    title: 'Feedback Form'
  },
  {
    path: 'feedback/:step',
    loadComponent: () => import('./components/feedback-form/feedback-form.component').then(m => m.FeedbackFormComponent),
    title: 'Feedback Form'
  },
  {
    path: '**',
    redirectTo: '/feedback'
  }
];

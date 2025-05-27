import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invalid-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="errors && errors.length > 0" class="error-messages">
      <div *ngFor="let error of errors" class="error-message">
        <i class="pi pi-exclamation-triangle"></i>
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .error-messages {
      margin-top: 0.5rem;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #dc3545;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .error-message:last-child {
      margin-bottom: 0;
    }

    .error-message i {
      font-size: 0.75rem;
    }
  `]
})
export class InvalidMessageComponent {
  @Input() errors: string[] = [];
}

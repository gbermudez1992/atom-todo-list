import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <p>Please register to continue.</p>
        <form (submit)="onSubmit($event)">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" [(ngModel)]="firstName" name="firstName" required />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" [(ngModel)]="lastName" name="lastName" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [value]="email" disabled />
          </div>
          <div class="modal-actions">
            <button type="submit" [disabled]="!firstName.trim() || !lastName.trim()">
              Register
            </button>
            <button type="button" class="cancel-btn" (click)="onCancel()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-content {
        background: #1e1e2f;
        padding: 30px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 100%;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      }
      h3 {
        margin-top: 0;
        color: white;
      }
      p {
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 20px;
      }
      .form-group {
        margin-bottom: 15px;
        text-align: left;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }
      input {
        width: 100%;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(0, 0, 0, 0.3);
        color: white;
        margin-bottom: 10px;
      }
      input:focus {
        outline: none;
        border-color: #4facfe;
      }
      input:disabled {
        opacity: 0.5;
        border-color: rgba(255, 255, 255, 0.1);
        cursor: not-allowed;
      }
      .modal-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      button {
        flex: 1;
        padding: 12px;
        background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
        color: #000;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      button:disabled {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.3);
        cursor: not-allowed;
      }
      .cancel-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
      .cancel-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    `,
  ],
})
export class RegisterModalComponent {
  @Input() email = '';
  @Output() register = new EventEmitter<{ firstName: string; lastName: string }>();
  @Output() cancel = new EventEmitter<void>();

  firstName = '';
  lastName = '';

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.firstName.trim() && this.lastName.trim()) {
      this.register.emit({ firstName: this.firstName.trim(), lastName: this.lastName.trim() });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}

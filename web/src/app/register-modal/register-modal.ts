import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.css',
})
export class RegisterModal {
  @Input() email: string = '';
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

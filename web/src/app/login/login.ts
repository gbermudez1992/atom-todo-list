import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';
import { RegisterModal } from '../register-modal/register-modal';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RegisterModal],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  showRegisterModal = false;
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  onSubmit() {
    if (this.email.trim()) {
      this.auth.login(this.email.trim()).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          if (err.status === 404) {
            this.showRegisterModal = true;
            this.cdr.detectChanges();
          } else {
            console.error('Login failed', err);
          }
        },
      });
    }
  }

  onRegister(event: { firstName: string; lastName: string }) {
    this.auth.register(this.email.trim(), event.firstName, event.lastName).subscribe({
      next: () => {
        this.showRegisterModal = false;
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Registration failed', err),
    });
  }

  onCancelRegister() {
    this.showRegisterModal = false;
  }
}

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  private auth = inject(Auth);
  private router = inject(Router);

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.email.trim()) {
      this.auth.login(this.email.trim());
      this.router.navigate(['/']);
    }
  }
}

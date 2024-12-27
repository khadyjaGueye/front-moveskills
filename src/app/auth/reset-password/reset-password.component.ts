import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../../core/components/apprenant/service/apprenant.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Route, Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  showPassword: boolean = false;
  token: string = "";
  email: string = "";

  constructor(private service: ApprenantService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });

    this.changePasswordForm = this.fb.group({
      "email": [this.email, [Validators.required, Validators.email]],
      "token": [this.token, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ["", [Validators.required]],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {

  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const passwordConfirmation = form.get('password_confirmation')?.value;
    if (password !== passwordConfirmation) {
      form.get('password_confirmation')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('password_confirmation')?.setErrors(null);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.service.url = environment.apiBaseUrl + "update-password"
    if (this.changePasswordForm.valid) {
      this.service.store(this.changePasswordForm.value).subscribe({
        next: (resp) => {
          this.service.handleResponse(resp);
          this.changePasswordForm.reset();
          this.router.navigate(['']);
        }, error: (err) => {
          this.service.handleResponse(err);
          this.changePasswordForm.reset();
        }
      })
    }
  }
}

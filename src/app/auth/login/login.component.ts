import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { ApprenantService } from '../../core/components/apprenant/service/apprenant.service';
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  sendMailUser: FormGroup = new FormGroup({});
  showPassword: boolean = false; // Variable pour gérer la visibilité du mot de passe
  message: string = "";
  loginForm: FormGroup;
  isModalOpen = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private service: ApprenantService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.sendMailUser = this.fb.group({
      "email": ["", [Validators.required, Validators.email]]
    })
  }
  ngOnInit(): void {

  }
  // Fonction pour soumettre le formulaire
  onSubmit() {
    if (this.loginForm.valid) {
      // console.log('Formulaire valide, soumission des données...', this.loginForm.value);
      // Implémentez ici la logique de connexion, par exemple, en envoyant les données à un serveur
    } else {
      console.log('Formulaire invalide, veuillez vérifier les erreurs.');
    }
  }

  connecter() {
    let userLog = this.loginForm.value;
    return this.authService.login(userLog).subscribe(resp => {
      if (resp.data.status_code) {
        let tocken = resp.data.token;
        let user = resp.data.userInfo;
        this.authService.authentificateUser(user, tocken).subscribe(rep => {
          if (user.role == "apprenant") {
            this.router.navigateByUrl("core/apprenant/form");
          } if (user.role == "superviseur") {
            this.router.navigateByUrl("core/superviseur/participant");
          } if (user.role == "formateur") {
            this.router.navigateByUrl("core/formateur/listParcours");
          } if (user.role == "admin") {
            this.router.navigateByUrl("/core/admin/tableau");
          }
          // Réinitialisation du formulaire après succès
          this.loginForm.reset();
        })
      } else {
        this.router.navigateByUrl("");
      }
    }, error => {
      console.error(error.error.message);
      this.message = error.error.message;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: this.message,
        timer: 1500
      })
      // Réinitialisation du formulaire en cas d'erreur
      this.loginForm.reset();
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Bascule la visibilité du mot de passe
  }

  openForgotPasswordModal() {
    this.isModalOpen = true;
  }

  closeForgotPasswordModal() {
    this.isModalOpen = false;
  }

  sendMail() {
    this.service.url = environment.apiBaseUrl + "user/password/email"
    this.service.store(this.sendMailUser.value).subscribe(
      {
        next: (response) => {
          this.service.handleResponse(response);
          this.sendMailUser.reset();
          this.closeForgotPasswordModal();
        },
        error: (err) => {
          // this.openAncloseModal();
          // this.sendMailLoader = false;
          this.service.handleResponse(err);
        },
        complete: () => {
          // this.openAncloseModal();
          // this.sendMailLoader = false
        }
      }
    )
  }

}

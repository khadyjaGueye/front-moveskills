import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Data, Model } from '../../interfaces/model';
import { ApprenantService } from '../../core/components/apprenant/service/apprenant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  inscriptionForm: FormGroup;
  message: string = ""

  constructor(private fb: FormBuilder, private service: ApprenantService, private router: Router) {
    // Initialiser le formulaire avec des validators pour chaque champ
    this.inscriptionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
      code_invitaion: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      role: ['apprenant', Validators.required]
    });
  }

  ngOnInit(): void {

  }

  // Fonction pour soumettre le formulaire
  onSubmit() {
    this.service.url = environment.apiBaseUrl + "register";

    const data = this.inscriptionForm.value
    this.service.store(data).pipe(tap({
      next: (resp) => {
        this.service.handleResponse(resp);
        // Redirection vers la page de connexion après le succès
        this.router.navigate(['']);
      }, complete: () => {
        // console.log("Observable Termite");
      }, error: (error) => {
        // console.log(error);
        this.service.handleResponse(error);
      }
    })).subscribe();

    // if (this.inscriptionForm.valid) {
    //   console.log('Formulaire valide, soumission des données...', this.inscriptionForm.value);
    //   // Implémentez ici la logique d'inscription, par exemple, en envoyant les données à un serveur
    // } else {
    //   console.log('Formulaire invalide, veuillez vérifier les erreurs.');
    // }
  }

  // Fonction pour vérifier si les deux mots de passe sont identiques
  checkPasswords(): boolean {
    return this.inscriptionForm.get('password')?.value === this.inscriptionForm.get('confirmPassword')?.value;
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../../apprenant/service/apprenant.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';
import { tap } from 'rxjs';

@Component({
  selector: 'app-list-utilisateur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-utilisateur.component.html',
  styleUrl: './list-utilisateur.component.css'
})
export class ListUtilisateurComponent implements OnInit {

  display: boolean = false;
  displayEdit: boolean = false;
  inscriptionForm: FormGroup;

  isApprenantSelected: boolean = false; // Gère l'affichage conditionnel du champ


  constructor(private fb: FormBuilder, private service: ApprenantService) {
    this.inscriptionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
      code_invitaion: ['', []],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      role: ['', Validators.required]
    });

    // Surveille les changements de rôle
    this.inscriptionForm.get('role')?.valueChanges.subscribe((role) => {
      this.isApprenantSelected = role === 'apprenant';
    });
  }

  ngOnInit(): void {

  }
  openModalAjout() {
    this.display = true;
  }

  openModalEdit() {
    this.displayEdit = true
  }

  close() {
    this.display = false;
  }

  onRoleChange(event: Event) {
    const selectedRole = (event.target as HTMLSelectElement).value;
    this.isApprenantSelected = selectedRole === 'apprenant';
  }

  // Fonction pour soumettre le formulaire
  onSubmit() {
    this.service.url = environment.apiBaseUrl + "register";

    const data = this.inscriptionForm.value
    this.service.store(data).pipe(tap({
      next: (resp) => {
        this.service.handleResponse(resp);
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
    return this.inscriptionForm.get('password')?.value === this.inscriptionForm.get('password_confirmation')?.value;
  }


}

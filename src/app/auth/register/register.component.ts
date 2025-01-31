import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Aptitude, Data, Model, Profil } from '../../interfaces/model';
import { ApprenantService } from '../../core/components/apprenant/service/apprenant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  inscriptionForm: FormGroup;
  message: string = "";
  profils: Profil[] = [];
  aptitudes: Aptitude[] = [];
  selectedProfil: Profil | null = null;
  selectedAptitudes: number[] = []; // Liste des IDs sélectionnés
  currentPage: number = 1; // Page actuelle

  constructor(private fb: FormBuilder, private service: ApprenantService, private router: Router, private serviceApp: ApprenantService) {
    // Initialiser le formulaire avec des validators pour chaque champ
    this.inscriptionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]],
      code_invitaion: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      role: ['apprenant', Validators.required],
      profil_id:['',Validators.required],
      aptitudes:[[],Validators.required],
      sexe:['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.getDataProfil();
  }

  // Fonction pour soumettre le formulaire
  onSubmit(): void {
    // if (this.inscriptionForm.valid) {
      const data = this.inscriptionForm.value;
      this.service.url = environment.apiBaseUrl + 'register';
      console.log(data);
      this.service.store(data).subscribe({
        next: (resp) => {
          this.service.handleResponse(resp);
          this.router.navigate(['']);
        },
        error: (error) => {
          this.service.handleResponse(error);
          console.log(error);

        },
      });
    // } else {
    //   console.log('Formulaire invalide', this.inscriptionForm.errors);
    // }
  }

  // Fonction pour vérifier si les deux mots de passe sont identiques
  checkPasswords(): boolean {
    return this.inscriptionForm.get('password')?.value === this.inscriptionForm.get('confirmPassword')?.value;
  }

  getDataProfil() {
    this.service.url = environment.apiBaseUrl + "profils";
    this.serviceApp.all().subscribe({
      next: (resp) => {
        this.profils = resp.data.profils
      }, error: (err) => {
        console.log(err);

      }
    })
  }

  // Ajouter un profil et ses aptitudes sans supprimer les aptitudes précédentes
  addToSelected(comp: Profil): void {

  }

  selectProfil(profil: Profil): void {
    // Mettre à jour le profil sélectionné et les aptitudes associées
    this.selectedProfil = profil;
    this.aptitudes = profil.aptitudes;
    this.inscriptionForm.get('profil_id')?.setValue(profil.id); // Mettre à jour le formulaire
  }

  toggleAptitudeSelection(aptitudeId: number): void {
    const index = this.selectedAptitudes.indexOf(aptitudeId);
    if (index > -1) {
      // Si l'aptitude est déjà sélectionnée, on la retire
      this.selectedAptitudes.splice(index, 1);
    } else {
      // Sinon, on l'ajoute
      this.selectedAptitudes.push(aptitudeId);
    }
    // Mettre à jour le champ `aptitudes` du formulaire
    this.inscriptionForm.get('aptitudes')?.setValue(this.selectedAptitudes);
  }

    // Méthode pour passer à la page suivante
    nextPage(): void {
      this.currentPage++;
    }

    // Méthode pour revenir à la page précédente
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }

}

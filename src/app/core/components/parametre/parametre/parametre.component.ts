import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApprenantService } from '../../apprenant/service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { group } from '@angular/animations';

@Component({
  selector: 'app-parametre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './parametre.component.html',
  styleUrl: './parametre.component.css'
})
export class ParametreComponent implements OnInit {

  role: string = "";
  userId!: number;
  nom!: string;
  email!: string;
  phone!: number
  passwordForm: FormGroup;
  profileForm: FormGroup;
  showConfirm = false;
  showPasswordModal = false;

  constructor(private fb: FormBuilder, private service: ApprenantService) {

    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');
    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.userId = user.id;
      this.nom = user.name;
      this.email = user.email;
      this.role = user.role;
      this.phone = user.phoneNumber

    } else {
      // Gérer le cas où pas d'utilisateur authentifié
    }
    this.profileForm = this.fb.group({
      name: [this.nom, Validators.required],
      email: [this.email, [Validators.required, Validators.email]],
      phone: [this.phone, Validators.required],
      photo: [],
      password: ['', Validators.minLength(6)],

    });
    // Formulaire de modification du mot de passe
    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
    }, { validators: this.passwordsMustDiffer });
  }

  ngOnInit(): void {

  }
  passwordsMustDiffer(group: FormGroup) {
    const oldPassword = group.get('current_password')?.value;
    const newPassword = group.get('new_password')?.value;
    return oldPassword !== newPassword ? null : { passwordsSame: true };
  }

  confirmChangePassword() {
    this.showConfirm = true;
  }

  cancelChangePassword() {
    this.showConfirm = false;
  }

  openPasswordModal() {
    this.showConfirm = false;
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showConfirm = false;
  }

  updatePassword() {
    this.service.url = environment.apiBaseUrl + "change-password";
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value; // Récupère les anciens et nouveaux mots de passe

      this.service.store(passwordData).subscribe({
        next: (resp) => {
          this.service.handleResponse(resp); // Gérez la réponse positive
          this.closePasswordModal(); // Fermez le modal après succès
        },
        error: (err) => {
          console.log(err);

          this.service.handleResponse(err); // Gérez l'erreur
        }
      });
    }
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      //this.profileForm.patchValue({ photo: file });
    }
  }
  onSubmit() {
    //this.service.url = `${environment.apiBaseUrl}update-user/${this.userId}`;
    this.service.url = environment.apiBaseUrl + "update-user";
    const data = this.profileForm.value;
    console.log(data);
    this.service.update(data, this.userId).subscribe({
      next: (resp) => {
        this.service.handleResponse(resp);
      }, error: (err) => {
        this.service.handleResponse(err);
      }
    })

  }

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}

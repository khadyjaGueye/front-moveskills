import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormateurService } from '../service/formateur.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-ajout-apprenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ajout-apprenant.component.html',
  styleUrl: './ajout-apprenant.component.css'
})
export class AjoutApprenantComponent implements OnInit {

  apprenantForm: FormGroup

  constructor(private fb: FormBuilder, private service: FormateurService) {
    this.apprenantForm = fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero: ['', Validators.required],
    });

  }
  ngOnInit(): void {

  }

  addApprenant() {
    this.service.url = environment.apiBaseUrl + "formateur/affiliations";

    // Préparer les données à envoyer
    const apprenant = this.apprenantForm.value;
    console.log(apprenant);

    // Envoyer les données directement sans "affiliations"
    this.service.store(apprenant).subscribe({
        next: (response) => {
            this.service.handleResponse(response);
            this.apprenantForm.reset();
        },
        error: (err) => {
            this.service.handleResponse(err);
            this.apprenantForm.reset();
            console.log(err);

        }
    });
}


}

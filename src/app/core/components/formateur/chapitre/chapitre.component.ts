import { Component, OnInit } from '@angular/core';
import { Chapitre, Parcour } from '../../../../interfaces/model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { FormateurService } from '../service/formateur.service';

@Component({
  selector: 'app-chapitre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  templateUrl: './chapitre.component.html',
  styleUrl: './chapitre.component.css'
})
export class ChapitreComponent implements OnInit {

  chapitreForm!: FormGroup;
  chapitres: Chapitre[] = [];
  parcours: Parcour[] = [];
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private service: FormateurService) {
    this.chapitreForm = this.fb.group({
      parcour_id: ['', Validators.required],
      nom_chapitre: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.getParcours();
  }

  addChapitre() {
    if (this.chapitreForm.invalid) {
      this.chapitreForm.markAllAsTouched(); // Marquer tous les champs comme touchés
      return;
    }
    const data = this.chapitreForm.value;

    this.service.url = `${environment.apiBaseUrl}chapitre`;
    this.service.store(data).subscribe(
      (resp) => {
        this.service.handleResponse(resp);
        this.chapitreForm.reset(); // Réinitialiser le formulaire après succès
      },
      (error) => {
        this.service.handleResponse(error);
      }
    );
  }


  getParcours() {
    this.service.url = environment.apiBaseUrl + "parcours";
    this.service.all().subscribe(resp => {
      this.parcours = resp.data.parcours;
      this.isLoading = false; // Données chargées, on masque le spinner
      //console.log(this.parcours);
    })
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    this.chapitreForm.patchValue({ contents: files });
  }

  editChapitre(chapitre: any) {
    this.chapitreForm.patchValue(chapitre);
  }

  deleteChapitre(id: number) {
    this.chapitres = this.chapitres.filter((c) => c.id !== id);
  }

}

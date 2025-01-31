import { Component, OnInit } from '@angular/core';
import { Chapitre, Parcour } from '../../../../interfaces/model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { FormateurService } from '../service/formateur.service';
import { SharedModule } from "../../../../shared/shared.module";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chapitre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule],
  templateUrl: './chapitre.component.html',
  styleUrl: './chapitre.component.css'
})
export class ChapitreComponent implements OnInit {

  chapitreForm!: FormGroup;
  chapitres: Chapitre[] = [];
  parcours: Parcour[] = [];
  isLoading: boolean = false;
  parcour: string = ""

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
    this.isLoading = true;
    this.service.url = environment.apiBaseUrl + "parcours/formateur";
    this.service.all().subscribe(resp => {
      this.parcours = resp.data.parcours;
      this.isLoading = false; // Données chargées, on masque le spinner
      //console.log(this.parcours);
    })
  }

  getDataChapitre(parcourId: number, parcour: string) {
    this.service.url = `${environment.apiBaseUrl}chapitre-by-parcour/${parcourId}`
    this.service.all().subscribe({
      next: (resp) => {
        this.chapitres = resp.data.chapitres;
        console.log(this.chapitres);

        this.parcour = parcour
      }, error: (err) => {
        console.log(err);

      }
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
    //this.chapitres = this.chapitres.filter((c) => c.id !== id);
      Swal.fire({
          title: 'Êtes-vous sûr ?',
          text: 'Cette action supprimera le chapitre définitivement.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#114C5A  ',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui, supprimer',
          cancelButtonText: 'Annuler'
        }).then((result) => {
          if (result.isConfirmed) {
            //this.service.url = environment.apiBaseUrl + "citations";
            this.service.delete(id).subscribe({
              next: (resp) => {
                // Mise à jour locale après suppression
                this.chapitres = this.chapitres.filter(c => c.id !== id);
                Swal.fire('Supprimé !', 'Le chapitre a été supprimé avec succès.', 'success');
              },
              error: (error) => {
                console.error('Erreur lors de la suppression:', error);
                Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
              }
            });
          }
        });
  }

}

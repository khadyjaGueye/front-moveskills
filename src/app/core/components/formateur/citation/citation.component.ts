import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Citation } from '../../../../interfaces/model';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-citation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,SharedModule],
  templateUrl: './citation.component.html',
  styleUrl: './citation.component.css'
})
export class CitationComponent implements OnInit {

  citations: Citation[] = [];
  isModalOpen: boolean = false;
  citationForm: FormGroup;
  citationUpdateForm: FormGroup;
  display: boolean = false;
  citation_id: number = 1;
  selectedCitation: any; // Citation sélectionnée pour modification
  isLoading:boolean = false;

  constructor(private fb: FormBuilder, private service: FormateurService) {
    this.citationForm = this.fb.group({
      libelle: ['', Validators.required],
      content: ['', Validators.required],
      auteur: ['', Validators.required],
    });

    this.citationUpdateForm = this.fb.group({
      libelle: ['', Validators.required],
      content: ['', Validators.required],
      auteur: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getDataCitation();
  }

  // Ouvrir le modal
  openModal() {
    this.isModalOpen = true;
  }

  // Fermer le modal
  closeModal() {
    this.isModalOpen = false;
  }

  openModalUpdate(id: number): void {
    //console.log(id);
    this.display = true; // Afficher le modal
    this.citation_id = id; // Mettre à jour l'ID de la citation sélectionnée
    this.selectedCitation = this.citations.find(c => c.id === id); // Trouver la citation sélectionnée
    if (this.selectedCitation) {
      // Charger les données dans le formulaire
      this.citationUpdateForm.patchValue(this.selectedCitation);
      //  console.log(this.selectedCitation);

    }
  }

  closeUpdate() {
    this.display = false;
    this.citationUpdateForm.reset(); // Réinitialiser le formulaire
  }


  updateCitation(): void {
    this.service.url = environment.apiBaseUrl + "citations";
    //  console.log(`${environment.apiBaseUrl}citations/${this.citation_id}`);
    if (this.citationUpdateForm.valid) {
      const updatedCitation = this.citationUpdateForm.value;
      // Construire l'URL avec l'ID de la citation
      // Appel API pour mettre à jour la citation
      this.service.update(updatedCitation, this.citation_id).subscribe(
        {
          next: (response) => {
            // Mettre à jour localement le tableau après succès
            const index = this.citations.findIndex(c => c.id === this.citation_id);
            if (index !== -1) {
              this.citations[index] = { ...this.citations[index], ...updatedCitation };
            }
            this.closeUpdate(); // Fermer le modal
            this.service.handleResponse(response)
          },
          error: (error) => {
            console.log(error);

            this.service.handleResponse(error)

          }
        }
      );
    }
  }

  deleteCitation(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera la citation définitivement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#114C5A  ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.url = environment.apiBaseUrl + "citations";
        this.service.delete(id).subscribe({
          next: (resp) => {
            // Mise à jour locale après suppression
            this.citations = this.citations.filter(c => c.id !== id);
            Swal.fire('Supprimé !', 'La citation a été supprimée avec succès.', 'success');
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
          }
        });
      }
    });
  }

  // Soumettre le formulaire
  onSubmit() {
    this.service.url = environment.apiBaseUrl + "citations";
    if (this.citationForm.valid) {
      // Logic to handle form submission
      console.log(this.citationForm.value);
      this.service.store(this.citationForm.value).subscribe({
        next: (resp) => {
          this.service.handleResponse(resp);
          this.closeModal(); // Ferme le modal après soumission
        }, error: (error) => {
          this.service.handleResponse(error);
        }
      })

    }
  }

  getDataCitation() {
    this.isLoading = true;
    this.service.url = environment.apiBaseUrl + "citations/formateur"
    this.service.all().subscribe({
      next: (response) => {
        this.citations = response.data.citations;
        //console.log(response);
        this.isLoading=false;
      }
    })
  }

  publication(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez vous vraiment publier cette citation',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#114C5A',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, publier',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.url = `${environment.apiBaseUrl}citations/${id}/publish`;
        this.service.all().subscribe({
          next: (resp) => {
            this.service.handleResponse(resp)
          }, error: (erreur) => {
            console.log(erreur);

            this.service.handleResponse(erreur);
          }
        })
      }
    });
  }

}

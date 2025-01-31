import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router, RouterLink } from '@angular/router';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import { TestService } from '../../../../shared/services/test.service';
import { Aptitude, Competence, Profil } from '../../../../interfaces/model';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-competence',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, NgxPaginationModule],
  templateUrl: './competence.component.html',
  styleUrl: './competence.component.css'
})
export class CompetenceComponent implements OnInit {

  showAddCompetenceForm = false; // Variable pour afficher/masquer le formulaire
  showUpdateCompetenceForm = false;
  isLoading: boolean = false;
  isModalOpen: boolean = false; // État du modal
  formData: FormGroup;
  competences: Competence[] = [];
  profils: Profil[] = [];
  aptitudes: Aptitude[] = [];
  page: number = 1;
  itemsPerPage: number = 5; // Nombre d'éléments par page
  searchTerm: string = ''; // Variable pour stocker la valeur de la recherche
  currentCompetenceId: number | null = null; // Ajoutez cette ligne pour définir la propriété

  constructor(private service: FormateurService, private fb: FormBuilder, private test: TestService, private router: Router) {
    this.formData = fb.group({
      nom: [''],
    })

  }
  ngOnInit(): void {
    this.getDataProfil();

  }

  OpenCreateComptence() {
    this.showAddCompetenceForm = true
  }

  // Méthode pour afficher et pré-remplir le formulaire d'édition
  OpenUpdateCompetence(id: number) {
    const competence = this.filteredCompetence.find(comp => comp.id === id);
    if (competence) {
      this.showAddCompetenceForm = true;
      this.formData.patchValue({ nom: competence.libelle });
      this.currentCompetenceId = id; // Sauvegarder l'id pour l'API de mise à jour
    } else {
      // console.log('Aucune compétence trouvée pour cet ID :', id);
    }
  }
  // Méthode pour envoyer les données créer à l'API
  async createCompetence() {
    this.service.url = environment.apiBaseUrl + "competences";
    const data = this.formData.value;
    try {
      const resp = await firstValueFrom(this.service.store(data));
      this.showAddCompetenceForm = false;
      this.service.handleResponse(resp);
      data.reset(); // Décommentez cette ligne si vous souhaitez réinitialiser le formulaire.
    } catch (error) {
      this.service.handleResponse(error);
    }
  }

  // Méthode pour envoyer les données mises à jour à l'API
  updateCompetence() {
    const updatedData = this.formData.value; // Récupérer les données du formulaire
    this.service.url = `${environment.apiBaseUrl}/competences/${this.currentCompetenceId}`; // URL pour l'API de mise à jour

    this.service.update(updatedData, this.currentCompetenceId).subscribe(
      (response) => {
        this.service.handleResponse(response);
        updatedData.reset();
        this.showAddCompetenceForm = false; // Fermer le formulaire
      },
      (error) => {
        // Gérer les erreurs
        this.service.handleResponse(error);
        console.error('Erreur lors de la mise à jour de la compétence', error);
      }
    );
  }

  // Fonction de filtre basée sur le nom du competence
  get filteredCompetence() {
    return this.profils.filter(profil =>
      profil.libelle.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getDataProfil() {
    this.isLoading = true
    this.service.url = environment.apiBaseUrl + "profils";
    this.service.all().subscribe({
      next: (resp) => {
        this.profils = resp.data.profils;
        this.isLoading = false
      }, error: (err) => {

      }
    })
  }

  deleteCitation(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera le profil définitivement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#114C5A  ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        //this.service.url = environment.apiBaseUrl + "profil";
        this.service.delete(id).subscribe({
          next: (resp) => {
            // Mise à jour locale après suppression
            this.profils = this.profils.filter(c => c.id !== id);
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

  showApitude(id: number, aptitude: Aptitude[]) {
   // console.log(aptitude);
    this.aptitudes = aptitude;
    this.isModalOpen = true;
  }

  // Méthode pour fermer le modal
  closeModal(): void {
    this.isModalOpen = false;
  }


}

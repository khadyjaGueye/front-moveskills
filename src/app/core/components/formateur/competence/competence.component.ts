import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import { TestService } from '../../../../shared/services/test.service';
import { Competence } from '../../../../interfaces/model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-competence',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, NgxPaginationModule, RouterLink],
  templateUrl: './competence.component.html',
  styleUrl: './competence.component.css'
})
export class CompetenceComponent implements OnInit {

  showAddCompetenceForm = false; // Variable pour afficher/masquer le formulaire
  showUpdateCompetenceForm = false
  formData: FormGroup;
  competences: Competence[] = [];
  page: number = 1;
  itemsPerPage: number = 5; // Nombre d'éléments par page
  searchTerm: string = ''; // Variable pour stocker la valeur de la recherche
  currentCompetenceId: number | null = null; // Ajoutez cette ligne pour définir la propriété

  constructor(private service: FormateurService, private fb: FormBuilder, private test: TestService) {
    this.formData = fb.group({
      nom: [''],
    })

  }
  ngOnInit(): void {
    this.getDataCompetence()
  }

  OpenCreateComptence() {
    this.showAddCompetenceForm = true
  }

  // Méthode pour afficher et pré-remplir le formulaire d'édition
  OpenUpdateCompetence(id: number) {
    const competence = this.filteredCompetence.find(comp => comp.id === id);
    if (competence) {
      this.showAddCompetenceForm = true;
      this.formData.patchValue({ nom: competence.nom });
      this.currentCompetenceId = id; // Sauvegarder l'id pour l'API de mise à jour
    }else {
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

  getDataCompetence() {
    this.service.url = environment.apiBaseUrl + "competences";
    this.service.all().subscribe({
      next: (response) => {
        this.competences = response.data.competences;
        //console.log(response);
        //this.competences = response.data.competences;
      }, error: (err) => {
        // console.error('Erreur lors de la récupération des chapicompétence:', err);
      }, complete: () => {
        //console.log('Récupération des chapitres terminée');
      }
    })
  }

  // Fonction de filtre basée sur le nom du competence
  get filteredCompetence() {
    return this.competences.filter(parcour =>
      parcour.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApprenantService } from '../../apprenant/service/apprenant.service';
import { Parcour } from '../../../../interfaces/model';
import { environment } from '../../../../../environments/environment.development';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-parcour',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './parcour.component.html',
  styleUrl: './parcour.component.css'
})
export class ParcourComponent implements OnInit {

  parcours: Parcour[] = [];
  isLoading: boolean = false;
  status: string = "";
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 5; // Nombre d'éléments par page

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {
    this.getDataParcours('draft');

  }

  getDataParcours(status: string): void {
    this.isLoading = true; // Afficher le spinner pendant le chargement
    this.service.url = `${environment.apiBaseUrl}parcours/status/${status}`;
    this.service.all().subscribe({
      next: (resp: any) => {
        this.status = status;
        this.parcours = resp.data.parcours;
        this.isLoading = false; // Masquer le spinner une fois les données chargées
      },
      error: (error) => {
        console.error('Erreur lors du chargement des parcours', error);
        this.isLoading = false;
      }
    });
  }

  publierParcour(id: number) {
    const parcour = "/status/approved"
    this.service.edit("approved", id, parcour).subscribe({
      next: (resp) => {
        this.service.handleResponse(resp)
      }, error: (err) => {
        console.log(err);
        this.service.handleResponse(err);
      }
    })
  }

  // Méthode pour calculer le nombre total de pages
  get totalPages() {
    return Math.ceil(this.parcours.length / this.itemsPerPage);
  }
  // Méthode pour changer de page
  changePage(page: number) {
    this.currentPage = page;
  }

  // Méthode pour récupérer les données à afficher pour la page actuelle
  get paginatedResultats() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.parcours.slice(startIndex, endIndex);
  }




}

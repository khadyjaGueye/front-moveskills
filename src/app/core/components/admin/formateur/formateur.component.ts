import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Formateur } from '../interface/model';
import { ApprenantService } from '../../apprenant/service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { SearchService } from '../../../../shared/services/search.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formateur',
  standalone: true,
  imports: [CommonModule, SharedModule,ReactiveFormsModule,FormsModule],
  templateUrl: './formateur.component.html',
  styleUrl: './formateur.component.css'
})
export class FormateurComponent implements OnInit {
  formateurs: Formateur[] = [];
  isLoading: boolean = false;
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 5; // Nombre d'éléments par page
  searchTerm: string = '';

  constructor(private service: ApprenantService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.getDataFormateur();
  }

  getDataFormateur() {
    this.isLoading = true;
    this.service.url = environment.apiBaseUrl + "dashboard?filter=all";
    this.service.all().subscribe({
      next: (resp) => {
        this.formateurs = resp.data.formateurs;
        this.isLoading = false;
      }, error: (err) => {

      }
    })
  }

  // Méthode pour calculer le nombre total de pages
  get totalPages() {
    return Math.ceil(this.formateurs.length / this.itemsPerPage);
  }

  // Méthode pour changer de page
  changePage(page: number) {
    this.currentPage = page;
  }

  get filteredApprenants() {
    return this.searchService.filter(this.formateurs, this.searchTerm);
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Citation } from '../../../../interfaces/model';
import { ApprenantService } from '../../apprenant/service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-citation',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './citation.component.html',
  styleUrl: './citation.component.css'
})
export class CitationComponent implements OnInit {

  citations: Citation[] = [];
  isLoading: boolean = false;
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 5; // Nombre d'éléments par page

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {

  }

  getDataCitation() {
    this.isLoading = true;
    this.service.url = environment.apiBaseUrl + "";

    this.service.all().subscribe({
      next: (resp) => {
        this.citations = resp.data.citations;
        this.isLoading = false
      }, error: (err) => {

      }
    })
  }

  // Méthode pour calculer le nombre total de pages
  get totalPages() {
    return Math.ceil(this.citations.length / this.itemsPerPage);
  }

  // Méthode pour changer de page
  changePage(page: number) {
    this.currentPage = page;
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { ApprenantService } from '../../apprenant/service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { NombreParcourAchete } from '../../../../interfaces/model';

@Component({
  selector: 'app-trasaction',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './trasaction.component.html',
  styleUrl: './trasaction.component.css'
})
export class TrasactionComponent implements OnInit {

  transactions: NombreParcourAchete[] = [];
  isLoading: boolean = false;
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 5; // Nombre d'éléments par page

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {
    this.getDataTransaction();
  }

  getDataTransaction() {
    this.isLoading = true
    this.service.url = environment.apiBaseUrl + "dashboard?filter=all";
    this.service.all().subscribe({
      next: (resp) => {
        this.transactions = resp.data.nombreParcourAchete
        this.isLoading = false
      }, error: (err) => {
      }
    })
  }

  // Méthode pour calculer le nombre total de pages
  get totalPages() {
    return Math.ceil(this.transactions.length / this.itemsPerPage);
  }

  // Méthode pour changer de page
  changePage(page: number) {
    this.currentPage = page;
  }

}

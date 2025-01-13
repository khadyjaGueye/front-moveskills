import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../service/apprenant.service';
import { ResultatLois } from '../../../../interfaces/model';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-resultat-lois',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultat-lois.component.html',
  styleUrl: './resultat-lois.component.css'
})
export class ResultatLoisComponent implements OnInit {

  resultats: ResultatLois[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 1;

  constructor(private service: ApprenantService) {

  }
  ngOnInit(): void {
    this.getDataResultat();
  }

  getDataResultat() {
    this.service.url = environment.apiBaseUrl + "loi/resultat";
    this.service.all().subscribe({
      next: (resp) => {
        this.resultats = resp.data.resultats
        //console.log(this.resultats);

        // this.resultats = resp.data.resultats.sort((a: any, b: any) => {
        //   console.log(this.resultats);

        //   // Remplacez 'created_at' par le champ pertinent
        //   return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        // });
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des résultats :", err);
      }
    });
  }


  // Classe de style pour chaque ligne
  getRowClass(score: number): string {
    if (score >= 8) {
      return 'bg-green-50';
    } else if (score >= 5) {
      return 'bg-yellow-50';
    } else {
      return 'bg-red-50';
    }
  }

  // Obtenir l'interprétation en fonction du score
  getInterpretation(score: number): string {
    if (score >= 8) {
      return 'Force et Excellence';
    } else if (score >= 5) {
      return 'Opportunité d\'Apprentissage';
    } else {
      return 'Insuffisance Claire';
    }
  }

  // Méthode pour récupérer les données à afficher pour la page actuelle
  get paginatedResultats() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.resultats.slice(startIndex, endIndex);
  }

  // Méthode pour changer de page
  changePage(page: number) {
    this.currentPage = page;
  }

  // Méthode pour calculer le nombre total de pages
  get totalPages() {
    return Math.ceil(this.resultats.length / this.itemsPerPage);
  }

}

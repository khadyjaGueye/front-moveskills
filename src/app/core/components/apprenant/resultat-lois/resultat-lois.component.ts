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

  resutats: ResultatLois[] = []

  constructor(private service: ApprenantService) {

  }
  ngOnInit(): void {
    this.getDataResultat();
  }

  getDataResultat() {
    this.service.url = environment.apiBaseUrl + "loi/resultat";
    this.service.all().subscribe({
      next: (resp) => {
        this.resutats = resp.data.resultats;
        console.log(resp);
      }
    })
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

  // Calcule le total des réponses pour une loi
  calculateLawTotal(law: any): number {
    return law.scores.reduce((acc: number, score: number | null) => acc + (score || 0), 0);
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
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Lois } from '../../../../interfaces/model';
import { FormateurService } from '../../formateur/service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lois',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterLink],
  templateUrl: './lois.component.html',
  styleUrl: './lois.component.css'
})
export class LoisComponent implements OnInit {

  lois: Lois[] = [];
  overallTotal = 0;
  // Indices pour suivre la loi actuelle
  currentLawIndex = 0;
  userId!: number;

  // Options d'évaluation avec les libellés et les valeurs associées
  evaluationOptions = [
    { label: 'Jamais', value: 0 },
    { label: 'Rarement', value: 1 },
    { label: 'Occasionnellement', value: 2 },
    { label: 'Toujours', value: 3 },
  ];

  constructor(private service: FormateurService) { }

  ngOnInit(): void {
    const userJson = localStorage.getItem('user');

    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.userId = user.id;
    }
    this.getDataLois();
  }

  updateTotal(law: any) {
    law.total = law.scores.reduce((sum: number, score: number) => sum + score, 0);
    this.calculateOverallTotal();
  }

  getEvaluationMessage(total: number): string {
    if (total >= 8) return 'Cette loi est votre terrain de force et d’excellence.';
    if (total >= 5) return 'Cette loi est une opportunité d’apprentissage et de développement personnel.';
    return 'Cette loi est une insuffisance claire. Travaillez dessus.';
  }
  // Vérifie si toutes les questions d'une loi ont une réponse
  isLawComplete(law: any): boolean {
    return law.scores.every((score: number | null) => score !== null);
  }

  // Calcule le total des réponses pour une loi
  calculateLawTotal(law: any): number {
    return law.scores.reduce((acc: number, score: number | null) => acc + (score || 0), 0);
  }

  goToNextLaw() {
    const currentLaw = this.lois[this.currentLawIndex];
    currentLaw.total = this.calculateLawTotal(currentLaw);
    console.log(`Total pour la loi ${currentLaw.id} :`, currentLaw.total);

    if (this.currentLawIndex < this.lois.length - 1) {
      this.currentLawIndex++;
    } else {
      this.calculateOverallTotal();
      this.currentLawIndex = this.lois.length;
      console.log('Calcul terminé. Score total :', this.overallTotal);
    }
  }

  calculateOverallTotal() {
    this.overallTotal = this.lois.reduce(
      (acc: number, law: any) => acc + this.calculateLawTotal(law),
      0
    );
    console.log('Total général des lois :', this.overallTotal);
  }

  // Passe à la loi précédente
  goToPreviousLaw() {
    if (this.currentLawIndex > 0) {
      this.currentLawIndex--;
    }
  }

  // Afficher le résultat final
  showResults() {
    this.calculateOverallTotal(); // Calcule le total avant de passer à l'écran des résultats
    this.currentLawIndex = this.lois.length; // Passe à l'écran des résultats
  }

  sendResultat() {
    this.service.url = environment.apiBaseUrl + "loi"
    // Préparer les données pour l'API
    const formattedData = {
      lois: this.lois.map((law) => ({
        loi_id: law.id, // ID de la loi
        conditions: law.questions.map((question, index) => ({
          condition_id: index + 1, // ID fictif basé sur l'index des questions (modifiez selon vos besoins)
          score: law.scores[index], // Récupérer le score pour chaque question
        })),
      })),
    };
    console.log('Données formatées pour l\'API:', formattedData);
    // Envoyer les données au backend
    this.service.store(formattedData).subscribe({
      next: (response) => {
        this.service.handleResponse(response);
      },
      error: (error) => {
        this.service.handleResponse(error)
      },
    });
  }

  getDataLois() {
    this.service.url = environment.apiBaseUrl + "loi";
    this.service.all().subscribe({
      next: (rep) => {
        this.lois = rep.data.lois;
        // console.log(this.lois);
      }, error: (error) => {
        // console.log(error);
      }
    })
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


}

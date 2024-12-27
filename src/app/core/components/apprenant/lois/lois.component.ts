import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Lois } from '../../../../interfaces/model';
import { FormateurService } from '../../formateur/service/formateur.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-lois',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lois.component.html',
  styleUrl: './lois.component.css'
})
export class LoisComponent implements OnInit {

  lois: Lois[] = [];
  // laws = [
  //   {
  //     id: 1,
  //     title: 'La loi du couvercle',
  //     description: 'Votre leadership détermine votre niveau d’efficacité.',
  //     questions: [
  //       'Lorsque je suis confronté à une difficulté, ma première pensée est : Qui peut m’aider ? et non Que puis-je faire ?',
  //       'Lorsque mon équipe, mon département ou mon entreprise n’atteint pas un objectif, ma première hypothèse est qu’il y a un problème de leadership.',
  //       'Je pense que développer mes capacités de leadership va améliorer de façon drastique mon efficacité.',
  //     ],
  //     scores: [0, 0, 0],
  //     total: 0,
  //   },
  //   {
  //     id: 2,
  //     title: 'La loi de l’influence',
  //     description: 'Le leadership c’est de l’influence. Rien de plus, rien de moins.',
  //     questions: [
  //       'Je compte sur mon influence plutôt que sur ma position ou mon titre pour que les autres me suivent ou fassent ce que je veux.',
  //       'Pendant les réunions ou réflexions de groupe, les gens se tournent vers moi pour demander mon avis.',
  //       'Je compte plus sur mes relations avec les autres plutôt que sur les systèmes, l’organisation et les processus pour faire faire le boulot.',
  //     ],
  //     scores: [0, 0, 0],
  //     total: 0,
  //   },
  //   {
  //     id: 3,
  //     title: 'La loi du processus',
  //     description: 'Le leadership se développe de jour en jour, pas en un jour.',
  //     questions: [
  //       'Je dispose d’un plan concret et spécifique de développement personnel que j’\évalue chaque semaine.',
  //       'J’ai trouvé des experts et mentors pour différents domaines de ma vie que je rencontre régulièrement.',
  //       'Pour mon développement personnel, j’ai lu au moins 6 livres ou écouter 12 livres audio ou participé à au moins 3 formations en salle au cours des 12 derniers mois.',
  //     ],
  //     scores: [0, 0, 0],
  //     total: 0,
  //   },
  // ];

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

  // Calcule le score total pour toutes les lois
  // calculateOverallTotal() {
  //   this.overallTotal = this.laws.reduce(
  //     (acc: number, law: any) => acc + this.calculateLawTotal(law),
  //     0
  //   );
  // }

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

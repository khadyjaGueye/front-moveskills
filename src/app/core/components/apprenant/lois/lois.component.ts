import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lois',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lois.component.html',
  styleUrl: './lois.component.css'
})
export class LoisComponent implements OnInit {

  laws = [
    {
      id: 1,
      title: 'La loi du couvercle',
      description: 'Votre leadership détermine votre niveau d’efficacité.',
      questions: [
        'Lorsque je suis confronté à une difficulté, ma première pensée est : Qui peut m’aider ? et non Que puis-je faire ?',
        'Lorsque mon équipe, mon département ou mon entreprise n’atteint pas un objectif, ma première hypothèse est qu’il y a un problème de leadership.',
        'Je pense que développer mes capacités de leadership va améliorer de façon drastique mon efficacité.',
      ],
      scores: [0, 0, 0],
      total: 0,
    },
    {
      id: 2,
      title: 'La loi de l’influence',
      description: 'Le leadership c’est de l’influence. Rien de plus, rien de moins.',
      questions: [
        'Je compte sur mon influence plutôt que sur ma position ou mon titre pour que les autres me suivent ou fassent ce que je veux.',
        'Pendant les réunions ou réflexions de groupe, les gens se tournent vers moi pour demander mon avis.',
        'Je compte plus sur mes relations avec les autres plutôt que sur les systèmes, l’organisation et les processus pour faire faire le boulot.',
      ],
      scores: [0, 0, 0],
      total: 0,
    },
  ];

  overallTotal = 0;

  constructor() { }

  ngOnInit(): void {

  }

  updateTotal(law: any) {
    law.total = law.scores.reduce((sum: number, score: number) => sum + score, 0);
    this.calculateOverallTotal();
  }

  calculateOverallTotal() {
    this.overallTotal = this.laws.reduce((sum, law) => sum + law.total, 0);
  }

  getEvaluationMessage(total: number): string {
    if (total >= 8) return 'Cette loi est votre terrain de force et d’excellence.';
    if (total >= 5) return 'Cette loi est une opportunité d’apprentissage et de développement personnel.';
    return 'Cette loi est une insuffisance claire. Travaillez dessus.';
  }


}

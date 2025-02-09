import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Answer, Question } from '../../../../interfaces/model';
import { ApprenantService } from '../service/apprenant.service';
import { TestService } from '../../../../shared/services/test.service';
import { finalize, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  // Tableau de questions
  questions: Question[] = [
    {
      text: "Dans la vie en général, ce qui me motive c'est...",
      answers: [
        { text: "Des buts et de l\'action, se dépasser soi-meme", points: 6, color: 'red' },
        { text: "Des relations profondes et harmonieuses avec les autres", points: 3, color: 'yellow' },
        { text: "La stabilité et le sentiment de maîtriser son existence", points: 1, color: 'green' },
        { text: "Participer dans l\'enthousiasme , découvrir et apprendre", points: 0, color: 'blue' }
      ]
    },
    {
      text: "Face au changement, j'anticipe d'abord les...",
      answers: [
        { text: "Chances et opportunités", points: 6, color: 'red' },
        { text: "Processus et stratégie", points: 3, color: 'yellow' },
        { text: "Risques et difficultés", points: 1, color: 'green' },
        { text: "Enjeux et gains", points: 0, color: 'blue' }
      ]
    },
    {
      text: "Au quotidien; je me montre le plus souvent...",
      answers: [
        { text: "Calme et réflexif", points: 6, color: 'red' },
        { text: "Determiné et actif", points: 3, color: 'yellow' },
        { text: "Créatif et sympathique", points: 1, color: 'green' },
        { text: "Prudent et conciliant", points: 0, color: 'blue' }
      ]
    },
    {
      text: "Quand les choses ne se passent pas comme je veux, je deviens...",
      answers: [
        { text: "Impatient, colérique", points: 6, color: 'red' },
        { text: "Désordonné, chaotique", points: 3, color: 'yellow' },
        { text: "Lent, borné", points: 1, color: 'green' },
        { text: "Tatillon, taquin", points: 0, color: 'blue' }
      ]
    },
    {
      text: "Pour aider les autres, je sais (je suis bon pour...",
      answers: [
        { text: "Ecouter sans préjugé, partager sincérement", points: 6, color: 'red' },
        { text: "Encourager, pousser à décider", points: 3, color: 'yellow' },
        { text: "Expliquer, clarifier, analyser", points: 1, color: 'green' },
        { text: "Inspirer, donner envie", points: 0, color: 'blue' }
      ]
    },
    {
      text: "Pour être efficace au travail, je préfère surtout disposer de...",
      answers: [
        { text: "Régles et consignes claires, et côtoyer des gens compétents", points: 6, color: 'red' },
        { text: "Variété; changement et ne pas devoir trop se prendre au sérieux", points: 3, color: 'yellow' },
        { text: "Action, mouvement,risque, ambition et sentir que je peux décider", points: 1, color: 'green' },
        { text: "Harmonie avec mes collègues, et pouvoir avancer à mon rythme", points: 0, color: 'blue' }
      ]
    },

    {
      text: "Ce que j'apprécie dans une équipe,...",
      answers: [
        { text: "Se sentir plus fort pour viser plus haut et gagner", points: 6, color: 'red' },
        { text: "Un fonctionnement fluide, où chacun sait ce qu'il doit faire ", points: 3, color: 'yellow' },
        { text: "Renforcer l'amitié' et la solidarité' entre nous", points: 1, color: 'green' },
        { text: "Un climat ouvert à la créativité et à l’expression libre de chacun", points: 0, color: 'blue' }
      ]
    },
    {
      text: "Dans les réunions, je fais preuve de...",
      answers: [
        { text: "Optimisme et sens de l'humour", points: 6, color: 'red' },
        { text: "Flexibilité et bonne volonté", points: 3, color: 'yellow' },
        { text: "Réflexion et analyse", points: 1, color: 'green' },
        { text: "Esprit de décision et d'organisation", points: 0, color: 'blue' }
      ]
    },
    {
      text: "Je contribue à resoudre les conflits en...",
      answers: [
        { text: "Etant patient tolérant, et flexible", points: 6, color: 'red' },
        { text: "Impliquant tous les acteurs autour de solutions originales", points: 3, color: 'yellow' },
        { text: "Me montrant proactif, direct, concret", points: 1, color: 'green' },
        { text: "Faisant preuve d'objectivité, de rationalité, de recul", points: 0, color: 'blue' }
      ]
    },
    {
      text: "Ce que je déteste dans les changements c'est quand...",
      answers: [
        { text: "C'est le règne de la confusion", points: 6, color: 'red' },
        { text: "Il y a des gagnants et des perdants", points: 3, color: 'yellow' },
        { text: "On ne peut pas y participer directement", points: 1, color: 'green' },
        { text: "Ça n'avance pas assez vite!", points: 0, color: 'blue' }
      ]
    },
  ];
  role: string = "";
  userId!: number;
  nom!: string;
  email!: string;
  code!: string;

  currentIndex: number = 1;
  totalColors: { [key: string]: number } = { red: 0, green: 0, blue: 0, yellow: 0 };
  totalScore: number = 0;
  result: string = '';
  currentQuestionIndex: number = 0; // Index de la question actuelle
  currentAnswerIndex: number = 0; // Index de la réponse actuelle
  availablePoints: number[] = [6, 3, 1, 0]; // Options de points disponibles
  currentQuestion = 0;
  remainingAnswers: Answer[] = [...this.questions[this.currentQuestion].answers];
  remainingPoints = [6, 3, 1, 0]; // Liste des points restants
  displayColorCharacteristics: boolean = false;
  showResultsModal: boolean = false; // Indicateur pour afficher la modal
  message: string = "";
  diplayButton: boolean = true;
  dominantColor: string = ''; // Variable pour stocker la couleur dominante
  answerSelected = false;
  answersPerBatch = 4; // Nombre de questions affichées par groupe
  completedAnswers = new Set<number>(); // Questions complétées
  // Scores pour chaque couleur
  scores: { [key: string]: number } = {
    red: 0,
    yellow: 0,
    green: 0,
    blue: 0
  };
  open: boolean = false;
  testStarted: boolean = false; // Nouvelle variable pour gérer l'affichage du test
  token: string = "";
  showAnimation: boolean = true;

  constructor(private service: ApprenantService, private test: TestService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token")!;
    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');

    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.userId = user.id;
      this.nom = user.name;
      this.code = user.code_invitaion;
      this.email = user.email;
      this.role = user.role;
      this
    } else {
      // Gérer le cas où pas d'utilisateur authentifié
    }

  }

  openModal() {
    this.open = true;
    // Affiche les caractéristiques après la fermeture du modal
  }

  // Fermer la modal
  closeModal() {
    this.open = false;
  }
  displayCom: boolean = false
  openModalComm() {
    this.displayCom = true;
  }
  closeCom() {
    this.displayCom = false
  }
  closeButtonEnvoyer() {
    this.diplayButton = false;
  }

  // Fonction pour démarrer le test
  startTest() {
    this.testStarted = true; // Change l'état pour afficher le test
  }

  testTerminer: boolean = true; // La variable qui contrôle l'affichage du test
  // Méthode pour fermer le test
  closeTest() {
    //this.testStarted = false;
    //this.displayColorCharacteristics = true;

  }

  // Fonction pour soumettre la réponse sélectionnée
  submitAnswer(points: number, answer: Answer) {
    // Ajouter les points au score de la couleur
    this.scores[answer.color] += points;
    // Retirer la réponse et le point sélectionnés
    this.remainingAnswers = this.remainingAnswers.filter(a => a !== answer);
    this.remainingPoints = this.remainingPoints.filter(p => p !== points);

    // Si toutes les réponses sont éliminées, passer à la question suivante
    if (this.remainingAnswers.length === 0 || this.remainingPoints.length === 0) {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < this.questions.length) {
        // Réinitialiser les réponses et points pour la prochaine question
        this.remainingAnswers = [...this.questions[this.currentQuestionIndex].answers];
        this.remainingPoints = [6, 3, 1, 0];
      } else {
        this.showResultsModal = true; // Afficher la modal avec les résultats
      }
    }
    // Quand toutes les questions sont répondues, calculez la couleur dominante
    if (this.currentQuestionIndex === this.questions.length - 1) {
      this.calculateDominantColor();
    }
  }

  calculateDominantColor() {
    const scores = this.scores;
    const maxScore = Math.max(scores['red'], scores['yellow'], scores['green'], scores['blue']);
    if (maxScore === scores['red']) {
      this.dominantColor = 'red';
    } else if (maxScore === scores['yellow']) {
      this.dominantColor = 'yellow';
    } else if (maxScore === scores['green']) {
      this.dominantColor = 'green';
    } else if (maxScore === scores['blue']) {
      this.dominantColor = 'blue';
    }
  }

  // Calcul du score total en pourcentage
  calculateTotalScore(): number {
    const totalPoints = Object.values(this.scores).reduce((acc, val) => acc + val, 0);
    return (totalPoints / (this.questions.length * 6)) * 100;
  }

  calculateTotalColorScore(): number {
    return this.scores['red'] + this.scores['yellow'] + this.scores['green'] + this.scores['blue'];
  }

  // Fonction pour obtenir la couleur avec le plus de points
  getHighestScoreColor() {
    const highestColor = Object.keys(this.scores).reduce((a, b) => this.scores[a] > this.scores[b] ? a : b);
    return highestColor;
  }

  // Afficher les résultats après le test
  showResults() {
    this.showResultsModal = true; // Activer la modal pour afficher les résultats
  }

  //afficher le cercle et ces couleurs
  getCircleStyle() {
    return {
      'background': `conic-gradient(
          red 0% 25%,
          yellow 25% 50%,
          green 50% 75%,
          blue 75% 100%
        )`
    };
  }

  // Style pour afficher le nom de la couleur sur le disque
  getColorLabelStyle(color: string, label: string) {
    return {
      'position': 'absolute',
      'font-size': '12px',
      'font-weight': 'bold',
      'color': color
    };
  }
  // Calculer les pourcentages basés sur les scores
  calculatePercentages() {
    const totalPoints = this.scores['red'] + this.scores['yellow'] + this.scores['green'] + this.scores['blue'];
    return {
      red: (this.scores['red'] / totalPoints) * 100,
      yellow: (this.scores['yellow'] / totalPoints) * 100,
      green: (this.scores['green'] / totalPoints) * 100,
      blue: (this.scores['blue'] / totalPoints) * 100,
    };
  }

  testInProgress = false; // Indique si les résultats sont en cours d'envoi

  sendResults() {
    const percentages = this.calculatePercentages();

    // Conversion en entier pour chaque pourcentage
    const data = {
      rouge: Math.round(percentages.red),
      jaune: Math.round(percentages.yellow),
      vert: Math.round(percentages.green),
      bleu: Math.round(percentages.blue),
      user_id: this.userId,
    };

    console.log(data);

    this.testInProgress = true; // Indiquer que l'envoi est en cours

    this.test.store(data, this.token).pipe(
      tap({
        next: (resp) => {
          //this.service.handleResponse(resp);
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi des données :", error);
          this.service.handleResponse(error); // Gérer les erreurs
          this.testInProgress = false; // Arrêter le chargement si une erreur survient
        }
      }), finalize(() => {
        // this.displayColorCharacteristics = true;
      })
    ).subscribe({
      complete: () => {
        this.testInProgress = false; // L'envoi est terminé
        // this.displayColorCharacteristics = true; // Les résultats peuvent être affichés
      }
    });
  }


  // Vérifie si toutes les réponses du groupe courant sont données

  isBatchCompleted(): boolean {
    const startIndex = Math.floor(this.currentQuestionIndex / this.answersPerBatch) * this.answersPerBatch;
    const endIndex = startIndex + this.answersPerBatch;
    return this.questions.slice(startIndex, endIndex).every((_, i) => this.completedAnswers.has(startIndex + i));
  }

  // Méthode pour aller à la question suivante
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1 && this.isBatchCompleted()) {
      this.currentQuestionIndex++;
      this.updateRemainingAnswers();
      this.answerSelected = this.isBatchCompleted(); // Mettre à jour l'état du bouton Suivant
    }
  }

  // Méthode pour revenir à la question précédente
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--; // Aller à la question précédente
      this.updateRemainingAnswers(); // Mettre à jour les réponses restantes
      this.answerSelected = this.isBatchCompleted(); // Mettre à jour l'état du bouton Suivant
    }
  }

  // Met à jour les réponses restantes pour la question actuelle
  updateRemainingAnswers() {
    if (this.currentQuestionIndex < this.questions.length) {
      this.remainingAnswers = [...this.questions[this.currentQuestionIndex].answers];
      this.remainingPoints = [6, 3, 1, 0];
    }
  }

  // Méthode pour obtenir la couleur en français
  getDominantColorInFrench(): string {
    const colorMap: { [key: string]: string } = {
      red: 'rouge',
      yellow: 'jaune',
      green: 'vert',
      blue: 'bleu'
    };
    return colorMap[this.dominantColor] || this.dominantColor;
  }

  // Méthode pour obtenir l'image de l'animal correspondant
  getAnimalImage(): string {
    const animalImages: { [key: string]: string } = {
      red: 'assets/images/1.jpg', // Chemin vers l'image du taureau
      yellow: 'assets/images/33.avif', // Chemin vers l'image du singe
      green: 'assets/images/tortue.png', // Chemin vers l'image de la tortue
      blue: 'assets/images/12.jpg' // Chemin vers l'image de l'aigle
    };
    return animalImages[this.dominantColor] || 'assets/images/default.png'; // Image par défaut
  }

  // Méthode pour obtenir le nom de l'animal correspondant
  getAnimalName(): string {
    const animalNames: { [key: string]: string } = {
      red: 'Taureau',
      yellow: 'Singe',
      green: 'Tortue',
      blue: 'Aigle'
    };
    return animalNames[this.dominantColor] || 'Animal inconnu';
  }

  // Méthode pour obtenir la couleur en hexadécimal
  getDominantColorHex(): string {
    const colorHexMap: { [key: string]: string } = {
      red: '#FF0000',    // Rouge
      yellow: '#FFD700', // Jaune
      green: '#008000',  // Vert
      blue: '#0000FF'    // Bleu
    };
    return colorHexMap[this.dominantColor] || '#000000'; // Noir par défaut
  }


  showToast: boolean = false;
  // Methode pour afficher les notifications
  launchToast() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000); // 5 secondes
  }

  getOrganizationName(code: string): string {
    switch (code) {
      case 'ILLIMITIS6497KO':
        return 'Illimitis';
      case 'PNUD6639JZ':
        return 'Pnud';
      case 'CBAO5645PT':
        return 'CBAO';
      case 'NRC7470JF':
        return 'NCR';
      case 'PNUD BURUNDI2084JV':
        return 'PNUD';
        case 'KFW4303YV':
          return 'KFW';
      default:
        return 'Code inconnu';
    }
  }


  // Afficher le GIF pendant 5 secondes
  displayGIF(): void {
    this.showAnimation = true;
    setTimeout(() => {
      this.showAnimation = false;
    }, 5000); // 5000 ms = 5 secondes
  }






}

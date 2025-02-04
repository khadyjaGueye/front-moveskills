import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { Answer, Question } from '../../../../interfaces/model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent implements OnInit {

  apprenantForm: FormGroup;
  file: { nom: string; prenom: string; email: string; numero: string }[] = []; // Contient les données extraites
  selectedFile: File | null = null;
  display: boolean = false;
  showModal: boolean = false;
  isLoading:boolean = false

  constructor(private fb: FormBuilder, private service: ApprenantService) {
    this.apprenantForm = fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero: ['', Validators.required],
    });

  }

  ngOnInit(): void {

  }
  displayAjoutApprenant() {
    this.display = true
  }
  closeAjoutApprenant() {
    this.display = false;
  }
  addApprenant() {
    this.service.url = environment.apiBaseUrl + "formateur/affiliations";

    // Créer une instance de FormData
    const formData = new FormData();

    // Parcourir les valeurs du formulaire et les ajouter à FormData
    Object.keys(this.apprenantForm.value).forEach((key) => {
      formData.append(key, this.apprenantForm.value[key]);
    });

    // Envoyer les données via le service
    this.service.store(formData).subscribe({
      next: (response) => {
        this.service.handleResponse(response);
        this.apprenantForm.reset();
      },
      error: (err) => {
        this.service.handleResponse(err);
        this.apprenantForm.reset();
      }
    });
  }


  openTab() {
    this.showModal = true;
  }

  closeTab() {
    this.showModal = false;
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      console.error('Vous ne pouvez importer qu\'un seul fichier à la fois.');
      return;
    }
    this.selectedFile = target.files[0];
    console.log(this.selectedFile); // Vérifiez que le fichier est bien sélectionné
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const binaryData = e.target.result;

      // Lire le fichier Excel
      const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });

      // Supposons que les données se trouvent dans la première feuille
      const sheetName: string = workbook.SheetNames[0];
      const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convertir en tableau JSON
      const jsonData = XLSX.utils.sheet_to_json(sheetData, { header: 1 }) as string[][];

      // Mapper les données (en supposant que le fichier contient 4 colonnes : nom, email, mot de passe)
      this.file = jsonData
        .slice(1) // Ignorer l'en-tête
        .map(row => ({
          nom: row[0],
          prenom: row[1],
          email: row[2],
          numero: row[3],
        }));

      // console.log(this.file); // Affichez les données dans la console
    };

    reader.readAsBinaryString(target.files[0]);
    this.showModal = false;
  }


  // Soumettre les données a importées
  submitData(): void {
    this.service.url = environment.apiBaseUrl + "formateur/affiliations/import";
    if (!this.selectedFile) {
      console.error('Aucun fichier sélectionné');
      return;
    }
    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.service.store(formData).subscribe({
      next: (rep) => {
        this.service.handleResponse(rep);
      },
      error: (err) => {
        this.service.handleResponse(err);
      }
    });
  }

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
  userId!: number;
  currentQuestion = 0;
selectedAnswer: any = null;
scores: { [key: string]: number } = { red: 0, yellow: 0, green: 0, blue: 0 };

ratingOptions = [
  { label: 'Me correspond le plus', points: 6 },
  { label: 'Me correspond assez', points: 3 },
  { label: 'Me correspond assez peu', points: 1 },
  { label: 'Ne me correspond pas du tout', points: 0 }
];
selectedAnswers: { [color: string]: number } = {}; // Stocke les réponses sélectionnées
colorScores: { [key: string]: number } = { red: 0, yellow: 0, green: 0, blue: 0 };
answersPerBatch = 4; // Nombre de questions affichées par groupe
completedAnswers = new Set<number>(); // Questions complétées
answerSelected = false;

 // Vérifie si toutes les réponses du groupe courant sont données

 isBatchCompleted(): boolean {
  const startIndex = Math.floor(this.currentQuestion / this.answersPerBatch) * this.answersPerBatch;
  const endIndex = startIndex + this.answersPerBatch;
  return this.questions.slice(startIndex, endIndex).every((_, i) => this.completedAnswers.has(startIndex + i));
}

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.selectedAnswer = null;
      this.answerSelected = this.isBatchCompleted(); // Mettre à jour l'état du bouton Suivant
    }
  }

  selectAnswer(color: string, points: number) {
    this.selectedAnswers[color] = points;
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.answerSelected = this.isBatchCompleted(); // Mettre à jour l'état du bouton Suivant
    }
  }
  

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  submitTest() {
    // 1. Calculer les scores bruts pour chaque couleur
    this.scores = { red: 0, yellow: 0, green: 0, blue: 0 };
    Object.keys(this.selectedAnswers).forEach((color: string) => {
      this.scores[color] += this.selectedAnswers[color];
    });

    // 2. Calculer le total des points
    const total = Object.values(this.scores).reduce((acc, val) => acc + val, 0);

    // 3. Calculer les pourcentages bruts
    let percentages = Object.keys(this.scores).map(color => ({
      color,
      rawPercentage: (this.scores[color] / total) * 100, // Pourcentage brut
      percentage: Math.floor((this.scores[color] / total) * 100) // Pourcentage arrondi
    }));

    // 4. Calculer la différence entre la somme des pourcentages arrondis et 100%
    let totalPercentage = percentages.reduce((acc, obj) => acc + obj.percentage, 0);
    let difference = 100 - totalPercentage;

    // 5. Distribuer la différence aux couleurs ayant la plus grande partie décimale
    percentages
      .sort((a, b) => (b.rawPercentage - b.percentage) - (a.rawPercentage - a.percentage)) // Trier par partie décimale
      .slice(0, difference) // Prendre les `difference` plus grandes valeurs
      .forEach(obj => obj.percentage++); // Ajouter 1 point pour compenser

    // 6. Créer l'objet `data` avec les pourcentages et l'ID de l'utilisateur
    const data = {
      rouge: percentages.find(p => p.color === 'red')?.percentage || 0,
      jaune: percentages.find(p => p.color === 'yellow')?.percentage || 0,
      vert: percentages.find(p => p.color === 'green')?.percentage || 0,
      bleu: percentages.find(p => p.color === 'blue')?.percentage || 0,
      // user_id: this.authService.getCurrentUserId(), // Récupérer l'ID de l'utilisateur connecté
    };

    // 7. Afficher l'objet `data` dans la console
    console.log("Données à enregistrer :", data);

    // 8. Enregistrer les résultats dans la base de données
    this.saveResults(data);
  }

  saveResults(data: any) {
    // Enregistrer les résultats dans la base de données
    console.log('Résultats enregistrés:', data);
    // Ici, vous pouvez appeler une API pour enregistrer les données
  }

  get colorResults() {
    const total = Object.values(this.scores).reduce((acc, val) => acc + val, 0);

    if (total === 0) {
      return Object.keys(this.scores).map(color => ({ color, percentage: 0 }));
    }

    // 🔹 1. Calcul des pourcentages avec `Math.floor()` (arrondi vers le bas)
    let percentages = Object.keys(this.scores).map(color => ({
      color,
      rawPercentage: (this.scores[color] / total) * 100, // Valeur brute
      percentage: Math.floor((this.scores[color] / total) * 100) // Arrondi bas
    }));

    // 🔹 2. Calcul de la somme des pourcentages actuels
    let totalPercentage = percentages.reduce((acc, obj) => acc + obj.percentage, 0);

    // 🔹 3. Trouver la différence avec 100%
    let difference = 100 - totalPercentage;

    // 🔹 4. Ajouter la différence aux couleurs ayant la plus grande partie décimale
    percentages
      .sort((a, b) => (b.rawPercentage - b.percentage) - (a.rawPercentage - a.percentage)) // Trier par partie décimale
      .slice(0, difference) // Prendre les `difference` plus grandes valeurs
      .forEach(obj => obj.percentage++); // Ajouter 1 point pour compenser

    return percentages.map(({ color, percentage }) => ({ color, percentage }));
  }


  // saveResults() {
  //   // Enregistrer les résultats dans la base de données
  //   console.log('Résultats enregistrés:', this.colorResults);
  // }


    getData(affiliation: string) {
      this.isLoading = true;
      this.service.url = `${environment.apiBaseUrl}formateur/affiliations/${affiliation}`;
      this.service.all().subscribe({
        // next: (resp) => {
        //   this.affiliations = resp.data.affiliations || [];
        //   if (this.affiliations.length === 0) {
        //     this.message = "Affiliations non inscrites"
        //   }
        //   this.isLoading = false
        // },
        // error: (err) => {
        //  console.log(err);

        //   this.message = 'Une erreur s\'est produite lors du chargement des données.';
        // }
      });
    }

  }

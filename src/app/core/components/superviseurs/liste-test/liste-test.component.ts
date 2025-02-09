import { Component, OnInit } from '@angular/core';
import { SuperviseurService } from '../services/superviseur.service';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { Item, Report, UserDetail } from '../../../../interfaces/model';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-liste-test',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, ReactiveFormsModule, FormsModule, SharedModule],
  templateUrl: './liste-test.component.html',
  styleUrl: './liste-test.component.css'
})
export class ListeTestComponent implements OnInit {

  public userDetails: UserDetail[] = [];
  public report: Report = {
    total_participants: 0,
    color_distribution: {
      vert: 0,
      jaune: 0,
      rouge: 0,
      bleu: 0,
    },
    percentage_distribution: {
      vert: 0,
      jaune: 0,
      rouge: 0,
      bleu: 0,
    }
  };

  public searchTerm: string = ''; // Variable pour stocker la valeur de la recherche
  public page: number = 1;
  public itemsPerPage: number = 5; // Nombre d'éléments par page
  public isLoading: boolean = true;
  public items: Item[] = [];
  // Définir l'ordre des couleurs
  colorOrder = ['rouge', 'vert', 'jaune', 'bleu'];
  defaultItems = [
    { name: 'Vert', color: '#008000', counter: 0 },
    { name: 'Jaune', color: '#DACF0A', counter: 0 },
    { name: 'Rouge', color: '#FF0000', counter: 0 },
    { name: 'Bleu', color: '#0000FF', counter: 0 }
  ]; // Tableau par défaut

  constructor(private service: SuperviseurService) { }

  ngOnInit(): void {
    this.getDataParticipant();

  }

  getDataParticipant() {
    this.isLoading = true
    this.service.url = environment.apiBaseUrl + "RapportCouleurDominante";
    this.service.all().subscribe({
      next: (resp) => {
        this.userDetails = resp.data.userDetails;
        //console.log(this.userDetails);
        this.report = resp.data.report;
       // console.log(this.report);
        this.isLoading = false; // Le chargement est terminé
        this.initItems();
        this.startCounters();
      },error:(err)=>{
        console.log(err);
      }
    })
  }
  // Initialise items à partir des données de report
  initItems() {
    this.items = [
      { name: 'Vert', color: '#008000', target: this.report.percentage_distribution.vert, counter: 0 },
      { name: 'Jaune', color: '#DACF0A', target: this.report.percentage_distribution.jaune, counter: 0 },
      { name: 'Rouge', color: '#FF0000', target: this.report.percentage_distribution.rouge, counter: 0 },
      { name: 'Bleu', color: '#0000FF', target: this.report.percentage_distribution.bleu, counter: 0 }
    ];
  }

  startCounters() {
    this.items.forEach(item => {
      this.animateCounter(item);
    });
  }

  animateCounter(item: any) {
    const target = Math.floor(item.target); // Arrêter avant la virgule
    const increment = Math.ceil(target / 100); // Vitesse du compteur
    const interval = setInterval(() => {
      if (item.counter < target) {
        item.counter += increment;
        if (item.counter > target) { // Assure de ne pas dépasser la cible
          item.counter = target;
        }
      } else {
        item.counter = target; // S'assurer que le compteur atteint exactement la valeur entière
        clearInterval(interval);
      }
    }, 20); // Temps entre chaque incrément
  }


  getColorClass(couleur: string): string {
    switch (couleur) {
      case 'vert':
        return 'text-green-500'; // Classe CSS pour la couleur verte
      case 'jaune':
        return 'text-yellow-500'; // Classe CSS pour la couleur jaune
      case 'rouge':
        return 'text-red-500'; // Classe CSS pour la couleur rouge
      case 'bleu':
        return 'text-blue-500'; // Classe CSS pour la couleur bleue
      default:
        return 'text-slate-500'; // Valeur par défaut si la couleur n'est pas reconnue
    }
  }
  generatePDF() {
    // Créer une nouvelle instance de PDF
    const doc = new jsPDF();

    // Titre du document PDF
    doc.setFontSize(16);
    doc.text('Rapport de Couleur Dominante', 10, 10);

    // Détails du rapport
    doc.setFontSize(12);
    doc.text(`Total Participants: ${this.report.total_participants}`, 10, 20);

    // Créer un tableau avec les données de `report.color_distribution` et `report.percentage_distribution`
    const headers = [['Couleur', 'Répartition', 'Pourcentage']];
    const data = [
      ['Vert', this.report.color_distribution.vert, `${this.report.percentage_distribution.vert}%`],
      ['Jaune', this.report.color_distribution.jaune, `${this.report.percentage_distribution.jaune}%`],
      ['Rouge', this.report.color_distribution.rouge, `${this.report.percentage_distribution.rouge}%`],
      ['Bleu', this.report.color_distribution.bleu, `${this.report.percentage_distribution.bleu}%`]
    ];

    // Utilisation de autoTable pour insérer le tableau de distribution
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30, // Définir la position de départ du tableau
      theme: 'grid', // Vous pouvez personnaliser le style du tableau
    });

    // Ajouter une nouvelle page pour afficher les détails des utilisateurs
    doc.addPage();

    // Titre pour les détails des utilisateurs
    doc.setFontSize(16);
    doc.text('Liste des Utilisateurs', 10, 10);

    // Trier les utilisateurs par ordre des couleurs dominantes
    const colorOrder = ['vert', 'jaune', 'rouge', 'bleu']; // Définir l'ordre des couleurs
    const sortedUsers = [...this.userDetails].sort((a, b) => {
      return colorOrder.indexOf(a.couleur_dominante) - colorOrder.indexOf(b.couleur_dominante);
    });

    // Créer un tableau avec les données des utilisateurs triés
    const userHeaders = [['ID', 'Nom', 'Email', 'Couleur Dominante']];
    const userData = sortedUsers.map((user, index) => [
      index + 1, // L'ID sera l'index + 1 pour que l'index commence à 1
      user.name,
      user.email,
      user.couleur_dominante
    ]);

    // Utilisation de autoTable pour insérer le tableau des utilisateurs triés
    autoTable(doc, {
      head: userHeaders,
      body: userData,
      startY: 30, // Position de départ du tableau des utilisateurs
      theme: 'grid', // Style du tableau
    });

    // Sauvegarder le fichier PDF
    doc.save('rapport_couleur_dominante_et_utilisateurs.pdf');
  }


  // Méthode pour trier les utilisateurs par couleur
  getSortedUsers() {
    // Filtrer les utilisateurs en fonction du terme de recherche
    const filteredUsers = this.userDetails.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Trier les utilisateurs filtrés en fonction de l'ordre des couleurs
    return filteredUsers.sort((a, b) => {
      return this.colorOrder.indexOf(a.couleur_dominante) - this.colorOrder.indexOf(b.couleur_dominante);
    });
  }


  get filteredApprenant() {
    return this.userDetails.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

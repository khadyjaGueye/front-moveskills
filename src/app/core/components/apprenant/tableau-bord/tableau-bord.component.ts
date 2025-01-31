import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Citation, Parcour, Test, User } from '../../../../interfaces/model';
import { ApprenantsAyantAchete, Inscrit, TopParcour, Vente } from '../../admin/interface/model';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { Parcours } from '../../formateur/interface/model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tableau-bord',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule,RouterLink],
  templateUrl: './tableau-bord.component.html',
  styleUrl: './tableau-bord.component.css'
})
export class TableauBordComponent implements OnInit {

  //citations: Citation[] = [];
  listeParcoursAchete: Parcours[] = [];
  parcours: Parcour[] = [];
  citations = [
    "L'avenir appartient à ceux qui croient à la beauté de leurs rêves.",
    "La vie est ce qui se passe pendant que vous êtes occupé à faire d'autres projets.",
    "Le succès est la somme de petits efforts répétés jour après jour.",
    "Ne regardez pas l'horloge; faites ce qu'elle fait. Continuez.",
    "La seule limite à notre épanouissement de demain sera nos doutes et hésitations d'aujourd'hui."
  ];
  totalAffilition: number = 0;
  nombreTestFait: number = 0;
  nombreparcourAchete: number = 0;
  currentIndex = 0;
  interval: any;
  display: boolean = true;
  isLoading: boolean = true;
  elementsAffiches: number = 4; // Par défaut, afficher 4 éléments
  tests: Test[] = [];
  testsMd: Test[] = []
  id!: number;

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {
    this.getCitationDuJours();
    // Démarrer le défilement automatique à l'initialisation
    this.startAutoScroll();
    this.getData();
    this.getDataParcours();
    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');
    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.id = user.id;
      this.getDataResultatsTest();
    } else {
      // Gérer le cas où pas d'utilisateur authentifié
    }
  }

  getData() {
    this.service.url = environment.apiBaseUrl + "dashboard/apprenant"
    this.service.all().subscribe({
      next: (resp) => {
        this.listeParcoursAchete = resp.data.listeParcoursAchete;
        this.nombreTestFait = resp.data.nombreTestFait
        this.nombreparcourAchete = resp.data.nombreparcourAchete
      }, error: (err) => {

      }
    })
  }

  getCitationDuJours() {
    this.isLoading = true
    this.service.url = environment.apiBaseUrl + "citations/published-by"
    this.service.all().subscribe({
      next: (resp) => {
        // this.citations = resp.data.data;
        // console.log(this.citations);
        this.isLoading = false;
      }
    })
  }

  ngOnDestroy() {
    // Nettoyer l'intervalle lorsque le composant est détruit
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // Fonction pour démarrer le défilement automatique
  startAutoScroll() {
    this.interval = setInterval(() => {
      this.next();
    }, 5000); // Changez la valeur (en millisecondes) pour la vitesse de défilement
  }

  // Fonction pour passer à la citation suivante
  next() {
    if (this.currentIndex < this.citations.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Revenir au début
    }
  }

  // Fonction pour revenir à la citation précédente
  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.citations.length - 1; // Revenir à la fin
    }
  }

  getDataParcours() {
    this.isLoading = true;
    this.service.url = environment.apiBaseUrl + "accueil";
    this.service.all().subscribe({
      next: (resp) => {
        this.parcours = resp.data.parcours;
        // console.log(this.parcours);
        this.isLoading = false;
      }, error: (err) => {
      }
    })
  }

  // Fonction pour afficher plus d'éléments
  voirPlus() {
    this.elementsAffiches += 4; // Augmenter de 4 éléments
  }

  openModalParcour(id: number) {

  }

  closeModalParcour() { }
  getDataResultatsTest() {
    this.isLoading = true;
    this.service.url = `${environment.apiBaseUrl}question1/${this.id}`;
    this.service.all().subscribe({
      next: (rep) => {
        this.testsMd = rep.data.tests;
        //  console.log(this.testsMd);
        this.isLoading = false;
      }, error: (err) => {
        //console.log(err);

      }
    })
  }

}

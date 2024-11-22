import { Component, OnInit } from '@angular/core';
import { SuperviseurService } from '../services/superviseur.service';

import { CommonModule } from '@angular/common';
import { Apprenant } from '../../apprenant/interface/apprenant';
import { Test, User } from '../../../../interfaces/model';
import { environment } from '../../../../../environments/environment.development';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-list-apprenant',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, ReactiveFormsModule, FormsModule, SharedModule,],
  templateUrl: './list-apprenant.component.html',
  styleUrl: './list-apprenant.component.css'
})
export class ListApprenantComponent implements OnInit {

  apprenants: User[] = [];
  display: boolean = false;
  idApprenant: number = 1;
  isLoading: boolean = true;
  public searchTerm: string = ''; // Variable pour stocker la valeur de la recherche
  public page: number = 1;
  public itemsPerPage: number = 5; // Nombre d'éléments par page
  public idApp: number = 1;
  public tests: Test[] = [];
  public couleurDominant: string = "";


  constructor(private service: SuperviseurService) { }

  ngOnInit(): void {
    this.getDataUser();
  }
  openModal(id: number) {
    this.display = true;
    this.getInfoUser(id);
  }
  closeModal() {
    this.display = false;
  }
  getDataUser() {
    this.service.url = environment.apiBaseUrl + "my-users";
    this.service.all().subscribe(resp => {
      //console.log(resp);
      this.apprenants = resp.data.users
      this.isLoading = false; // Données chargées, on masque le spinner
    })
  }
  get filteredApprenant() {
    return this.apprenants.filter(appreant =>
      appreant.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  getInfoUser(id: number) {
    this.service.url = `${environment.apiBaseUrl}couleur-des-users/${id}`;
    this.service.all().subscribe(resp => {
      this.tests = resp.data.tests;
    })
  }

  getColorStyle(color: string): string {
    switch (color.toLowerCase()) {
      case 'bleu': return '#0000FF';
      case 'rouge': return '#FF0000';
      case 'vert': return '#008000';
      case 'jaune': return '#DACF0A';
      default: return '#FFFFFF';
    }
  }
  // Fonction pour générer le PDF avec la liste des utilisateurs
  generatePDF() {
    const doc = new jsPDF();
    // Titre du document PDF
    doc.setFontSize(16);
    doc.text('Liste des Participants', 10, 10);

    // Créer un tableau avec les données des utilisateurs
    const userHeaders = [['ID', 'Nom', 'Email',]];
    const userData = this.apprenants.map((user, index) => [
      index + 1,       // L'ID sera l'index + 1 pour commencer à 1
      user.name,       // Nom de l'utilisateur
      user.email,      // Email de l'utilisateur
    ]);

    // Utilisation de autoTable pour insérer le tableau des utilisateurs
    autoTable(doc, {
      head: userHeaders,
      body: userData,
      startY: 30,  // Position du tableau (à ajuster selon votre mise en page)
      theme: 'grid', // Style du tableau
    });

    // Sauvegarder le fichier PDF
    doc.save('rapport_utilisateurs.pdf');
  }

}

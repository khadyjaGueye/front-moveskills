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


  async generatePDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const originalPage = this.page; // Sauvegarde de la page actuelle
    const totalPages = Math.ceil(this.apprenants.length / this.itemsPerPage); // Calcul du nombre total de pages

    // Capture l'en-tête de la table
    const headerElement = document.getElementById('tableHeader');
    if (headerElement) {
      const canvas = await html2canvas(headerElement);
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // Largeur de l'image dans le PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calcul de la hauteur pour garder les proportions
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight); // Ajouter l'en-tête au PDF
    }

    // Capture des pages de données
    for (let i = 1; i <= totalPages; i++) {
      this.page = i; // Définit la page actuelle
      await this.capturePage(pdf, i > 1); // Capture la page et ajoute une nouvelle page si ce n'est pas la première
    }

    pdf.save('liste_complete_apprenants.pdf');
    this.page = originalPage; // Restaure la page initiale
  }

  private async capturePage(pdf: jsPDF, addNewPage: boolean) {
    return new Promise<void>((resolve) => {
      setTimeout(() => { // Temps pour recharger les données de la page
        const element = document.getElementById('listToConvert');
        if (element) {
          html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190; // Largeur en mm
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const position = 10;

            if (addNewPage) pdf.addPage(); // Ajoute une nouvelle page dans le PDF si ce n'est pas la première
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            resolve(); // Indique que la capture de la page est terminée
          });
        }
      }, 500); // Délai pour s'assurer que le contenu de la page est rendu
    });
  }

}

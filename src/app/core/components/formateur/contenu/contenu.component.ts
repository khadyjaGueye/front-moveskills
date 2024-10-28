import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contenu } from '../../../../interfaces/model';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contenu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, NgxPaginationModule, RouterLink],
  templateUrl: './contenu.component.html',
  styleUrl: './contenu.component.css'
})
export class ContenuComponent implements OnInit {

  nomParcour = localStorage.getItem('nomParcour');
  nomChap = localStorage.getItem('nomChapitre');
  idParcour = localStorage.getItem('idParcour')
  contenus: Contenu[] = [];
  sanitizedUrl: SafeResourceUrl | undefined; // Propriété pour stocker l'URL sécurisée
  url: string = "https://moovskil.tucamarketing.com/storage/";


  constructor(private service: FormateurService, private sanitizer: DomSanitizer) {

  }
  ngOnInit(): void {
    this.getDataContenu();
  }
  getDataContenu() {
    this.service.url = `${environment.apiBaseUrl}chapitre-contenue/${this.idParcour}`;

    this.service.all().subscribe(resp => {
      this.contenus = resp.data.contenu;
      console.log(this.contenus);

    })
  }
  //displayContenu: number | null = null; // Stocke l'index du contenu cliqué

  // Méthode pour afficher le contenu
  // afficheContenu(index: number): void {
  //   // Si le contenu est déjà ouvert, le refermer ; sinon, ouvrir le nouveau contenu
  //   this.displayContenu = this.displayContenu === index ? null : index;
  // }
  displayContenu = false;
  contenuAffiche: string = '';

  // Méthode pour afficher le contenu lorsqu'on clique sur un élément
  afficheContenu(filePath: string, type: string): void {
    this.contenuAffiche = filePath; // Stocke le fichier cliqué
    this.displayContenu = true;     // Active l'affichage du contenu
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url + filePath); // "Sanitize" l'URL
  }

  // Méthode pour extraire l'extension du fichier
  getExtension(filePath: string | undefined): string {
    if (!filePath) {
      return ''; // Si filePath est undefined, on renvoie une chaîne vide
    }
    const ext = filePath.split('.').pop();
    return ext ? ext.toLowerCase() : ''; // Si l'extension existe, on la renvoie en minuscule
  }
  // Méthode pour obtenir le lien vers Google Docs Viewer pour les fichiers .docx
  getGoogleDocsViewer(filePath: string): string {
    return `https://docs.google.com/viewer?url=${this.url + filePath}&embedded=true`;
  }
  // Ferme la modale
  closeContenu(): void {
    this.displayContenu = false;
  }

}

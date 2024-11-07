import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chapitre, Contenu, FormDataT } from '../../../../interfaces/model';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

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
  chapitres: Chapitre[] = [];
  message: string = "";
  libelle: string = "";
  nom_chapitre: string = "";
  selectedChapitreId: number = 1;
  sanitizedUrl: SafeResourceUrl | undefined; // Propriété pour stocker l'URL sécurisée
  url: string = "https://moovskil.tucamarketing.com/storage/";
  displayVideo: boolean = false;
  selectedFiles: { url: any; name: string; type: string, rawFile: any }[] = []; // Contient les fichiers sélectionnés
  formData: FormDataT = {
    info: {
      nom_parcour: '',
      objectif: '',
      status_type: 1,
      status_audiance: 1,
      duree: 0,
      competences: [], // Modifié pour stocker les compétences sélectionnées
      status_disponibilite: 20,
      prix: 0
    },
    content: {
      video: [],
      document: [],
    },
    summary: {
      confirmation: false
    },
    libelle: "",
    chapitre_id: 1,
  };

  constructor(private service: FormateurService, private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.getDataContenu();
    this.getDataChapitre();
  }

  getDataContenu() {
    this.service.url = `${environment.apiBaseUrl}chapitre-contenue/${this.idParcour}`;
    this.service.all().subscribe({
      next: (resp) => {
        this.contenus = resp.data.contenu;
        const messageFromBackend = resp.data.message;
        //  Swal.fire('Succès', messageFromBackend, 'success');  // Utiliser le message du backend
        // console.log(resp);
      }, error: (error) => {
        // Gestion des erreurs et affichage du message d'erreur provenant du backend
        const errorMessage = error.error.data?.message || 'Échec.';
        // Swal.fire('Erreur', errorMessage, 'error');
      }
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
  openModalVideo() {
    this.displayVideo = true;
  }
  closeModalVideo() {
    this.displayVideo = false;
  }

  submitVideo() {
    this.service.url = environment.apiBaseUrl + "ajouter-video";
    const videoFiles = this.selectedFiles.filter(file => file.type.startsWith('video/'));

    const videoFormData = new FormData();
    // Ajout du libellé au FormData
    videoFormData.append('libelle', this.libelle);
    // Ajout de l'ID du chapitre au FormData
    videoFormData.append('chapitre_id', this.selectedChapitreId.toString());
    console.log(videoFormData);
    // Ajout des fichiers vidéos au FormData
    videoFiles.forEach(video => {
      videoFormData.append('video[]', video.rawFile);
    });

    // if (this.idParcour && this.selectedChapitreId) {
    //   // Ajout de l'ID du parcours
    //   videoFormData.append('parcour_id', this.idParcour.toString());
    //   // Envoi des vidéos via le service
    //   this.service.store(videoFormData).subscribe({
    //     next: (response) => {
    //       const messageFromBackend = response.data.message;
    //       Swal.fire('Succès', messageFromBackend, 'success');
    //       this.selectedFiles = this.selectedFiles.filter(file => !file.type.startsWith('video/'));
    //     },
    //     error: (error) => {
    //       const errorMessage = error.error.data?.message || 'Échec de l\'envoi des vidéos.';
    //       Swal.fire('Erreur', errorMessage, 'error');
    //     }
    //   });
    // }
  }


  // Sélection des fichiers
  onFilesSelected(event: any, type: string) {
    const files = event.target.files;
    for (const file of files) {
      const fileUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.selectedFiles.push({
        name: file.name,
        url: fileUrl,
        type: file.type,
        rawFile: file
      });
    }
    console.log("Fichiers sélectionnés :", this.selectedFiles);
  }

  getDataChapitre() {
    this.service.url = `${environment.apiBaseUrl}chapitre-by-parcour/${this.idParcour}`;
    this.service.all().subscribe({
      next: (rep) => {
        this.chapitres = rep.data.chapitres;
      }
    })
  }


}

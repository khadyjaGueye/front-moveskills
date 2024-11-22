import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Chapitre, ContentItem, Contenu, Data } from '../../../../interfaces/model';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  url: string = "https://moovskil.tucamarketing.com/storage/"

  videos: ContentItem[] = [];
  idParcour?: number
  documents: ContentItem[] = [];
  chapitres: Chapitre[] = [];
  contenus: Contenu[] = [];
  role: string = "";
  userId!: number;
  nom!: string;
  prenom!: string;
  email!: string;
  storedId = localStorage.getItem('idParcour');
  nomChap: string | null = null;
  nomParcour: string | null = null;
  selectedChapitre: any = null;
  contenuAffiche: any = null;

  constructor(private sanitizer: DomSanitizer, private appService: ApprenantService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.getVideoData();
    this.getDataDocument();
    this.getDataChapitre();
    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');
    this.nomChap = localStorage.getItem('nomChapitre');
    this.nomParcour = localStorage.getItem('nomParcour');
    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.userId = user.id;
      this.nom = user.name;
      this.prenom = user.prenom;
      this.email = user.email;
      this.role = user.role;
      this
    } else {
      // Gérer le cas où pas d'utilisateur authentifié
    }
  }

  // Afficher un contenu (vidéo ou document)
  afficherContenu(contenu: any) {
    this.contenuAffiche = contenu;
  }

  // Déterminer si le fichier est une vidéo ou un document
  estVideo(filePath: string): boolean {
    const extensionsVideo = ['mp4', 'avi', 'mov'];
    const extension = filePath.split('.').pop()?.toLowerCase();
    return extensionsVideo.includes(extension || '');
  }

  // Retourne une URL sécurisée
  getSafeUrl(filePath: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url + filePath);
  }

  getDataDocument() {
    if (this.storedId) {
      this.idParcour = parseInt(this.storedId, 10);
      this.appService.url = `${environment.apiBaseUrl}document-by-id/${this.idParcour}`;
      this.appService.all().subscribe({
        next: (resp: { data: Data }) => {
          this.documents = resp.data.documents
        }
      })
    }
  }

  getDataChapitre() {
    if (this.storedId) {
      this.idParcour = parseInt(this.storedId, 10);
      this.appService.url = `${environment.apiBaseUrl}chapitre-by-parcour/${this.idParcour}`;
      this.appService.all().subscribe({
        next: (rep) => {
          this.chapitres = rep.data.chapitres;
        }, error: (error) => {
          console.log('Error');
        }
      })
    }
  }

  displayContenu(chapitreId: number) {
    this.selectedChapitre = this.chapitres.find(chap => chap.id === chapitreId);
    this.getDataContenu(chapitreId)
  }
  closeModal() {
    this.selectedChapitre = null;
  }

  getDataContenu(idChapitre: number) {
    this.appService.url = `${environment.apiBaseUrl}chapitre-contenue/${idChapitre}`;
    this.appService.all().subscribe({
      next: (rep) => {
        this.contenus = rep.data.contenu;
        console.log(this.contenus);
      }, error: (error) => {
        this.appService.handleResponse(error);
      }
    })
  }

  isVideo(filePath: string): boolean {
    return filePath.endsWith('.mp4');
  }

  isDocument(filePath: string): boolean {
    return filePath.endsWith('.pdf');
  }
  getVideoData() {
    if (this.storedId) {
      this.idParcour = parseInt(this.storedId, 10);
      this.appService.url = `${environment.apiBaseUrl}parcour-by-id/${this.idParcour}`;
      this.appService.all().subscribe({
        next: (response: { data: Data }) => {
          const parcour = response.data.parcour;
          this.videos = response.data.videos;
          this.idParcour = parcour.id;
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des données du parcours : ", err);
          return null; // Gestion des erreurs
        }
      });
    }
  }

   // getVideoDocument() {
  //   //Récupérer les contenus (vidéos et documents) depuis l'API
  //   this.service.getContenus().subscribe(
  //     (data: ContentItem[]) => {
  //       // Séparer les vidéos et les documents en fonction de leur type
  //       this.videos1 = data.filter(item => item.type === 'video');
  //       this.documents1 = data.filter(item => item.type === 'document');
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la récupération des contenus:', error);
  //     }
  //   );
  // }

  // getVideo(idParcour: number) {
  //   this.appService.url = `${environment.apiBaseUrl}parcour-by-id/${idParcour}`;
  //   // Effectuer la requête GET pour récupérer les vidéos
  //   this.service.getContenus().subscribe({
  //     next: (response: any) => {
  //       // Si la réponse contient les vidéos, les assigner à videosI
  //       this.videos1 = response.data.videos; // Ajuste la propriété 'data.videos' selon la structure de ta réponse
  //       console.log("Vidéos récupérées avec succès : ", this.videos1);
  //     },
  //     error: (err) => {
  //       console.error("Erreur lors de la récupération des vidéos : ", err);
  //     }
  //   });
  // }
}



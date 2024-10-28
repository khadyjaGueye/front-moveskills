import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentItem, Data } from '../../../../interfaces/model';
import { AppService } from '../service/app.service';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  url: string = "https://moovskil.tucamarketing.com/storage/"

  //url:string = environment.apiUrlpathvideos;
  // videos = [
  //   { name: 'Introduction à Angular', url: 'assets/videos/angular-intro.mp4' },
  //   { name: 'Tutoriel TypeScript', url: 'assets/videos/typescript-tutorial.mp4' },
  //   { name: 'Programmation en JavaScript', url: 'assets/videos/javascript.mp4' }
  // ];
  // documents = [
  //   { name: 'Cours de JavaScript', url: 'assets/documents/js-course.pdf', type: 'PDF' },
  //   { name: 'Tutoriel Angular', url: 'assets/documents/angular-guide.docx', type: 'Word' },
  //   { name: 'Référence TypeScript', url: 'assets/documents/typescript-reference.pdf', type: 'PDF' }
  // ];
  externalLinks = [
    { name: 'Documentation Angular', url: 'https://angular.io/docs' },
    { name: 'Documentation TypeScript', url: 'https://www.typescriptlang.org/docs/' }
  ];

  videos: ContentItem[] = [];
  idParcour?: number
  documents: ContentItem[] = [];
  role: string = "";
  userId!: number;
  nom!: string;
  prenom!: string;
  email!: string;
   storedId = localStorage.getItem('idParcour');

  constructor(private service: AppService, private appService: ApprenantService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Récupère l'ID du parcours à partir d'un service
    const idParcour = this.appService.getSelectedParcourId();
    this.getVideoData();
    this.getDataDocument();
    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');
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

  getVideoData() {
    if (this.storedId) {
      this.idParcour = parseInt(this.storedId, 10);
      this.appService.url = `${environment.apiBaseUrl}parcour-by-id/${this.idParcour}`;
      this.appService.all().subscribe({
        next: (response: { data: Data }) => {
          const parcour = response.data.parcour;
          this.videos = response.data.videos;
          this.idParcour = parcour.id;
          console.log("ID du parcours:", parcour.id);
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des données du parcours : ", err);
          return null; // Gestion des erreurs
        }
      });
    }

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



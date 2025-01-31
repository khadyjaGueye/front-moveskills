import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../service/apprenant.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Chapitre, Contenu, Parcour, ParcourAcheter } from '../../../../interfaces/model';
import { environment } from '../../../../../environments/environment.development';
import { SharedModule } from '../../../../shared/shared.module';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-parcour-acheter',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './parcour-acheter.component.html',
  styleUrl: './parcour-acheter.component.css'
})
export class ParcourAcheterComponent implements OnInit {

  parcourName: string | null = null; // Variable pour stocker le nom du parcours
  parcours: ParcourAcheter[] = [];
  chapitres: Chapitre[] = [];
  contenus: Contenu[] = [];
  displayListChapitre: boolean = false;
  contenu: boolean = false;
  userId!: number;
  selectedChapitre: any = null;
  contenuAffiche: any = null;
  apiUrlpathvideos = environment.apiUrlpathvideos;
  apiUrlpathdocuments = environment.apiUrlpathdocuments;
  safeUrl: SafeResourceUrl | null = null;
  isLoading:boolean = false;

  constructor(private service: ApprenantService, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // Récupérer le paramètre 'parcour_name' de l'URL
    this.parcourName = this.route.snapshot.queryParamMap.get('parcour_name');
    //console.log('Nom du parcours :', this.parcourName);
    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');
    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.userId = user.id;
    }



    this.getDataParcourAcheter();
  }

  closeModalChapitre() {
    this.displayListChapitre = false;
  }

  openListChapitre(parcour_id: number) {
    this.displayListChapitre = true;
    this.getDataChapitre(parcour_id);
  }

  isVideo(filePath: string): boolean {
    const videoExtensions = ['mp4', 'avi', 'mov'];
    const extension = filePath.split('.').pop()?.toLowerCase();
    return videoExtensions.includes(extension || '');
  }

  closeModalContenuChapitre() {
    this.contenu = false
    if (this.selectedChapitre == null) {
      // Logic to close the modal
      const modal = document.getElementById('modalId'); // Remplacez 'modalId' par l'ID réel de votre modal
      console.log(modal);
      if (modal) {
        modal.classList.add('hidden'); // Exemple pour cacher le modal
      }
    }
  }

  getDataContenu(idChapitre: number) {
    this.service.url = `${environment.apiBaseUrl}chapitre-contenue/${idChapitre}`;
    this.service.all().subscribe({
      next: (rep) => {
        this.contenus = rep.data.contenu;
        // console.log(this.contenus);
      }, error: (error) => {
        this.service.handleResponse(error);
      }
    })
  }

  displayContenu(chapitreId: number) {
    this.selectedChapitre = this.chapitres.find(chap => chap.id === chapitreId);
    this.getDataContenu(chapitreId);
    this.contenu = true
  }


  getDataChapitre(parcour_id: number) {
    this.service.url = `${environment.apiBaseUrl}chapitre-by-parcour/${parcour_id}`;
    this.service.all().subscribe({
      next: (resp) => {
        this.chapitres = resp.data.chapitres;
        //console.log(this.chapitres);
      }, error: (err) => {

      }
    })
  }

  getDataParcourAcheter() {
    this.isLoading = true;
    this.service.url = `${environment.apiBaseUrl}user/parcour/${this.userId}`;
    this.service.all().subscribe({
      next: (resp) => {
        this.parcours = resp.data.parcoursAcheter
     //  console.log(this.parcours);
        this.isLoading = false
      }, error: (err) => {

      }
    })
  }

  marquerCommeVu(contenuId: number, contenu: Contenu): void {
    // this.service.url = environment.apiBaseUrl + "mark-chapter-completed";
    // this.service.update(contenu, contenuId).subscribe({
    //   next: (response) => {
    //     console.log('Statut mis à jour avec succès :', response);
    //     this.service.handleResponse(response)
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors de la mise à jour du statut :', error);
    //     this.service.handleResponse(error);
    //   },
    // });
  }


  // Afficher un contenu (vidéo ou document)
  afficherContenu(contenu: any): void {
    const fullPath = this.isVideo(contenu.file_path)
      ? `${this.apiUrlpathvideos}${contenu.file_path}`
      : `${this.apiUrlpathdocuments}${contenu.file_path}`;

    this.contenuAffiche = {
      ...contenu,
      file_path: fullPath,
      is_watched: true,
    };

    // Sécuriser l'URL
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullPath);
    console.log(this.safeUrl);
  }




  fermerContenu(): void {
    this.contenuAffiche = null;
  }

}

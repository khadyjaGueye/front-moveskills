import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Chapitre, ContentItem, Contenu, Parcour } from '../../../../interfaces/model';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-parcours',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, NgxPaginationModule, SharedModule],
  templateUrl: './parcours.component.html',
  styleUrl: './parcours.component.css'
})
export class ParcoursComponent implements OnInit {

  parcours: Parcour[] = [];
  chapitres: Chapitre[] = [];
  videos: ContentItem[] = [];
  contenus: Contenu[] = [];
  display: boolean = false;
  dispalyChap: boolean = false;
  isLoading: boolean = true;
  numberOfVideos: number = 0;
  idParcour: number = 1;
  public page: number = 1;
  public itemsPerPage: number = 4; // Nombre d'éléments par page
  public searchTerm: string = ''; // Variable pour stocker la valeur de la recherche
  currentStep: number = 1;
  nomParcour: string | null = null;
  // Dans votre composant
  selectedParcour: Parcour | null = null
  selectedChapitre: any = null;
  contenuAffiche: any = null;
  redirect_url: string = "";
  contenu:boolean = false

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {

    this.getDataParcours();
    this.loadVideos();
    this.nomParcour = localStorage.getItem('nomParcour');
  }

  getDataParcours() {
    this.isLoading = true
    this.service.url = environment.apiBaseUrl + "parcours/status/approved";
    return this.service.all().subscribe(resp => {
      this.parcours = resp.data.parcours;
     // console.log(this.parcours);

     this.isLoading = false; // Données chargées, on masque le spinner
    })
  }
  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  openModalParcour(id: number): void {
    this.display = true;
    this.selectedParcour = this.filteredParcours.find(p => p.id === id) ?? null;
    if (this.selectedParcour) {
      //console.log(this.selectedParcour);
      localStorage.setItem('idParcour', id.toString());
      this.getDataChapitre();
    }
  }

  openModalChapitre() {
    this.dispalyChap = true;
  }
  closeModal() {
    this.dispalyChap = false;
  }

  displayContenu(chapitreId: number) {
    this.selectedChapitre = this.chapitres.find(chap => chap.id === chapitreId);
    this.getDataContenu(chapitreId);
    this.contenu = true
  }

  getDataContenu(idChapitre: number) {
    this.service.url = `${environment.apiBaseUrl}chapitre-contenue/${idChapitre}`;
    this.service.all().subscribe({
      next: (rep) => {
        this.contenus = rep.data.contenu;
        console.log(this.contenus);
      }, error: (error) => {
        this.service.handleResponse(error);
      }
    })
  }
  isVideo(filePath: string): boolean {
    return filePath.endsWith('.mp4');
  }

  // Afficher un contenu (vidéo ou document)
  afficherContenu(contenu: any) {
    this.contenuAffiche = contenu;
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


  closeModalParcour(): void {
    this.display = false;
  }

  loadVideos() {
    // this.service.url = environment.apiBaseUrl + " "
    // this.service.all().subscribe(response => {
    //   // Vérifier si l'API renvoie bien des vidéos et compter leur nombre
    //   if (response && response.data && response.data.videos) {
    //     this.numberOfVideos = response.data.videos.length;
    //   }
    // }, (error) => {
    //   console.error('Erreur lors de la récupération des vidéos:', error);
    // }
    // )
  }

  get filteredParcours() {
    return this.parcours.filter(parcour =>
      parcour.nom_parcour.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getDataChapitre() {
    this.service.url = `${environment.apiBaseUrl}chapitre-by-parcour/${this.selectedParcour?.id}`;
    this.service.all().subscribe({
      next: (resp) => {
        this.chapitres = resp.data.chapitres;
        //console.log(this.chapitres);

      }, error: (err) => {

      }
    })
  }

  acheterParcour() {
    this.service.url = environment.apiBaseUrl + "payment";

    if (!this.selectedParcour?.id) {
      console.error("ID manquant");
      return;
    }

    // Créer une instance de FormData
    const formData = new FormData();
    formData.append("parcour_id", this.selectedParcour.id.toString());

    // Envoyer les données au backend
    this.service.store(formData).subscribe({
      next: (response: any) => {
        if (response?.status === "success" && response?.redirect_url) {
          console.log("Redirection vers :", response.redirect_url);
          // Rediriger l'utilisateur vers l'URL de paiement
          window.location.href = response.redirect_url;
        } else {
          console.error("Réponse invalide ou URL de redirection manquante :", response);
        }
      },
      error: (err) => {
        console.error("Erreur lors de l'envoi :", err);
        this.service.handleResponse(err);
      }
    });
  }
  elementsAffiches:number = 4; // Par défaut, afficher 4 éléments

 // Fonction pour afficher plus d'éléments
 voirPlus() {
  this.elementsAffiches += 4; // Augmenter de 4 éléments
}
}

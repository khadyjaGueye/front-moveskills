import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chapitre, Contenu, FormDataT, FormDataVideo, Parcour } from '../../../../interfaces/model';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contenu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule,],
  templateUrl: './contenu.component.html',
  styleUrl: './contenu.component.css'
})
export class ContenuComponent implements OnInit {

  nomParcour = localStorage.getItem('nomParcour');
  nomChap = localStorage.getItem('nomChapitre');
  idParcour: number = 0; // ID du parcours sélectionné
  contenus: Contenu[] = [];
  chapitres: Chapitre[] = [];
  parcours: Parcour[] = [];
  message: string = "";
  libelle: string = "";
  nom_chapitre: string = "";
  selectedChapitreId: number = 1;
  sanitizedUrl: SafeResourceUrl | undefined; // Propriété pour stocker l'URL sécurisée
  url: string = "https://moovskil.tucamarketing.com/storage/";
  displayVideo: boolean = false;
  // État pour savoir si le formulaire vidéo est visible
  isVideoFormVisible: boolean = false;
  // État pour savoir si le formulaire document est visible
  isDocumentFormVisible: boolean = false;
  isFormVisible: boolean = false;  // Pour contrôler l'affichage des boutons
  selectedFiles: { url: any; name: string; type: string, rawFile: any }[] = []; // Contient les fichiers sélectionnés
  formData: FormDataVideo = {
    content: {
      videos: [],
      documents: [],
    },
    libelle: "",
    chapitre_id: 1,

  };
  videoForm: FormGroup;
  documentForm: FormGroup;

  constructor(private service: FormateurService, private sanitizer: DomSanitizer, private fb: FormBuilder) {
    this.videoForm = this.fb.group({
      idParcour: ['', Validators.required],
      chapitre_id: ['', Validators.required],
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      videos: ['', Validators.required] // Pour gérer les fichiers
    });
    this.documentForm = this.fb.group({
      idParcour: ['', Validators.required],
      chapitre_id: ['', Validators.required],
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      documents: ['', Validators.required] // Pour gérer les fichiers
    })
  }

  ngOnInit(): void {
    this.getParcours();
  }

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

  getDataChapitre() {
    this.service.url = `${environment.apiBaseUrl}chapitre-by-parcour/${this.idParcour}`;
    this.service.all().subscribe({
      next: (rep) => {
        this.chapitres = rep.data.chapitres;
      }
    })
  }

  toggleForm(type: string) {
    this.isFormVisible = true;  // Masque les boutons
    if (type === 'video') {
      this.isVideoFormVisible = true;
      this.isDocumentFormVisible = false;  // Cache le formulaire Document
    } else if (type === 'document') {
      this.isDocumentFormVisible = true;
      this.isVideoFormVisible = false;  // Cache le formulaire Vidéo
    }
  }

  getParcours() {
    this.service.url = environment.apiBaseUrl + "parcours";
    this.service.all().subscribe(resp => {
      this.parcours = resp.data.parcours;
      //this.isLoading = false; // Données chargées, on masque le spinner
      //console.log(this.parcours);
    })
  }

  // Méthode pour charger les chapitres du parcours sélectionné
  loadChapitres(id: number) {
    this.idParcour = id;
    this.getDataChapitre(); // Charger les chapitres après avoir sélectionné un parcours
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
    //console.log("Fichiers sélectionnés :", this.selectedFiles);
  }


  submitVideo() {
    this.service.url = environment.apiBaseUrl + "ajouter-video";
    if (this.videoForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }
    const formValue = this.videoForm.value;
    const videoFormData = new FormData();

    // Ajouter les vidéos sélectionnées
    this.selectedFiles
      .filter(file => file.type.startsWith('video/'))
      .forEach(video => videoFormData.append('videos[]', video.rawFile));
    console.log(this.selectedFiles);

    // Ajouter les autres données
    videoFormData.append('libelle', formValue.libelle);
    videoFormData.append('chapitre_id', formValue.chapitre_id);

    console.log('Données envoyées:', formValue);

    // Appeler le service pour envoyer les données
    // Appeler le service pour envoyer les données
    this.service.store(videoFormData).subscribe({
      next: (response) => {
        console.log('Vidéo envoyée avec succès!', response);
        // Afficher un message de succès
        this.service.handleResponse(response)

        // Réinitialiser le formulaire et les fichiers sélectionnés
        this.videoForm.reset();
        this.selectedFiles = [];
        this.isVideoFormVisible = false;
        this.isFormVisible = true;
      },
      error: (error) => {
        // Afficher un message d'erreur
        this.service.handleResponse(error);
      }
    });
  }

  submitDocument() {
    this.service.url = environment.apiBaseUrl + "ajouter-document";

    if (this.documentForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    const documentFiles = this.selectedFiles.filter(file =>
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    const formValue = this.documentForm.value;
    const documentFormData = new FormData();

    // Ajouter les fichiers documents au FormData
    documentFiles.forEach(document => {
      documentFormData.append('documents[]', document.rawFile); // Utiliser "documents[]" pour un tableau de fichiers
    });

    // Ajouter les autres données
    documentFormData.append('libelle', formValue.libelle);
    documentFormData.append('chapitre_id', formValue.chapitre_id);

    // Envoi des documents via le service
    this.service.store(documentFormData).subscribe({
      next: (response) => {
        // Afficher le message de succès renvoyé par le backend
        const messageFromBackend = response.data.message;
        Swal.fire('Succès', messageFromBackend, 'success'); // Alerte de succès
        this.selectedFiles = this.selectedFiles.filter(file => !(
          file.type === 'application/pdf' ||
          file.type === 'application/msword' ||
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ));
        this.documentForm.reset();
        this.isDocumentFormVisible = false;
        this.isFormVisible = true;
      },
      error: (error) => {
        // Gérer et afficher le message d'erreur renvoyé par le backend
        const errorMessage = error.error.message || 'Échec de l\'envoi des documents.';
        Swal.fire('Erreur', errorMessage, 'error');
      }
    });
  }
}

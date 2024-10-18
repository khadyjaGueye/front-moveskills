import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDataT, Parcour, Skill, VideoFile } from '../../../../interfaces/model';
import { DomSanitizer } from '@angular/platform-browser';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-parcour',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-parcour.component.html',
  styleUrl: './list-parcour.component.css'
})
export class ListParcourComponent implements OnInit {

  selectedSkills: Skill[] = [];// Liste des compétences sélectionnées
  parcours: Parcour[] = [];
  selectedButton: string = '';
  openModal: boolean = false; // Contrôle de la première modal
  showSecondModal: boolean = false; // Contrôle de la deuxième modal
  currentStep: number = 1; // Étape courante du formulaire
  fileType: string | null = null; // Contient le type de fichier sélectionné
  selectedFiles: { url: any; name: string; type: string, rawFile: any }[] = []; // Contient les fichiers sélectionnés
  savedData: any = {}; // Objet pour stocker les données à chaque étape
  displayVideo: boolean = false;
  displayDocument: boolean = false;

  tab: number = 0;
  // Liste des compétences disponibles
  skills: Skill[] = [
    { id: 1, name: 'Développement Web' },
    { id: 2, name: 'Analyse de données' },
    { id: 3, name: 'Design UX/UI' },
    { id: 4, name: 'Management' },
    { id: 5, name: 'Gestion de projet' },
    { id: 6, name: 'Leadership' },
  ];
  formData: FormDataT = {
    info: {
      nom_parcour: '',
      objectif: '',
      status_type: 1,
      status_audiance: 1,
      duree: 0,
      competences: [], // Modifié pour stocker les compétences sélectionnées
      status_disponibilite: 20
    },
    content: {
      video: [],
      document: [],
    },
    summary: {
      confirmation: false
    }
  };
  selectedVideos: File[] = []; // Tableau pour stocker les vidéos
  selectedDocuments: File[] = []; // Tableau pour stocker l
  idParcour: number = 1; // Variable pour stocker l'ID du parcours créé
  constructor(private service: FormateurService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getParcours()
  }

  // Sélectionner une compétence
  selectSkill(skill: Skill) {
    if (!this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
    }
  }

  // Retirer une compétence
  removeSkill(skill: Skill) {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  }
  index() {
    //this.service.url = environment.apiBaseUrl + '';
  }
  openModalParcour() {
    this.openModal = true;
    this.savedData = "";
  }
  closeModal() {
    this.openModal = false;
  }
  // Méthode pour fermer toutes les modals
  closeModals() {
    this.currentStep = 1; // Fermer toutes les modals
    this.selectedFiles = []; // Réinitialiser les fichiers sélectionnés
    this.openModal = false
  }

  removeSkillTab(index: number) {
    this.selectedSkills.splice(index, 1);
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  // Méthode pour revenir à l'étape précédente
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onButtonClick(buttonValue: string) {
    this.selectedButton = buttonValue;
  }
  // Sélection des fichiers
  onFilesSelected(event: any, type: string) {
    const files = event.target.files;
    console.log(files);

    for (const file of files) {
      const fileUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.selectedFiles.push({
        name: file.name,
        url: fileUrl,
        type: file.type,
        rawFile: file
      });
    }
  }

  submitParcours() {
    this.service.url = environment.apiBaseUrl + "parcours";

    this.savedData = {
      nom_parcour: this.formData.info.nom_parcour,
      prix: 1000, // Exemple d'ajustement pour le prix si applicable
      duree: this.formData.info.duree,
      status_type: 1, // Supposons que 'Gratuit' = 0 et 'Premium' = 1
      status_audiance: 1,
      status_disponibilite: 20, // Valeur d'exemple, ajustez selon vos besoins
      competences: this.selectedSkills.map(skill => skill.id)
    };
    console.log(this.savedData);

    // Appeler le service pour envoyer les données
    this.service.store(this.savedData).subscribe({
      next: (response) => {
        // Si le backend renvoie un message de succès
        if (response.data && response.data.message) {
          Swal.fire('Succès', response.data.message, 'success');
        } else {
          Swal.fire('Succès', 'Le parcours a été créé avec succès!', 'success');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la création du parcours', error);

        // Gestion des erreurs du backend
        if (error.statusCode === 422) {
          Swal.fire('Erreur de validation', error.error.message || 'Des erreurs de validation sont survenues.', 'error');
        } else if (error.statusCode === 500) {
          Swal.fire('Erreur serveur', error.error.message || 'Une erreur interne est survenue.', 'error');
        } else {
          Swal.fire('Erreur', 'Échec de la création du parcours.', 'error');
        }
      }
    });
  }


  // Méthode pour ouvrire  le modal pour enregistres des videos

  openModalVideo(idParcour: number) {
    this.displayVideo = true
  }
  closeModalVideo() {
    this.displayVideo = false;
  }

  openModalDocument(idParcour: number) {
    this.displayDocument = true;
  }
  closeModalDocument() {
    this.displayDocument = false;
  }

  submitForm() {
    // Appel au service pour envoyer toutes les données
    this.service.store(this.savedData).subscribe(response => {
      console.log('Parcours créé avec succès', response);
    }, error => {
      console.error('Erreur lors de la création du parcours', error);
    });
  }
  toggleSkill(skill: string) {
    const index = this.formData.info.competences.indexOf(skill);
    if (index > -1) {
      // Si la compétence est déjà sélectionnée, la retirer
      this.formData.info.competences.splice(index, 1);
    } else {
      // Sinon, ajouter la compétence
      this.formData.info.competences.push(skill);
    }
  }

  videoFile: File | null = null; // Variable pour stocker le fichier vidéo

  // Méthode pour capturer le fichier vidéo sélectionné
  onVideoSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.videoFile = event.target.files[0]; // Stocker le fichier vidéo
    }
  }

  submitVideo() {
    this.service.url = environment.apiBaseUrl + "ajouter-video";

    const videoFiles = this.selectedFiles.filter(file => file.type.startsWith('video/'));
    const videoFormData = new FormData();

    // Ajout des fichiers vidéos au FormData
    videoFiles.forEach(video => {
      videoFormData.append('videos[]', video.rawFile); // Utiliser "videos[]" pour un tableau de fichiers
    });

    // Ajout de l'ID du parcours
    videoFormData.append('parcour_id', this.idParcour.toString());

    // Envoi des vidéos via le service
    this.service.store(videoFormData).subscribe({
      next: (response) => {
        // Affichage du message du backend
        const messageFromBackend = response.data.message;
        Swal.fire('Succès', messageFromBackend, 'success');  // Utiliser le message du backend
        this.selectedFiles = this.selectedFiles.filter(file => !file.type.startsWith('video/'));
      },
      error: (error) => {
        // Gestion des erreurs et affichage du message d'erreur provenant du backend
        const errorMessage = error.error.data?.message || 'Échec de l\'envoi des vidéos.';
        Swal.fire('Erreur', errorMessage, 'error');
      }
    });
  }

  submitDocuments() {
    this.service.url = environment.apiBaseUrl + "ajouter-document";
    const documentFiles = this.selectedFiles.filter(file =>
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    const documentFormData = new FormData();

    // Ajouter les fichiers documents au FormData
    documentFiles.forEach(document => {
      documentFormData.append('documents[]', document.rawFile); // Utiliser "documents[]" pour un tableau de fichiers
    });

    // Ajouter l'ID du parcours au FormData
    documentFormData.append('parcour_id', this.idParcour.toString());

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
      },
      error: (error) => {
        // Gérer et afficher le message d'erreur renvoyé par le backend
        const errorMessage = error.error.message || 'Échec de l\'envoi des documents.';
        Swal.fire('Erreur', errorMessage, 'error');
      }
    });
  }


  getParcours() {
    this.service.url = environment.apiBaseUrl + "parcours";
    this.service.all().subscribe(resp => {
      this.parcours = resp.data.parcours
     // console.log(this.parcours);
    })
  }

}

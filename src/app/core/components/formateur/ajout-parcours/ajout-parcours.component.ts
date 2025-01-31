import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Aptitude, FormDataT, Profil } from '../../../../interfaces/model';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ajout-parcours',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ajout-parcours.component.html',
  styleUrl: './ajout-parcours.component.css'
})
export class AjoutParcoursComponent implements OnInit {

  formDataChap: FormGroup;
  selectedSkills: Profil[] = []
  skills: Profil[] = [];
  selectedAptitudes: Aptitude[] = [];
  finalAptitudes: Aptitude[] = [];
  aptitudeIds: number[] = [];
  tabObjetAptitude: any[] = []
  savedData: any = {}; // Objet pour stocker les données à chaque étape
  formData: FormDataT = {
    info: {
      nom_parcour: '',
      objectif: '',
      image: '',
      description: '',
      status_type: '',
      status_audiance: '',
      duree: 0,
      competences: ["1", "2"], // Modifié pour stocker les compétences sélectionnées
      profils: [],
      aptitudes: [],
      status_disponibilite: 20,
      prix: 0
    },
    content: {
      videos: [],
      documents: [],
    },
    summary: {
      confirmation: false
    }, libelle: "",
    chapitre_id: 1,
  };

  groupSize = 3; // Nombre d'éléments par groupe
  Math: any;

  constructor(private fb: FormBuilder, private service: FormateurService) {
    this.formDataChap = fb.group({
      nom_chapitre: [''],
      image: [''],
      prix: [''],
      duree: [''],
      status_type: [''],
      status_audiance: [''],
      status_disponibilite: [''],
      competences: [''],
    })
  }
  ngOnInit(): void {
    //this.getDataCompetence();
    this.getDataProfils();
  }

  // Supprimer un profil et ses aptitudes
  removeSkill(comp: Profil): void {
    // Supprimer le profil sélectionné
    this.selectedSkills = this.selectedSkills.filter(skill => skill.id !== comp.id);
    console.log(comp);
    this.tabObjetAptitude = this.tabObjetAptitude.filter(a => a.id !== comp.id)

    // Supprimer ses aptitudes associées
    comp.aptitudes.forEach((apt: Aptitude) => {
      this.selectedAptitudes = this.selectedAptitudes.filter(a => a.id !== apt.id);
    });
  }


  getDataCompetence() {
    this.service.url = environment.apiBaseUrl + "competences";
    this.service.all().subscribe({
      next: (resp) => {
        this.skills = resp.data.profils
      }
    })
  }


  onStatusTypeChange(statusType: string) {
    if (statusType === 'gratuit') {
      this.formData.info.status_audiance = 'public';  // Définit automatiquement "Public" si "Gratuit" est sélectionné
    } else if (statusType === 'premium') {
      this.formData.info.status_audiance = 'prive';   // Définit automatiquement "Privé" si "Premium" est sélectionné
    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitParcours() {
    this.service.url = environment.apiBaseUrl + 'parcours';

    if (!this.selectedFile) {
      Swal.fire('Erreur', 'Veuillez sélectionner une image.', 'error');
      return;
    }
    // Récupérer les IDs des profils et aptitudes sélectionnés
    const selectedProfilIds = this.selectedSkills.map(skill => skill.id); // IDs des profils
    const selectedAptitudeIds = this.finalAptitudes.map(apt => apt.id); // IDs des aptitudes
    // Assurez-vous que `this.formData.info.competences` est un tableau d'IDs (nombres)
    const competencesIds = (this.formData.info.competences || []).map((id: string | number) => Number(id));
    this.savedData = {
      nom_parcour: this.formData.info.nom_parcour,
      prix: this.formData.info.prix,
      duree: this.formData.info.duree,
      image: this.selectedFile,
      description: this.formData.info.description,
      status_type: this.formData.info.status_type === 'gratuit' ? '0' : '1',
      status_audiance: this.formData.info.status_audiance === 'public' ? '0' : '1',
      // status_disponibilite: 20, // Valeur d'exemple, ajustez selon vos besoins
      competences: competencesIds,
      profils: selectedProfilIds,
      aptitudes: selectedAptitudeIds,
    }
    //console.log(this.savedData);
    // Envoi des données via le service
    this.service.store(this.savedData).subscribe({
      next: (response) => {
        if (response.data && response.data.message) {
          Swal.fire('Succès', response.data.message, 'success');
        } else {
          Swal.fire('Succès', 'Le parcours a été créé avec succès!', 'success');
        }
        // Réinitialisation des données après succès
        this.selectedFile = null;

      },
      error: (error) => {
        console.log(error);

        if (error.statusCode === 422) {
          Swal.fire('Erreur de validation', error.error.message || 'Des erreurs de validation sont survenues.', 'error');
        } else if (error.statusCode === 500) {
          Swal.fire('Erreur serveur', error.error.message || 'Une erreur interne est survenue.', 'error');
        } else {
          // console.log(error);
          Swal.fire('Erreur', 'Échec de la création du parcours.', 'error');
        }
      },
    });
  }


  getDataProfils() {
    this.service.url = environment.apiBaseUrl + "profils";
    this.service.all().subscribe({
      next: (responses) => {
        this.skills = responses.data.profils;
        //console.log(this.skills);
      }, error: (error) => {
      }
    })
  }

  profil(comp: Profil): void {
    this.selectedAptitudes = comp.aptitudes; // Mettre à jour la liste des aptitudes
   // console.log(this.selectedAptitudes);
    this.aptitudeIds = this.selectedAptitudes.map(aptitude => aptitude.id); // Récupérer les IDs des aptitudes
    //console.log('IDs des aptitudes sélectionnées :', this.aptitudeIds);
  }

  // Ajouter un profil et ses aptitudes sans supprimer les aptitudes précédentes
  addToSelected(comp: Profil): void {
    //  console.log(comp);
    // Vérifier si le profil est déjà sélectionné
    if (!this.selectedSkills.find(skill => skill.id === comp.id)) {
      this.selectedSkills.push(comp);
      // Ajouter les aptitudes de ce profil sans doublons
      comp.aptitudes.forEach((apt: any) => {
        if (!this.selectedAptitudes.find(a => a.id === apt.id)) {
          this.selectedAptitudes.push(apt);
        }
      });

      if (comp) {
        this.tabObjetAptitude.push(comp);
       // console.log(this.tabObjetAptitude);
      }
      // console.log(this.selectedAptitudes);
    }
  }

  // Ajouter une aptitude à la liste finale
  addToFinalAptitudes(apt: Aptitude): void {
    console.log(this.finalAptitudes);
    if (!this.finalAptitudes.find(a => a.id === apt.id)) {
      this.finalAptitudes.push(apt);
      //console.log(apt);
    }
  }

  // Supprimer une aptitude de la liste finale
  removeFromFinalAptitudes(apt: Aptitude): void {
    this.finalAptitudes = this.finalAptitudes.filter(a => a.id !== apt.id);
  }

}

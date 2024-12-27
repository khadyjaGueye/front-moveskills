import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Competence, FormDataT } from '../../../../interfaces/model';
import { image } from 'html2canvas/dist/types/css/types/image';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ajout-parcours',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './ajout-parcours.component.html',
  styleUrl: './ajout-parcours.component.css'
})
export class AjoutParcoursComponent implements OnInit {

  formDataChap: FormGroup;
  selectedSkills: Competence[] = []
  skills: Competence[] = [];
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
      competences: [], // Modifié pour stocker les compétences sélectionnées
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
    this.getDataCompetence();
  }

  // Retirer une compétence
  removeSkill(skill: Competence) {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  }

  getDataCompetence() {
    this.service.url = environment.apiBaseUrl + "competences";
    this.service.all().subscribe({
      next: (resp) => {
        this.skills = resp.data.competences
      }
    })
  }

  // Ajouter une compétence à la liste des compétences sélectionnées
  addToSelected(comp: any) {
    if (!this.selectedSkills.includes(comp)) {
      this.selectedSkills.push(comp);
    }
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
    if (!this.selectedFile) {
      Swal.fire('Erreur', 'Veuillez sélectionner une image.', 'error');
      return;
    }
    // Création de l'objet FormData
    const formData = new FormData();
    formData.append('image', this.selectedFile); // Ajout de l'image
    formData.append('nom_parcour', this.formData.info.nom_parcour || '');
    formData.append('prix', this.formData.info.prix ? this.formData.info.prix.toString() : '0');
    formData.append('duree', this.formData.info.duree ? this.formData.info.duree.toString() : '0');
    formData.append('description', this.formData.info.description || '');
    formData.append('status_type', this.formData.info.status_type === 'gratuit' ? '0' : '1');
    formData.append('status_audiance', this.formData.info.status_audiance === 'public' ? '0' : '1');

    // Ajout des compétences au FormData
    this.selectedSkills.forEach(skill => {
      formData.append('competences[]', skill.id.toString());
    });
    console.log(formData);

    // Envoi des données via le service
    this.service.url = environment.apiBaseUrl + 'parcours';
    this.service.store(formData).subscribe({
      next: (response) => {
        if (response.data && response.data.message) {
          Swal.fire('Succès', response.data.message, 'success');
        } else {
          Swal.fire('Succès', 'Le parcours a été créé avec succès!', 'success');
        }
        //this.formData.reset();
        this.selectedFile = null;
      },
      error: (error) => {
        if (error.statusCode === 422) {
          Swal.fire('Erreur de validation', error.error.message || 'Des erreurs de validation sont survenues.', 'error');
        } else if (error.statusCode === 500) {
          Swal.fire('Erreur serveur', error.error.message || 'Une erreur interne est survenue.', 'error');
        } else {
          Swal.fire('Erreur', 'Échec de la création du parcours.', 'error');
        }
      },
    });
  }


}

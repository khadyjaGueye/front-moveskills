import { Component, OnInit } from '@angular/core';
import { SuperviseurService } from '../services/superviseur.service';
import { CommonModule } from '@angular/common';
import { Test, User } from '../../../../interfaces/model';
import { environment } from '../../../../../environments/environment.development';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';

@Component({
  selector: 'app-list-apprenant',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, ReactiveFormsModule, FormsModule, SharedModule,],
  templateUrl: './list-apprenant.component.html',
  styleUrl: './list-apprenant.component.css'
})
export class ListApprenantComponent implements OnInit {

  apprenants: User[] = [];
  display: boolean = false;
  showModal: boolean = false;
  idApprenant: number = 1;
  isLoading: boolean = true;
  public searchTerm: string = ''; // Variable pour stocker la valeur de la recherche
  public page: number = 1;
  public itemsPerPage: number = 5; // Nombre d'éléments par page
  public idApp: number = 1;
  public tests: Test[] = [];
  public couleurDominant: string = "";
  user_id!: number;
  codeForm: FormGroup;
  data: { name: string; email: string; password: string; code_invitatin: string }[] = []; // Contient les données extraites

  constructor(private service: SuperviseurService, private fb: FormBuilder) {
    this.codeForm = fb.group({
      user_id: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getDataUser();

    // Récupérer l'utilisateur depuis le localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user && user.id) {
          this.user_id = user.id;
        } else {
          console.error('Erreur : utilisateur invalide dans le localStorage.');
        }
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur JSON :', error);
      }
    } else {
      console.error('Aucun utilisateur authentifié trouvé dans le localStorage.');
    }


  }
  openModal(id: number) {
    this.display = true;
    this.getInfoUser(id);
  }

  closeModal() {
    this.display = false;
  }

  openTab() {
    this.showModal = true;
  }

  closeTab() {
    this.showModal = false;
  }


  getDataUser() {
    this.service.url = environment.apiBaseUrl + "my-users";
    this.service.all().subscribe(resp => {
      this.apprenants = resp.data.users

      this.isLoading = false; // Données chargées, on masque le spinner
    })
  }
  get filteredApprenant() {
    return this.apprenants.filter(appreant =>
      appreant.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  getInfoUser(id: number) {
    this.service.url = `${environment.apiBaseUrl}couleur-des-users/${id}`;
    this.service.all().subscribe(resp => {
      this.tests = resp.data.tests;
    })
  }

  getColorStyle(color: string): string {
    switch (color.toLowerCase()) {
      case 'bleu': return '#0000FF';
      case 'rouge': return '#FF0000';
      case 'vert': return '#008000';
      case 'jaune': return '#DACF0A';
      default: return '#FFFFFF';
    }
  }
  // Fonction pour générer le PDF avec la liste des utilisateurs
  generatePDF() {
    const doc = new jsPDF();
    // Titre du document PDF
    doc.setFontSize(16);
    doc.text('Liste des Participants', 10, 10);

    // Créer un tableau avec les données des utilisateurs
    const userHeaders = [['ID', 'Nom', 'Email',]];
    const userData = this.apprenants.map((user, index) => [
      index + 1,       // L'ID sera l'index + 1 pour commencer à 1
      user.name,       // Nom de l'utilisateur
      user.email,      // Email de l'utilisateur
    ]);

    // Utilisation de autoTable pour insérer le tableau des utilisateurs
    autoTable(doc, {
      head: userHeaders,
      body: userData,
      startY: 30,  // Position du tableau (à ajuster selon votre mise en page)
      theme: 'grid', // Style du tableau
    });

    // Sauvegarder le fichier PDF
    doc.save('rapport_utilisateurs.pdf');
  }

  showFields: boolean = false; // Contrôle de l'affichage des champs dynamiques
  generatedCode: string = ''; // Contenu du champ input

  // Affiche les champs dynamiques
  generateCode(): void {
    // this.showFields = true;
    this.service.url = environment.apiBaseUrl + 'entreprise-code';
    this.service.store(this.user_id).subscribe({
      next: (resp) => {
        this.service.handleResponse(resp);
      },
      error: (err) => {
        switch (err.status) {
          case 409:
            Swal.fire({
              icon: 'warning',
              title: 'Ousp',
              text: 'Vous avez deja une code d\'invitation',
              confirmButtonText: 'OK',
              timer: 5000, // Optionnel : ferme automatiquement l'alerte après 5 secondes
            });
            break;
          case 400:
            Swal.fire({
              icon: 'error',
              title: 'Requête invalide',
              text: err.error.message || 'Veuillez vérifier les données envoyées.',
              confirmButtonText: 'OK',
            });
            break;
          case 500:
            Swal.fire({
              icon: 'error',
              title: 'Erreur serveur',
              text: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
              confirmButtonText: 'OK',
            });
            break;
          default:
            Swal.fire({
              icon: 'info',
              title: 'Erreur inconnue',
              text: err.error.message || 'Une erreur inattendue est survenue.',
              confirmButtonText: 'OK',
            });
        }
        // console.error('Erreur API :', err);
      },

    });

  }

  // Action lors du clic sur "Envoyer"
  sendCode() {
    this.service.url = environment.apiBaseUrl + 'entreprise-code';
    const data = this.codeForm.value;
    this.service.store(data).subscribe({
      next: (resp) => {
        this.service.handleResponse(resp);
        this.codeForm.reset();
        this.showFields = false;
      }, error: (err) => {
        this.service.handleResponse(err);
        this.codeForm.reset();
        this.showFields = false;
      },
    })
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      console.error('Vous ne pouvez importer qu\'un seul fichier à la fois.');
      return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const binaryData = e.target.result;

      // Lire le fichier Excel
      const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });

      // Supposons que les données se trouvent dans la première feuille
      const sheetName: string = workbook.SheetNames[0];
      const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convertir en tableau JSON
      const jsonData = XLSX.utils.sheet_to_json(sheetData, { header: 1 }) as string[][];

      // Mapper les données (en supposant que le fichier contient trois colonnes : nom, email, mot de passe)
      this.data = jsonData
        .slice(1) // Ignorer l'en-tête
        .map(row => ({
          name: row[0],
          email: row[1],
          password: row[2],
          code_invitatin: row[3],
        }));

      console.log(this.data); // Affichez les données dans la console
    };

    reader.readAsBinaryString(target.files[0]);
    this.showModal = false;
  }

  // Soumettre les données
  submitData(): void {
    this.service.url = environment.apiBaseUrl + "users";
    if (this.data.length === 0) {
      console.error('Aucune donnée à soumettre');
      return;
    }
    this.service.store(this.data).pipe(
      tap({
        next: (resp) => {
          this.service.handleResponse(resp);
        }, error: (error) => {
          console.error("Erreur lors de l'envoi des données :", error);
          this.service.handleResponse(error); // Gérer les erreurs
        }
      })
    )

    // Remplacez par une requête HTTP réelle
    //console.log('Envoi des données à la base de données...', this.data);
  }
}

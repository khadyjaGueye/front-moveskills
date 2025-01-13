import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';
import { Affiliation } from '../../../../interfaces/model';

@Component({
  selector: 'app-affinite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, NgxPaginationModule, RouterLink],
  templateUrl: './affinite.component.html',
  styleUrl: './affinite.component.css'
})
export class AffiniteComponent implements OnInit {

  file: { nom: string; prenom: string; email: string; numero: string }[] = []; // Contient les données extraites
  display: boolean = false;
  showModal: boolean = false;
  affiliations: Affiliation[] = [];
  isInscrit: boolean = false;
  message: string | null = null; // Stocker le message renvoyé par l'API

  constructor(private service: FormateurService) { }

  ngOnInit(): void {
    this.getDataUserNoInscrit()
  }

  openModalAjout() {
    this.display = true;
  }

  closeModalAjout() {
    this.display = false
  }

  openTab() {
    this.showModal = true;
  }

  closeTab() {
    this.showModal = false;
  }
  selectedFile: File | null = null;

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      console.error('Vous ne pouvez importer qu\'un seul fichier à la fois.');
      return;
    }
    this.selectedFile = target.files[0];
    console.log(this.selectedFile); // Vérifiez que le fichier est bien sélectionné
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

      // Mapper les données (en supposant que le fichier contient 4 colonnes : nom, email, mot de passe)
      this.file = jsonData
        .slice(1) // Ignorer l'en-tête
        .map(row => ({
          nom: row[0],
          prenom: row[1],
          email: row[2],
          numero: row[3],
        }));

      // console.log(this.file); // Affichez les données dans la console
    };

    reader.readAsBinaryString(target.files[0]);
    this.showModal = false;
  }


  // Soumettre les données a importées
  submitData(): void {
    this.service.url = environment.apiBaseUrl + "formateur/affiliations/import";
    if (!this.selectedFile) {
      console.error('Aucun fichier sélectionné');
      return;
    }
    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.service.store(formData).subscribe({
      next: (rep) => {
        this.service.handleResponse(rep);
      },
      error: (err) => {
        this.service.handleResponse(err);
      }
    });
  }




  //Liste des utilisateur qui ont cree un compte
  getDataUserAccept() {

  }

  // Récupérer les utilisateurs non inscrits
  getDataUserNoInscrit() {
    this.service.url = environment.apiBaseUrl + 'formateur/affiliations/noinscrites';
    this.service.all().subscribe({
      next: (resp) => {
        this.affiliations = resp.data.affiliations || [];
        if (this.affiliations.length === 0) {
          this.message = "Affiliations non inscrites"
        }
      },
      error: (err) => {
        // console.error('Erreur lors de la récupération des utilisateurs non inscrits:', err);
        // this.message = 'Une erreur s\'est produite lors du chargement des données.';
      }
    });
  }

  // Récupérer les utilisateurs inscrits
  getDataUserInscrit() {
    this.service.url = environment.apiBaseUrl + 'formateur/affiliations/inscrites';
    this.service.all().subscribe({
      next: (resp) => {
        this.affiliations = resp.data.affiliations || [];
        this.affiliations = resp.data.affiliations || [];
        if (this.affiliations.length === 0) {
          this.message = "Affiliations inscrites non trouvées"
        }

      },
      error: (err) => {
        //console.error('Erreur lors de la récupération des utilisateurs inscrits:', err);
      },
    });
  }

  // Récupérer les utilisateurs à relancer
  getDataRelancer() {
    this.service.url = environment.apiBaseUrl + 'formateur/affiliations/relancer';

    this.service.all().subscribe({
      next: (resp) => {
        this.affiliations = resp.data.affiliations || [];
        if (this.affiliations.length === 0) {
          this.message = "Il n'ya pas d'utilisateur à relancer"
        }
      },
      error: (err) => {
        //  console.error('Erreur lors de la récupération des utilisateurs à relancer:', err);
      },
    });
  }

  openListInscrit() {
    this.isInscrit = true;
    this.getDataUserInscrit()
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent implements OnInit {

  apprenantForm: FormGroup;
  file: { nom: string; prenom: string; email: string; numero: string }[] = []; // Contient les données extraites
  selectedFile: File | null = null;
  display: boolean = false;
  showModal: boolean = false;

  constructor(private fb: FormBuilder, private service: ApprenantService) {
    this.apprenantForm = fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero: ['', Validators.required],
    });

  }

  ngOnInit(): void {

  }
  displayAjoutApprenant() {
    this.display = true
  }
  closeAjoutApprenant() {
    this.display = false;
  }
  addApprenant() {
    this.service.url = environment.apiBaseUrl + "formateur/affiliations";

    // Créer une instance de FormData
    const formData = new FormData();

    // Parcourir les valeurs du formulaire et les ajouter à FormData
    Object.keys(this.apprenantForm.value).forEach((key) => {
      formData.append(key, this.apprenantForm.value[key]);
    });

    // Envoyer les données via le service
    this.service.store(formData).subscribe({
      next: (response) => {
        this.service.handleResponse(response);
        this.apprenantForm.reset();
      },
      error: (err) => {
        this.service.handleResponse(err);
        this.apprenantForm.reset();
      }
    });
  }


  openTab() {
    this.showModal = true;
  }

  closeTab() {
    this.showModal = false;
  }

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
}

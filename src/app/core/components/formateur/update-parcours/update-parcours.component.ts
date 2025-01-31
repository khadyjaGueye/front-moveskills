import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDataT } from '../../../../interfaces/model';
import { FormateurService } from '../service/formateur.service';

@Component({
  selector: 'app-update-parcours',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './update-parcours.component.html',
  styleUrl: './update-parcours.component.css'
})
export class UpdateParcoursComponent implements OnInit {

  parcourId: number | null = null;
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

  constructor(private route: ActivatedRoute, private service: FormateurService, private router: Router) { }

  ngOnInit(): void {
    // Récupérer l'ID du parcours depuis l'URL
    this.parcourId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.parcourId);

  }

  updateParcours(): void {
    this.service.update(this.formData.info, this.parcourId).subscribe({
      next: (resp) => {
        this.service.handleResponse(resp)
        this.router.navigate(['/core/formateur/liste-parcours']);

      }, error: (error) => {
        this.service.handleResponse(error)
      }
    })

  }


}

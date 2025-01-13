import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApprenantService } from '../../apprenant/service/apprenant.service';
import { Parcour } from '../../../../interfaces/model';
import { environment } from '../../../../../environments/environment.development';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-parcour',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './parcour.component.html',
  styleUrl: './parcour.component.css'
})
export class ParcourComponent implements OnInit {

  parcours: Parcour[] = [];
  isLoading: boolean = true;

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {
    this.getDataParcours();
  }

  getDataParcours() {
    this.service.url = environment.apiBaseUrl + "parcours";
    this.service.all().subscribe(resp => {
      this.parcours = resp.data.parcours;
      this.isLoading = false; // Données chargées, on masque le spinner
      //console.log(this.parcours);
    })
  }

  publierParcour(){
   // this.service.url = environment.apiBaseUrl + "publier";
   
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentItem, Parcour } from '../../../../interfaces/model';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { AppService } from '../service/app.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-parcours',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink,NgxPaginationModule],
  templateUrl: './parcours.component.html',
  styleUrl: './parcours.component.css'
})
export class ParcoursComponent implements OnInit {

  parcours: Parcour[] = [];
  videos: ContentItem[] = [];
  display: boolean = false;
  numberOfVideos: number = 0;
  idParcour: number = 1;
  public page: number = 1;
  public itemsPerPage: number = 4; // Nombre d'éléments par page
  public searchTerm: string = ''; // Variable pour stocker la valeur de la recherche

  constructor(private service: ApprenantService, private appService: AppService) {

  }

  ngOnInit(): void {

    this.getDataParcours();
    this.loadVideos();
  }

  getDataParcours() {
    this.service.url = environment.apiBaseUrl + "parcours";
    return this.service.all().subscribe(resp => {
      this.parcours = resp.data.parcours
      console.log(resp);

    })
  }

  openModalParcour(id: number): void {
    this.display = true;
    // Stocker l'ID dans le localStorage
    localStorage.setItem('idParcour', id.toString());
  }

  closeModalParcour(): void {
    this.display = false;
  }

  loadVideos() {
    this.service.url = environment.apiBaseUrl + " "
    this.service.all().subscribe(response => {
      // Vérifier si l'API renvoie bien des vidéos et compter leur nombre
      if (response && response.data && response.data.videos) {
        this.numberOfVideos = response.data.videos.length;
      }
    }, (error) => {
      console.error('Erreur lors de la récupération des vidéos:', error);
    }
    )
  }

  get filteredParcours() {
    return this.parcours.filter(parcour =>
      parcour.nom_parcour.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

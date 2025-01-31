import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import { ApprenantService } from '../../apprenant/service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { Parcour, User } from '../../../../interfaces/model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { ApprenantsAyantAchete, Inscrit, TopParcour, Vente } from '../interface/model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tableau',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule,RouterLink],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.css'
})
export class TableauComponent implements OnInit {

  formateurs: User[] = [];
  inscris: Inscrit[] = [];
  apprenants_ayant_achete: ApprenantsAyantAchete[] = [];
  ventes: Vente[] = [];
  top_parcours: TopParcour[] = [];
  parcours: Parcour[] = [];
  superviseurs: User[] = [];
  nombreParcourPublies: Parcour[] = [];
  parcourNonPublies: Parcour[] = []
  parcourAchetes: Parcour[] = [];
  nombreInscrits: number = 0;
  nombreApprenants: number = 0;
  nombreFormateur: number = 0;
  total_vente: number = 0;
  nombreSuperviseurs: number = 0;
  nombreParcourTotal: number = 0;
  nombreParcourTotalPublier = 0;
  nombreParcoursTotalNonPublier = 0;
  nombreParcourTotalAcheter = 0;
  isLoading: boolean = false;

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {
    this.getDataParcour('all');
  }

  private chart: any; // Ajoutez une propriété pour stocker l'instance du graphique

  private initChart(months: string[], parcoursParMois: number[]): void {
    if (!months || months.length === 0 || !parcoursParMois || parcoursParMois.length === 0) {
      console.error('Les données pour le graphique sont invalides ou vides.');
      return;
    }

    // Supprimez l'ancien graphique s'il existe
    if (this.chart) {
      this.chart.destroy();
    }

    const chartConfig = {
      series: [
        {
          name: 'Parcours',
          data: parcoursParMois,
        },
      ],
      chart: {
        type: 'bar',
        height: 240,
        toolbar: {
          show: false,
        },
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const monthIndex = config.dataPointIndex;
            const selectedMonth = months[monthIndex];
            const parcoursForMonth = parcoursParMois[monthIndex];
            this.handleMonthClick(selectedMonth, parcoursForMonth);
          },
        },
      },
      xaxis: {
        categories: months,
        labels: {
          style: {
            colors: '#616161',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#616161',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
        },
      },
      grid: {
        borderColor: '#dddddd',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      colors: ['#114C5A'],
      plotOptions: {
        bar: {
          columnWidth: '40%',
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        theme: 'dark',
      },
    };

    // Créez et rendez le graphique
    const chartElement = document.querySelector('#bar-chart');
    if (chartElement) {
      this.chart = new ApexCharts(chartElement, chartConfig);
      this.chart.render();
    } else {
      console.error('Élément pour le graphique non trouvé.');
    }
  }


  private handleMonthClick(selectedMonth: string, parcoursForMonth: number): void {
    console.log(`Mois sélectionné : ${selectedMonth}`);
    console.log(`Parcours pour ce mois : ${parcoursForMonth}`);
    // Ajoutez ici votre logique pour afficher les données spécifiques
    // Par exemple : ouvrir un modal ou afficher des détails sous le graphique
  }


  getDataParcour(filtre: string) {
    this.isLoading = true; // Active le loader avant de commencer le chargement des données
    this.service.url = `${environment.apiBaseUrl}dashboard?filter=${filtre}`;
    this.service.all().subscribe({
      next: (resp) => {
        this.inscris = resp.data.inscrits;
        this.nombreInscrits = this.inscris.length
        this.formateurs = resp.data.formateurs
        this.nombreFormateur = this.formateurs.length;
        this.ventes = resp.data.ventes
        this.total_vente = resp.data.total_vente
        this.apprenants_ayant_achete = resp.data.apprenants_ayant_achete;
        this.nombreApprenants = this.apprenants_ayant_achete.length;
        this.top_parcours = resp.data.top_parcours;

        this.parcours = resp.data.nombreTotalParcours
        this.nombreParcourTotal = this.parcours.length;

        this.superviseurs = resp.data.nombreTotalSuperviseur
        this.nombreSuperviseurs = this.superviseurs.length;

        this.nombreParcourPublies = resp.data.nombreParcourPublie
        this.nombreParcourTotalPublier = this.nombreParcourPublies.length

        this.parcourNonPublies = resp.data.nombreParcourNonPublie;
        this.nombreParcoursTotalNonPublier = this.parcourNonPublies.length

        this.parcourAchetes = resp.data.nombreParcourAchete
        this.nombreParcourTotalAcheter = this.parcourAchetes.length

        const months = resp?.data?.months || []; // Utilisation d'une valeur par défaut si undefined
        const parcoursParMois = resp?.data?.parcours_par_mois || [];

        if (months.length > 0 && parcoursParMois.length > 0) {
          this.initChart(months, parcoursParMois);
        } else {
          //console.error('Les données récupérées du backend sont invalides.');
        }
        this.isLoading = false; // Désactive le loader après le chargement des données

      }, error: (err) => {
        console.log(err);

      }
    })
  }

}

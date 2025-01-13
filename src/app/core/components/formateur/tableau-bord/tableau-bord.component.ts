import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { Parcour, User } from '../../../../interfaces/model';
import { ApprenantsAyantAchete, Inscrit, PurchasedParcour, TopParcour, Vente } from '../../admin/interface/model';
import { FormateurService } from '../service/formateur.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-tableau-bord',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './tableau-bord.component.html',
  styleUrl: './tableau-bord.component.css'
})
export class TableauBordComponent implements OnInit {

  formateurs: User[] = [];
  inscris: Inscrit[] = [];
  apprenants_ayant_achete: ApprenantsAyantAchete[] = [];
  ventes: Vente[] = [];
  parcours: TopParcour[] = [];
  months: string[] = [];
  parcoursParMois: number[] = [];
  nombreInscrits: number = 0;
  nombreApprenants: number = 0;
  nombreFormateur: number = 0;
  nombreParcours: number = 0;
  total_vente: number = 0;

  constructor(private service: FormateurService) { }

  ngOnInit(): void {
    this.getDataTopFormateur();
    this.getUserInscrit();
    this.getApprenantAyantAcheterParcours();
    this.getDataVentes();
    this.getDataTopParcour();
    this.getChartData();
    // setTimeout(() => {
    //   this.initChart();
    // }, 0);

  }

  private initChart(months: string[], parcoursParMois: number[]): void {
    if (!months || months.length === 0 || !parcoursParMois || parcoursParMois.length === 0) {
      console.error('Les données pour le graphique sont invalides ou vides.');
      return;
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
            const monthIndex = config.dataPointIndex; // Récupère l'index du mois cliqué
            const selectedMonth = months[monthIndex]; // Mois correspondant
            const parcoursForMonth = parcoursParMois[monthIndex]; // Donnée du mois
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

    const chart = new ApexCharts(document.querySelector('#bar-chart'), chartConfig);
    chart.render();
  }

  private handleMonthClick(selectedMonth: string, parcoursForMonth: number): void {
    console.log(`Mois sélectionné : ${selectedMonth}`);
    console.log(`Parcours pour ce mois : ${parcoursForMonth}`);
    // Ajoutez ici votre logique pour afficher les données spécifiques
    // Par exemple : ouvrir un modal ou afficher des détails sous le graphique
  }




  getDataVentes(): void {
    this.service.url = environment.apiBaseUrl + "dashboard";
    this.service.all().subscribe({
      next: (resp) => {
        this.ventes = resp.data.ventes;
      }, error: (err) => {

      }
    })
  }

  getUserInscrit(): number {
    this.service.url = environment.apiBaseUrl + "dashboard";
    this.service.all().subscribe({
      next: (response) => {
        this.inscris = response.data.inscrits;
        this.nombreInscrits = this.inscris.length; // Calcule le nombre d'inscrits
        this.total_vente = response.data.total_vente;
      },
      error: (erre) => {
        console.error(erre);
      }
    });
    return this.nombreInscrits;
  }


  getApprenantAyantAcheterParcours(): number {
    this.service.url = environment.apiBaseUrl + "dashboard";
    this.service.all().subscribe({
      next: (response) => {
        this.apprenants_ayant_achete = response.data.apprenants_ayant_achete;
        this.nombreApprenants = this.apprenants_ayant_achete.length;
      }, error: (erre) => {
        console.error(erre);
      }
    });
    return this.nombreApprenants;
  }

  getDataTopFormateur(): number {
    this.service.url = environment.apiBaseUrl + "dashboard";
    this.service.all().subscribe({
      next: (resp) => {
        this.formateurs = resp.data.formateurs;
        //console.log(resp);

        this.nombreFormateur = this.formateurs.length;
      }, error: (erre) => {
        console.error(erre);
      }
    });
    return this.nombreFormateur;
  }

  getDataTopParcour(): number {
    this.service.url = environment.apiBaseUrl + "dashboard";

    this.service.all().subscribe({
      next: (resp) => {
        this.parcours = resp.data.top_parcours;
        this.nombreParcours = this.parcours.length;
      }, error: (err) => {

      }
    });
    return this.nombreParcours;
  }

  getChartData(): void {
    this.service.url = environment.apiBaseUrl + 'dashboard';
    this.service.all().subscribe({
      next: (response) => {
        const months = response?.data?.months || []; // Utilisation d'une valeur par défaut si undefined
        const parcoursParMois = response?.data?.parcours_par_mois || [];

        if (months.length > 0 && parcoursParMois.length > 0) {
          this.initChart(months, parcoursParMois);
        } else {
          console.error('Les données récupérées du backend sont invalides.');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      },
    });
  }
}

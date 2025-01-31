import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { Parcour, ParcoursPlusAchetes, Transactions, User, UserAchetesParcourDetails } from '../../../../interfaces/model';
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
  transactions: Transactions[] = [];
  parcoursParMois: number[] = [];
  userAchetesParcourDetails: UserAchetesParcourDetails[] = []
  parcoursPlusAchetes: ParcoursPlusAchetes[] = []
  vente_par_mois: number[] = []
  nombreInscrits: number = 0;
  affiations: User[] = []
  nombretotalAffilition: number = 0;
  nombreApprenants: number = 0;
  nombreFormateur: number = 0;
  nombreParcours: number = 0;
  total_vente: number = 0;
  totalRevenu: number = 0;
  nombreAchat: number = 0;
  nbreAffiliationsNonInscris: number = 0;
  nbreAffiliationsInscris: number = 0;
  registeredAffiliations: User[] = []
  notregisteredAffiliations: User[] = []


  constructor(private service: FormateurService) { }

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
    this.service.url = `${environment.apiBaseUrl}dashboard/formateur?filter=${filtre}`;
    this.service.all().subscribe({
      next: (response) => {
        this.nombreAchat = response.data.nombreAchat;
        this.transactions = response.data.transactions;
        this.parcoursPlusAchetes = response.data.parcoursPlusAchetes;
        this.affiations = response.data.totalAffilition;

        this.nombretotalAffilition = this.affiations.length
        this.registeredAffiliations = response.data.registeredAffiliations;

        this.nbreAffiliationsInscris = this.registeredAffiliations.length
        
        this.notregisteredAffiliations = response.data.notregisteredAffiliations;
        this.nbreAffiliationsNonInscris = this.notregisteredAffiliations.length
        this.userAchetesParcourDetails = response.data.userAchetesParcourDetails
        this.vente_par_mois = response.data.vente_par_mois;
        this.totalRevenu = response.data.totalRevenu

        const months = response?.data?.months || []; // Utilisation d'une valeur par défaut si undefined
        const parcoursParMois = response?.data?.vente_par_mois || [];

        if (months.length > 0 && parcoursParMois.length > 0) {
          this.initChart(months, parcoursParMois);
        } else {
          //console.error('Les données récupérées du backend sont invalides.');
        }

      }, error: (error) => {
        console.log(error);
      }
    })
  }
}

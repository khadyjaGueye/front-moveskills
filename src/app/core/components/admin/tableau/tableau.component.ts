import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import { ApprenantService } from '../../apprenant/service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { User } from '../../../../interfaces/model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { ApprenantsAyantAchete, Inscrit, Vente } from '../interface/model';

@Component({
  selector: 'app-tableau',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.css'
})
export class TableauComponent implements OnInit {

  formateurs: User[] = [];
  inscris: Inscrit[] = [];
  apprenants_ayant_achete: ApprenantsAyantAchete[] = [];
  ventes: Vente[] = [];
  nombreInscrits: number = 0;
  nombreApprenants: number = 0;
  nombreFormateur: number = 0;

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {
    this.getDataTopFormateur();
    this.getUserInscrit();
    this.getApprenantAyantAcheterParcours();
    this.getDataVentes();
    setTimeout(() => {
      this.initChart();
    }, 0);
  }

  private initChart(): void {
    const chartConfig = {
      series: [
        {
          name: 'Sales',
          data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
        },
      ],
      chart: {
        type: 'bar',
        height: 240,
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#114C5A'],
      plotOptions: {
        bar: {
          columnWidth: '40%',
          borderRadius: 2,
        },
      },
      xaxis: {
        categories: ['Avril', 'Mai', 'Juin', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Dec'],
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
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: 'dark',
      },
    };

    const chart = new ApexCharts(document.querySelector('#bar-chart'), chartConfig);
    chart.render();
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
        this.nombreFormateur = this.formateurs.length
      }, error: (erre) => {
        console.error(erre);
      }
    });
    return this.nombreFormateur;
  }

}

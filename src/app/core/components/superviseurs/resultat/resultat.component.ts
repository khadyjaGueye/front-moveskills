import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperviseurService } from '../services/superviseur.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-resultat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './resultat.component.html',
  styleUrl: './resultat.component.css'
})
export class ResultatComponent implements OnInit {

  public chart: any;
  // Données du graphique
  isModalOpen = false;
  selectedColorDetails: any;
  // Exemple de données
  data = [
    { color: 'Rouge', percentage: 40, details: 'Caractéristiques de la couleur Rouge' },
    { color: 'Bleu', percentage: 30, details: 'Caractéristiques de la couleur Bleu' },
    { color: 'Jaune', percentage: 20, details: 'Caractéristiques de la couleur Jaune' },
    { color: 'Vert', percentage: 10, details: 'Caractéristiques de la couleur Vert' },
  ];

  constructor(private service: SuperviseurService) { }

  ngOnInit(): void {
    this.createChart();
  }

  // Fonction pour créer le graphique
  createChart() {
    const ctx = document.getElementById('myPieChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.data.map(item => item.color),
        datasets: [{
          data: this.data.map(item => item.percentage),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],

        }]
      },
      options: {
        responsive: true,
        onClick: (event) => this.handleChartClick(event),
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const dataset = tooltipItem.dataset;
                const index = tooltipItem.dataIndex;

                // Ensure the total is calculated correctly and is a number
                const total = (dataset.data as number[]).reduce((a, b) => (a as number) + (b as number), 0);
                const percentage = total > 0 ? ((dataset.data[index] as number) / total * 100).toFixed(2) : '0';
                return `${tooltipItem.label}: ${percentage}%`; // Display the percentage in the tooltip
              }
            }
          },
          datalabels: {
            color: '#fff',
            anchor: 'end',
            align: 'end',
            formatter: (value, context) => {
              // Ensure the total is calculated correctly and is a number
              const total = (context.chart.data.datasets[0].data as number[]).reduce((a, b) => (a as number) + (b as number), 0);

              // Check that total is not null or zero before dividing
              const percentage = total > 0 ? ((value as number) / total * 100).toFixed(2) : '0';
              return `${percentage}%`; // Display the percentage on the chart
            },
          }
        }
      }
      // options: {
      //   //  cutout: '10%',  // Ajuste ce pourcentage selon tes besoins (ex: 40% pour réduire la taille)
      //   onClick: (event) => this.handleChartClick(event),
      //   responsive: true,
      // }
    });
  }

  // Gestion du clic sur le graphique
  handleChartClick(event: any) {
    const points = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    if (points.length) {
      const firstPoint = points[0];
      const label = this.chart.data.labels[firstPoint.index];
      this.openModal(label);
    }
  }

  // Ouvre le modal et affiche les détails de la couleur sélectionnée
  openModal(color: string) {
    this.selectedColorDetails = this.data.find(item => item.color === color);
    this.isModalOpen = true;
  }

  // Ferme le modal
  closeModal() {
    this.isModalOpen = false;
  }

}

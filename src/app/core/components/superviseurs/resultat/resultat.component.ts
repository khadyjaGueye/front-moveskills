import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperviseurService } from '../services/superviseur.service';
import { Chart } from 'chart.js/auto';
import { environment } from '../../../../../environments/environment.development';
import { User } from '../../../../interfaces/model';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-resultat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CommonModule, NgxPaginationModule, SharedModule,],
  templateUrl: './resultat.component.html',
  styleUrl: './resultat.component.css'
})
export class ResultatComponent implements OnInit {

  public chart: any;
  // Données du graphique
  isModalOpen = false;
  selectedColorDetails: any;
  dataColor: User[] = [];
  pieChart: any;
  isTableVisible = false;
  public searchTerm: string = ''; // Variable pour stocker la valeur de la recherche
  public page: number = 1;
  public itemsPerPage: number = 5; // Nombre d'éléments par page
  // Exemple de données
  data = [
    { color: 'Rouge', percentage: 40, details: 'Caractéristiques de la couleur Rouge' },
    { color: 'Bleu', percentage: 30, details: 'Caractéristiques de la couleur Bleu' },
    { color: 'Jaune', percentage: 20, details: 'Caractéristiques de la couleur Jaune' },
    { color: 'Vert', percentage: 10, details: 'Caractéristiques de la couleur Vert' },
  ];

  constructor(private service: SuperviseurService) { }

  ngOnInit(): void {
    // this.createChart();
    this.createPieChart();
    this.setupClickEvent();
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
  showTable() {
    this.isTableVisible = true;
  }

  closeTable() {
    this.isTableVisible = false;
  }

  createPieChart(): void {
    // Vérifiez si le graphique existe déjà, et détruisez-le
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    // Créez une nouvelle instance du graphique
    const ctx = document.getElementById('myPieChart') as HTMLCanvasElement;
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        // Configurez vos données
        labels: ['Vert', 'Jaune', 'Rouge', 'Bleu'],
        datasets: [{
          label: 'Dataset',
          data: [25, 25, 25, 25],
          backgroundColor: ['#008000', '#DACF0A', '#FF0000', '#0000FF']
        }]
      },
      options: {
        // Configurez vos options
      }
    });
  }
  setupClickEvent() {
    const canvas = document.getElementById('myPieChart') as HTMLCanvasElement;
    canvas.addEventListener('click', (event) => this.onChartClick(event));
  }

  onChartClick(event: MouseEvent) {
    const elements = this.pieChart.getElementsAtEventForMode(event as unknown as ChartEvent, 'nearest', { intersect: true }, false);
    if (elements.length) {
      const elementIndex = elements[0].index;
      const colorId = this.getColorIdByIndex(elementIndex);
      this.getDataResultatTest(colorId);
    }
  }

  getColorIdByIndex(index: number): number {
    const colorMap = [0, 1, 2, 3]; // Correspondance des index
    return colorMap[index];
  }

  getDataResultatTest(colorId: number) {
    this.service.url = `${environment.apiBaseUrl}couleur-dominante/${colorId}`;

    this.service.all().subscribe(resp => {
      

      if (Array.isArray(resp.data.users)) {
        this.dataColor = resp.data.users;
      } else {

        this.dataColor = []; // Initialiser à un tableau vide pour éviter les erreurs
      }

      this.selectedColorDetails = this.dataColor;
      this.isModalOpen = true;
    });
  }


  get filteredApprenant() {
    return this.dataColor.filter(appreant =>
      appreant.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}

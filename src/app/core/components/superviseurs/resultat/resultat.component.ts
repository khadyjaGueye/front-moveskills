import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuperviseurService } from '../services/superviseur.service';
import { Chart } from 'chart.js/auto';
import { environment } from '../../../../../environments/environment.development';
import { Item, Report, User, UserDetail } from '../../../../interfaces/model';
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
  public items: Item[] = [];

  public userDetails: UserDetail[] = [];

  // Exemple de données
  data = [
    { color: 'Rouge', percentage: 40, details: 'Caractéristiques de la couleur Rouge' },
    { color: 'Bleu', percentage: 30, details: 'Caractéristiques de la couleur Bleu' },
    { color: 'Jaune', percentage: 20, details: 'Caractéristiques de la couleur Jaune' },
    { color: 'Vert', percentage: 10, details: 'Caractéristiques de la couleur Vert' },
  ];

  public report: Report = {
    total_participants: 0,
    color_distribution: {
      vert: 0,
      jaune: 0,
      rouge: 0,
      bleu: 0,
    },
    percentage_distribution: {
      vert: 0,
      jaune: 0,
      rouge: 0,
      bleu: 0,
    }
  };

  constructor(private service: SuperviseurService) { }

  ngOnInit(): void {
    // this.createChart();
   // this.createPieChart();
   // this.setupClickEvent();
    this.getDataParticipant()
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

  // createPieChart(): void {
  //   // Vérifiez si le graphique existe déjà, et détruisez-le
  //   if (this.pieChart) {
  //     this.pieChart.destroy();
  //   }

  //   // Données pour le graphique
  //   const data = [25, 25, 25, 25]; // Pourcentages
  //   const labels = ['Vert', 'Jaune', 'Rouge', 'Bleu'];
  //   const backgroundColors: string[] = ['#008000', '#DACF0A', '#FF0000', '#0000FF']; // Type explicite pour backgroundColor

  //   // Obtenez le contexte du canvas
  //   const ctx = document.getElementById('myPieChart') as HTMLCanvasElement;

  //   // Créez une nouvelle instance du graphique
  //   this.pieChart = new Chart(ctx, {
  //     type: 'pie',
  //     data: {
  //       labels: labels,
  //       datasets: [{
  //         data: data,
  //         backgroundColor: backgroundColors, // Assurez-vous que c'est un tableau de chaînes
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           display: true,
  //           position: 'bottom',
  //         },
  //         tooltip: {
  //           enabled: false, // Désactive les tooltips
  //         },
  //       },
  //     },
  //     plugins: [
  //       {
  //         id: 'percentageLabels',
  //         beforeDraw: (chart) => {
  //           const { width } = chart;
  //           const { height } = chart;
  //           const ctx = chart.ctx;
  //           const datasets = chart.data.datasets[0].data as number[];
  //           const total = datasets.reduce((a, b) => a + b, 0);

  //           ctx.save();
  //           ctx.font = 'bold 14px Arial';
  //           ctx.textAlign = 'center';
  //           ctx.textBaseline = 'middle';

  //           datasets.forEach((value, i) => {
  //             const meta = chart.getDatasetMeta(0);
  //             const arc = meta.data[i];

  //             // Obtenez la position pour chaque segment
  //             const position = arc.tooltipPosition(true);

  //             // Calculez le pourcentage
  //             const percentage = ((value / total) * 100).toFixed(0) + '%';

  //             // Définissez la couleur de texte en blanc ou noir selon le contraste
  //             const bgColor = backgroundColors[i]; // Utilisation de backgroundColors avec index
  //             ctx.fillStyle = this.getContrastingColor(bgColor);

  //             // Dessinez le pourcentage
  //             ctx.fillText(percentage, position.x, position.y);
  //           });

  //           ctx.restore();
  //         }
  //       }
  //     ]
  //   });
  // }

  /**
   * Retourne une couleur contrastante (noir ou blanc) en fonction de la couleur de fond.
   */
  getContrastingColor(bgColor: string): string {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Calcul de luminosité (formule standard)
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186 ? '#000000' : '#FFFFFF'; // Si clair, utilisez noir, sinon blanc
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
    return this.dataColor.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

   // Initialise items à partir des données de report
   initItems() {
    this.items = [
      { name: 'Vert', color: '#008000', target: this.report.percentage_distribution.vert, counter: 0 },
      { name: 'Jaune', color: '#DACF0A', target: this.report.percentage_distribution.jaune, counter: 0 },
      { name: 'Rouge', color: '#FF0000', target: this.report.percentage_distribution.rouge, counter: 0 },
      { name: 'Bleu', color: '#0000FF', target: this.report.percentage_distribution.bleu, counter: 0 }
    ];
  }

  animateCounter(item: any) {
    const target = Math.floor(item.target); // Arrêter avant la virgule
    const increment = Math.ceil(target / 100); // Vitesse du compteur
    const interval = setInterval(() => {
      if (item.counter < target) {
        item.counter += increment;
        if (item.counter > target) { // Assure de ne pas dépasser la cible
          item.counter = target;
        }
      } else {
        item.counter = target; // S'assurer que le compteur atteint exactement la valeur entière
        clearInterval(interval);
      }
    }, 20); // Temps entre chaque incrément
  }

  startCounters() {
    this.items.forEach(item => {
      this.animateCounter(item);
    });
  }

  getDataParticipant() {
    this.service.url = environment.apiBaseUrl + "RapportCouleurDominante";
    this.service.all().subscribe({
      next: (resp) => {
        this.userDetails = resp.data.userDetails;
       // console.log(this.userDetails);
        this.report = resp.data.report;
        // this.isLoading = false; // Le chargement est terminé
        this.initItems();
        this.startCounters();
      }
    })
  }

  totalPercentage: number = 100;

  generateDiskBackground(): string {
    let gradient = '';
    let start = 0;

    this.items.forEach(item => {
      const end = start + item.counter;
      gradient += `${item.color} ${start}% ${end}%, `;
      start = end;
    });

    // Retirer la virgule finale et retourner la couleur de fond du disque
    return `conic-gradient(${gradient.slice(0, -2)})`;
  }
  getRotation(item: any): number {
    let start = 0;

    for (const currentItem of this.items) {
      if (currentItem === item) {
        break;
      }
      start += currentItem.counter;
    }

    return start + item.counter / 2;
  }


}

import { Component, OnInit } from '@angular/core';
import { Test, UserDetail } from '../../../../interfaces/model';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-resultat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,SharedModule],
  templateUrl: './resultat.component.html',
  styleUrl: './resultat.component.css'
})
export class ResultatComponent implements OnInit {

  tests: Test[] = [];
  colorDominant: string | null = null;
  email!: string;
  id!: number;
  isLoading: boolean = false;
  //https://web.moveskills.xyz/

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {

    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');
    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.email = user.email;
      this.id = user.id;

      this.getDataResultatsTest();
    } else {
      // Gérer le cas où pas d'utilisateur authentifié
    }
  }

  selectedTest: any = null;

  openModal(test: Test) {
    this.selectedTest = test;
    // console.log(this.selectedTest);

  }
  // Fonction pour fermer le modal
  closeModal() {
    this.selectedTest = null;
  }

  // Fonction pour obtenir la couleur sous forme de code hexadécimal
  getColorCode(color: string): string {
    const colorMap: any = {
      bleu: '#0000FF',
      rouge: '#FF0000',
      jaune: '#FFD700',
      vert: '#008000',
    };
    return colorMap[color] || '#FFFFFF';
  }

  // Fonction pour obtenir l'animal correspondant à une couleur
  getAnimal(color: string): string {
    const animalMap: any = {
      bleu: 'Aigle',
      rouge: 'Taureau',
      jaune: 'Singe',
      vert: 'Tortue',
    };
    return animalMap[color] || 'Inconnu';
  }
  p: number = 0;
  // Fonction pour obtenir les autres couleurs avec leurs pourcentages
  getOtherColors(test: any): { name: string; percentage: number }[] {
    return Object.keys(test)
      .filter(
        (key) =>
          key !== 'dominant_color' &&
          key !== 'timestamp' &&
          key !== test.dominant_color
      )
      .map((key) => ({ name: key, percentage: test[key] }));
  }

  getAnimalImage(color: string): string {
    const imageMap: any = {
      bleu: 'assets/images/12.jpg', // Chemin de l'image pour "bleu"
      rouge: 'assets/images/1.jpg', // Chemin de l'image pour "rouge"
      jaune: 'assets/images/33.avif', // Chemin de l'image pour "jaune"
      vert: 'assets/images/tortue.png', // Chemin de l'image pour "vert"
    };
    return imageMap[color] || 'assets/images/default.png'; // Image par défaut si la couleur n'est pas trouvée
  }

  getColorBackground(colorName: string): string {
    const colorMap: any = {
      bleu: '#0000FF',   // Bleu
      rouge: '#FF0000',  // Rouge
      jaune: '#FFD700',  // Jaune
      vert: '#008000',   // Vert
    };
    return colorMap[colorName.toLowerCase()] || '#E5E7EB'; // Gris clair par défaut si la couleur n'est pas trouvée
  }

  getDataResultatsTest() {
    this.isLoading = true;
    this.service.url = `${environment.apiBaseUrl}question1/${this.id}`;
    this.service.all().subscribe({
      next: (rep) => {
        this.tests = rep.data.tests;
        // Trier les tests par ordre décroissant (plus récent au plus ancien)
        this.tests.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        this.isLoading = false;
      }
    })
  }

  getCircleStyle() {
    return {
      'background': `conic-gradient(
      red 0% 25%,
      yellow 25% 50%,
      green 50% 75%,
      blue 75% 100%
    )`
    };
  }

  getPercentage(test: any): number {
    return test[test.dominant_color] || 0;
  }
}

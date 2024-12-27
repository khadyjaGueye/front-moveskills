import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Test } from '../../../../interfaces/model';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-dernier-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dernier-test.component.html',
  styleUrl: './dernier-test.component.css'
})
export class DernierTestComponent implements OnInit {


  dominantColor: string | null = null;
  displayColorCharacteristics: boolean = false;
  id!: number;
  tests: Test[] = [];
  constructor(private service: ApprenantService) { }

  ngOnInit(): void {
    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');
    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.id = user.id;
      this.getDataResultatsTest();
    }
  }

  // Méthode pour obtenir la couleur en français
  getDominantColorInFrench(): string {
    if (!this.dominantColor) {
      return 'Couleur dominante non définie';
    }
    const colorMap: { [key: string]: string } = {
      red: 'rouge',
      yellow: 'jaune',
      green: 'vert',
      blue: 'bleu'
    };
    return colorMap[this.dominantColor] || this.dominantColor;
  }

  // Méthode pour obtenir la couleur en hexadécimal
  getDominantColorHex(): string {
    if (!this.dominantColor) {
      return 'Couleur dominante non définie';
    }
    const colorHexMap: { [key: string]: string } = {
      rouge: '#FF0000',    // Rouge
      jaune: '#FFD700', // Jaune
      vert: '#008000',  // Vert
      bleu: '#0000FF'    // Bleu
    };
    return colorHexMap[this.dominantColor] || '#000000'; // Noir par défaut
  }

  // Méthode pour obtenir l'image de l'animal correspondant
  getAnimalImage(): string {
    if (!this.dominantColor) {
      return 'Couleur dominante non définie';
    }
    const animalImages: { [key: string]: string } = {
      rouge: 'assets/images/1.jpg', // Chemin vers l'image du taureau
      jaune: 'assets/images/33.avif', // Chemin vers l'image du singe
      vert: 'assets/images/tortue.png', // Chemin vers l'image de la tortue
      bleu: 'assets/images/12.jpg' // Chemin vers l'image de l'aigle
    };
    return animalImages[this.dominantColor] || 'assets/images/default.png'; // Image par défaut
  }

  // Méthode pour obtenir le nom de l'animal correspondant
  getAnimalName(): string {
    if (!this.dominantColor) {
      return 'Couleur dominante non définie';
    }
    const animalNames: { [key: string]: string } = {
      rouge: 'Taureau',
      jaune: 'Singe',
      vert: 'Tortue',
      bleu: 'Aigle'
    };
    return animalNames[this.dominantColor] || 'Animal inconnu';
  }

  dernierTest: any = null;
  getDataResultatsTest() {
  //  console.log( this.service.url = `${environment.apiBaseUrl}question1/${this.id}`);

    this.service.url = `${environment.apiBaseUrl}question1/${this.id}`;
    this.service.all().subscribe({
      next: (rep) => {
        //console.log(rep);
        // Vérifier si rep.data.tests existe et est un tableau
        if (rep?.data?.tests && Array.isArray(rep.data.tests)) {
          this.tests = rep.data.tests;
          if (this.tests.length > 0) {
            this.dernierTest = this.tests[this.tests.length - 1]; // Récupérer le dernier test
            this.dominantColor = this.dernierTest.dominant_color; // Assigner la couleur dominante
            //console.log(this.dominantColor);
          } else {
            console.log('Aucun test disponible.');
          }
        } else {
          console.error('Les données des tests sont manquantes ou non valides.');
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tests:', err);
      }
    });
  }

  // Fonction pour obtenir la couleur sous forme de code hexadécimal
  getColorCode(color: string ): string {
    const colorMap: any = {
      bleu: '#0000FF',
      rouge: '#FF0000',
      jaune: '#FFD700',
      vert: '#008000',
    };
    return colorMap[color] || '#FFFFFF';
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
  // Fonction pour obtenir les autres couleurs avec leurs pourcentages
  getOtherColors(test: any): { name: string; percentage: number }[] {
    if (!test || typeof test !== 'object') {
      // console.error('Paramètre invalide pour getOtherColors:', test);
      return []; // Retourner un tableau vide si test est invalide
    }

    return Object.keys(test)
      .filter(
        (key) =>
          key !== 'dominant_color' &&
          key !== 'timestamp' &&
          key !== test.dominant_color
      )
      .map((key) => ({ name: key, percentage: test[key] }));
  }

}

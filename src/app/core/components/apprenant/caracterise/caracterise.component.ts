import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TestService } from '../../../../shared/services/test.service';

@Component({
  selector: 'app-caracterise',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, NgxPaginationModule, RouterLink],
  templateUrl: './caracterise.component.html',
  styleUrl: './caracterise.component.css'
})
export class CaracteriseComponent implements OnInit {

  dominantColor: string | null = null;
  displayColorCharacteristics: boolean = false;
  constructor(private test: TestService) { }

  ngOnInit(): void {
      // Récupère la couleur dominante stockée dans le localStorage
      this.dominantColor = localStorage.getItem("dominantColor");
      // Active l'affichage des caractéristiques de couleur si la couleur dominante existe
      this.displayColorCharacteristics = !!this.dominantColor;
  }

  getCircleStyle() {
    // Définir le style pour le cercle de couleur en fonction de la couleur dominante
    const colorMap: { [key: string]: string } = {
      red: '#FF0000',
      yellow: '#FFFF00',
      green: '#008000',
      blue: '#0000FF'
    };
    return { backgroundColor: colorMap[this.dominantColor || ''] || 'transparent' };
  }

}

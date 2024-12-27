import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApprenantService } from '../service/apprenant.service';
import { environment } from '../../../../../environments/environment.development';
import { Test } from '../../../../interfaces/model';

@Component({
  selector: 'app-commuquer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, NgxPaginationModule],
  templateUrl: './commuquer.component.html',
  styleUrl: './commuquer.component.css'
})
export class CommuquerComponent implements OnInit {

  dominantColor: string | null = null;
  displayColorCharacteristics: boolean = false;
  id!: number;
  tests: Test[] = [];

  constructor(private service: ApprenantService) { }

  ngOnInit(): void {
    // Récupère la couleur dominante stockée dans le localStorage
    this.dominantColor = localStorage.getItem("dominantColor");
    // Active l'affichage des caractéristiques de couleur si la couleur dominante existe
    this.displayColorCharacteristics = !!this.dominantColor;

    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');
    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.id = user.id;

      this.getDataResultatsTest();
    }
  }

  dernierTest: any = null;

  getDataResultatsTest() {
    this.service.url = `${environment.apiBaseUrl}question1/${this.id}`;
    this.service.all().subscribe({
      next: (rep) => {
        this.tests = rep.data.tests;
        if (this.tests.length > 0) {
          this.dernierTest = this.tests[this.tests.length - 1]; // Récupérer le dernier test
        }
        // console.log('Dernier test:', this.dernierTest);
      },
      error: (err) => {
        // console.error('Erreur lors du chargement des tests:', err);
      }
    });
  }
}

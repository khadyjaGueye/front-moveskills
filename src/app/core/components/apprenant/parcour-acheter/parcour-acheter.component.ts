import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../service/apprenant.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parcour-acheter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parcour-acheter.component.html',
  styleUrl: './parcour-acheter.component.css'
})
export class ParcourAcheterComponent implements OnInit {

  parcourName: string | null = null; // Variable pour stocker le nom du parcours

  constructor(private service:ApprenantService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Récupérer le paramètre 'parcour_name' de l'URL
    this.parcourName = this.route.snapshot.queryParamMap.get('parcour_name');
    console.log('Nom du parcours :', this.parcourName);
  }

}

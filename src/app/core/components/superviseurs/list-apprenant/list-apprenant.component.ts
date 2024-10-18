import { Component, OnInit } from '@angular/core';
import { SuperviseurService } from '../services/superviseur.service';

import { CommonModule } from '@angular/common';
import { Apprenant } from '../../apprenant/interface/apprenant';

@Component({
  selector: 'app-list-apprenant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-apprenant.component.html',
  styleUrl: './list-apprenant.component.css'
})
export class ListApprenantComponent implements OnInit {

  apprenants: Apprenant[] = [];
  display: boolean = false;
  idApprenant: number = 1;

  constructor(private service: SuperviseurService) { }

  ngOnInit(): void {

  }
  openModal() {
    console.log("eeeee");
    this.display = true;
  }
  closeModal() {
    this.display = false;
  }

}

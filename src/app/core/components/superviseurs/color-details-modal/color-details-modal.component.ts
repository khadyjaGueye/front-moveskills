import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-details-modal.component.html',
  styleUrl: './color-details-modal.component.css'
})
export class ColorDetailsModalComponent implements OnInit {

  display: boolean = false;
  displayEdit:boolean = false;
  constructor() { }

  ngOnInit(): void {

  }
  openModalAjout() {
    this.display = true;
  }

  openModalEdit(){
    this.displayEdit = true
  }

  close() {
    this.display = false;
  }

}

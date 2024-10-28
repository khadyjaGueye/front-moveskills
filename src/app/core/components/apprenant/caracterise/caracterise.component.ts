import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-caracterise',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, NgxPaginationModule, RouterLink],
  templateUrl: './caracterise.component.html',
  styleUrl: './caracterise.component.css'
})
export class CaracteriseComponent {

}

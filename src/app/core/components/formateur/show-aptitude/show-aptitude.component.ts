import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { Aptitude } from '../../../../interfaces/model';

@Component({
  selector: 'app-show-aptitude',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './show-aptitude.component.html',
  styleUrl: './show-aptitude.component.css'
})
export class ShowAptitudeComponent implements OnInit {

  profil: any;
  profilId: number | null = null;
  isLoading: boolean = false;
  aptitudes: Aptitude[] = []
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.profilId = +this.route.snapshot.paramMap.get('id')!;
  }

}

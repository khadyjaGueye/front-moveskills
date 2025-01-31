import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormateurRoutingModule } from './formateur-routing.module';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormateurRoutingModule,
    
  ]
})
export class FormateurModule { }

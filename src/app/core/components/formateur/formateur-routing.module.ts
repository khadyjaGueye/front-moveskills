import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormateurComponent } from './formateur/formateur.component';
import { ListParcourComponent } from './list-parcour/list-parcour.component';

const routes: Routes = [
  {
    path: '', component: FormateurComponent, children: [
      { path: 'listParcours', component: ListParcourComponent, },
      // { path: 'form', component: FormComponent, }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormateurRoutingModule { }

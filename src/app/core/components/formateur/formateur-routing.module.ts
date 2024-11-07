import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormateurComponent } from './formateur/formateur.component';
import { ListParcourComponent } from './list-parcour/list-parcour.component';
import { ContenuComponent } from './contenu/contenu.component';
import { CompetenceComponent } from './competence/competence.component';

const routes: Routes = [
  {
    path: '', component: FormateurComponent, children: [
      { path: 'listParcours', component: ListParcourComponent, },
      { path: 'contenu', component: ContenuComponent, },
      { path: 'competence', component: CompetenceComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormateurRoutingModule { }

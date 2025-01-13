import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormateurComponent } from './formateur/formateur.component';
import { ListParcourComponent } from './list-parcour/list-parcour.component';
import { ContenuComponent } from './contenu/contenu.component';
import { CompetenceComponent } from './competence/competence.component';
import { AjoutParcoursComponent } from './ajout-parcours/ajout-parcours.component';
import { ChapitreComponent } from './chapitre/chapitre.component';
import { AffiniteComponent } from './affinite/affinite.component';
import { AjoutApprenantComponent } from './ajout-apprenant/ajout-apprenant.component';
import { authGuard } from '../../../shared/guard/auth.guard';
import { TableauBordComponent } from './tableau-bord/tableau-bord.component';

const routes: Routes = [
  {
    path: '', component: FormateurComponent, children: [
      { path: 'listParcours', component: ListParcourComponent, canActivate: [authGuard] },
      { path: 'contenu', component: ContenuComponent, canActivate: [authGuard] },
      { path: 'competence', component: CompetenceComponent, canActivate: [authGuard] },
      { path: 'parcour', component: AjoutParcoursComponent, canActivate: [authGuard] },
      { path: 'chapitre', component: ChapitreComponent, canActivate: [authGuard] },
      { path: 'affinite', component: AffiniteComponent, canActivate: [authGuard] },
      { path: 'apprenant', component: AjoutApprenantComponent, canActivate: [authGuard] },
      { path: '', component: TableauBordComponent, canActivate: [authGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormateurRoutingModule { }

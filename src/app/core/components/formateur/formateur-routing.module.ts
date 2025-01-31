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
import { TestComponent } from './test/test.component';
import { CitationComponent } from './citation/citation.component';
import { ShowTestComponent } from './show-test/show-test.component';
import { UpdateParcoursComponent } from './update-parcours/update-parcours.component';
import { UpdateTestComponent } from './update-test/update-test.component';
import { ShowAptitudeComponent } from './show-aptitude/show-aptitude.component';


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
      { path: 'test', component: TestComponent, canActivate: [authGuard] },
      { path: 'citation', component: CitationComponent, canActivate: [authGuard] },
      { path: 'show-test/:id', component: ShowTestComponent, canActivate: [authGuard] },
      { path: 'update-parcours/:id', component: UpdateParcoursComponent, canActivate: [authGuard] },
      { path: 'update-test/:id/id', component: UpdateTestComponent, canActivate: [authGuard] },
      { path: 'show-aptitude/:id/id', component: ShowAptitudeComponent, canActivate: [authGuard] },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormateurRoutingModule { }

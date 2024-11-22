import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprenantComponent } from './apprenant/apprenant.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { authGuard } from '../../../shared/guard/auth.guard';
import { ParcoursComponent } from './parcours/parcours.component';
import { CaracteriseComponent } from './caracterise/caracterise.component';
import { CommuquerComponent } from './commuquer/commuquer.component';
import { ResultatComponent } from './resultat/resultat.component';

const routes: Routes = [
  {
    path: '', component: ApprenantComponent, children: [
      { path: 'list', component: ListComponent, canActivate: [authGuard] },
      { path: 'form', component: FormComponent, canActivate: [authGuard] },
      { path: 'parcour', component: ParcoursComponent, canActivate: [authGuard] },
      { path: 'caracterise', component: CaracteriseComponent, canActivate: [authGuard] },
      { path: 'comminuque', component: CommuquerComponent, canActivate: [authGuard] },
      { path: 'resultat', component: ResultatComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprenantRoutingModule { }

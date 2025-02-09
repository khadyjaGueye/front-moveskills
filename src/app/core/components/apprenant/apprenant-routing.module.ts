import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprenantComponent } from './apprenant/apprenant.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { authGuard } from '../../../shared/guard/auth.guard';
import { ParcoursComponent } from './parcours/parcours.component';
import { CaracteriseComponent } from './caracterise/caracterise.component';
import { CommuquerComponent } from './commuquer/commuquer.component';
import { ResultatComponent } from './resultat/resultat.component';
import { LoisComponent } from './lois/lois.component';
import { DernierTestComponent } from './dernier-test/dernier-test.component';
import { ResultatLoisComponent } from './resultat-lois/resultat-lois.component';
import { ParcourAcheterComponent } from './parcour-acheter/parcour-acheter.component';
import { InvitationComponent } from './invitation/invitation.component';
import { TableauBordComponent } from './tableau-bord/tableau-bord.component';

const routes: Routes = [
  {
    path: '', component: ApprenantComponent, children: [
      { path: 'list', component: ListComponent, canActivate: [authGuard] },
      { path: 'form', component: FormComponent, canActivate: [authGuard] },
      { path: 'parcour', component: ParcoursComponent, canActivate: [authGuard] },
      { path: 'caracterise', component: CaracteriseComponent, canActivate: [authGuard] },
      { path: 'comminuque', component: CommuquerComponent, canActivate: [authGuard] },
      { path: 'resultat', component: ResultatComponent, canActivate: [authGuard] },
      { path: 'lois', component: LoisComponent, canActivate: [authGuard] },
      { path: 'test', component: DernierTestComponent, canActivate: [authGuard] },
      { path: 'resultatLois', component: ResultatLoisComponent, canActivate: [authGuard] },
      { path: '', component: ParcourAcheterComponent, canActivate: [authGuard] },
      { path: 'invitation', component: InvitationComponent, canActivate: [authGuard] },
      { path: 'tableau', component: TableauBordComponent, canActivate: [authGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprenantRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperviseurComponent } from './superviseur/superviseur.component';
import { ListApprenantComponent } from './list-apprenant/list-apprenant.component';
import { guardGuard } from '../../../auth/guards/guard.guard';
import { ResultatComponent } from './resultat/resultat.component';
import { ColorDetailsModalComponent } from './color-details-modal/color-details-modal.component';
import { ListeTestComponent } from './liste-test/liste-test.component';
import { authGuard } from '../../../shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '', component: SuperviseurComponent, children: [
      { path: 'listApprenant', component: ListApprenantComponent, canActivate: [authGuard] },
      { path: 'resultat', component: ResultatComponent, canActivate: [authGuard] },
      { path: 'color', component: ColorDetailsModalComponent, canActivate: [authGuard] },
      { path: 'participant', component: ListeTestComponent, canActivate: [authGuard] },
      // { path: 'list-utilisateur', component: ColorDetailsModalComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperviseursRoutingModule { }

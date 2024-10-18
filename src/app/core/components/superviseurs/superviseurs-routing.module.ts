import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperviseurComponent } from './superviseur/superviseur.component';
import { ListApprenantComponent } from './list-apprenant/list-apprenant.component';
import { guardGuard } from '../../../auth/guards/guard.guard';
import { ResultatComponent } from './resultat/resultat.component';

const routes: Routes = [
  {
    path: '', component: SuperviseurComponent, children: [
      { path: 'listApprenant', component: ListApprenantComponent, },
      { path: 'resultat', component: ResultatComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperviseursRoutingModule { }

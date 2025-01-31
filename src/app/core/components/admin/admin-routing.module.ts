import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUtilisateurComponent } from './list-utilisateur/list-utilisateur.component';
import { TableauComponent } from './tableau/tableau.component';
import { authGuard } from '../../../shared/guard/auth.guard';
import { ParcourComponent } from './parcour/parcour.component';

const routes: Routes = [
  { path: "utilisateur", component: ListUtilisateurComponent, canActivate: [authGuard] },
  { path: "", component: TableauComponent, canActivate: [authGuard] },
  { path: "parcour", component: ParcourComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

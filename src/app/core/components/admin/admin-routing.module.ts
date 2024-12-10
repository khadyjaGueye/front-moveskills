import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUtilisateurComponent } from './list-utilisateur/list-utilisateur.component';
import { TableauComponent } from './tableau/tableau.component';

const routes: Routes = [
  { path: "utilisateur", component: ListUtilisateurComponent },
  { path: "tableau", component: TableauComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

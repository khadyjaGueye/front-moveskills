import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUtilisateurComponent } from './list-utilisateur/list-utilisateur.component';

const routes: Routes = [
  { path: "utilisateur", component: ListUtilisateurComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core/core.component';
import { ApprenantComponent } from './components/apprenant/apprenant/apprenant.component';
import { FormateurComponent } from './components/formateur/formateur/formateur.component';
import { SuperviseurComponent } from './components/superviseurs/superviseur/superviseur.component';

const routes: Routes = [
  {
    path : "", component : CoreComponent, children : [
      { path: "apprenant", component: ApprenantComponent, loadChildren: () => import("./components/apprenant/apprenant.module").then(m => m.ApprenantModule)},
      { path: "formateur", component: FormateurComponent, loadChildren: () => import("./components/formateur/formateur.module").then(m => m.FormateurModule) },
      { path: "superviseur", component: SuperviseurComponent, loadChildren: () => import("./components/superviseurs/superviseurs.module").then(m => m.SuperviseursModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }

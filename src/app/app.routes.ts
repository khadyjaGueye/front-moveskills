import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '', loadChildren : ()=> import("./auth/auth.module").then(m => m.AuthModule),
  },
  {
    path: 'core', loadChildren : ()=> import("./core/core.module").then(m => m.CoreModule),
  },
];

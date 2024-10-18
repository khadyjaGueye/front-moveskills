import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { guardGuard } from './guards/guard.guard';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      { path: '', component: LoginComponent, },
      { path: 'register', component: RegisterComponent, }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

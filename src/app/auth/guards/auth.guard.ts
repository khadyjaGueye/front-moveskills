import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Service d'authentification à adapter selon votre projet

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Rediriger vers une autre page si l'utilisateur est connecté
      this.router.navigate(['core']); // Remplacez '/dashboard' par votre route cible
      return false;
    }
    return true;
  }
}

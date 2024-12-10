import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-core',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './core.component.html',
  styleUrl: './core.component.css'
})
export class CoreComponent implements OnInit {

  role: string = "";
  userId!: number;
  nom!: string;
  prenom!: string;
  email!: string;
  specialite!: string;
  display: boolean = true
  isMenuOpen = false;

  constructor(private router: Router) { }

  ngOnInit(): void {

    // Récupérer l'utilisateur JSON
    const userJson = localStorage.getItem('user');
    if (userJson != null) {
      // Parse seulement si non null
      const user = JSON.parse(userJson);
      this.userId = user.id;
      this.nom = user.name;
      this.prenom = user.prenom;
      this.email = user.email;
      this.role = user.role;
      this
    } else {
      // Gérer le cas où pas d'utilisateur authentifié
    }
  }

  logout(id: number) {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    this.router.navigate(['']);
  }

  test() {
    alert("bonjour")
  }
  togle() {
    this.display = false;
  }

  // Initialisez isNavOpen à false pour que le menu soit caché au démarrage
  isNavOpen = false;

  // Méthode pour basculer l'affichage du menu
  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }
  closeNav() {
    this.isNavOpen = false
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  closeMenu(){
    this.isMenuOpen = false;
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-core',
  standalone: true,
  imports: [RouterOutlet, CommonModule,RouterLink],
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

  test(){
    alert("bonjour")
  }


}

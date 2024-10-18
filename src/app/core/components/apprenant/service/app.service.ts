import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentItem } from '../../../../interfaces/model';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http:HttpClient) { }

  private apiUrl = 'https://example.com/api/contenus'; // URL de votre API backend

  // Récupérer le contenu (vidéos et documents) depuis l'API
  getContenus(): Observable<ContentItem[]> {
    return this.http.get<ContentItem[]>(this.apiUrl);
  }
}

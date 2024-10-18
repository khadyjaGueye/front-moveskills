import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data, Model } from '../../interfaces/model';

@Injectable({
  providedIn: 'root'
})
export class RestService<T> {

  protected url: string = "";
  private selectedParcourId: number | null = null;  // Variable pour stocker l'ID du parcours

  constructor(private http:HttpClient) { }

    /**
   * Méthode pour accéder au http pour ainsi creer d'autre requete*/
    get gethttp() {
      return this.http;
    }

    all(): Observable<Model<Data>> {
      return this.http.get<Model<Data>>(`${this.url}`);
    }

    store(data: any): Observable<Model<Data>> {
      return this.http.post<Model<Data>>(`${this.url}`, data);
    }

    show(id: string): Observable<Model<Data>> {
      return this.http.get<Model<Data>>(`${this.url}/${id}`);
    }

    update(data: any, id: number): Observable<Model<Data>> {
      return this.http.put<Model<Data>>(`${this.url}/${id}`, data);
    }

    delete(id: number): Observable<Model<Data>> {
      return this.http.delete<Model<Data>>(`${this.url}/${id}`);
    }



    // Fonction pour définir l'ID du parcours sélectionné
    setSelectedParcourId(id: number): void {
      this.selectedParcourId = id;
    }

    // Fonction pour obtenir l'ID du parcours sélectionné
    getSelectedParcourId(): number | null {
      return this.selectedParcourId;
    }

    // Si besoin, une méthode pour réinitialiser l'ID sélectionné
    clearSelectedParcourId(): void {
      this.selectedParcourId = null;
    }
}

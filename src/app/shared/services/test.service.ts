import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data, Model } from '../../interfaces/model';
import { Root } from '../../core/components/formateur/interface/model';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  //url: string = "https://backend-moveskills.dev-illimitis.com/api/question1";
  private url: string = environment.apiBaseUrl + "question1"
  //private baseUrl = 'https://backend-moveskills.dev-illimitis.com/api/parcours';
  private baseUrl: string = environment.apiBaseUrl + "parcours";


  constructor(private http: HttpClient) { }

  store(data: any, token: string | null): Observable<Model<Data>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajouter le token dans l'en-tête Authorization
    });
    return this.http.post<Model<Data>>(this.url, data, { headers });
  }

  private results: any; // Stocker les résultats ici

  setResults(results: any) {
    this.results = results;
  }

  getResults() {
    return this.results;
  }

  //Méthode pour vérifier si des résultats existent
  hasResults(): boolean {
    return this.results !== undefined && this.results !== null;
  }

  getTestsByParcoursId(parcourId: number): Observable<Root> {
    const url = `${this.baseUrl}/${parcourId}/tests`;
    return this.http.get<Root>(url);
  }

  delete(testID: number, parcourId: number): Observable<Root> {
    const url = `${this.baseUrl}/${testID}/tests/${parcourId}`;
    console.log(url);
    return this.http.delete<Root>(url);
  }


  update(testID: number, parcourId: number, data: any): Observable<Root> {
    const url = `${this.baseUrl}/${parcourId}/tests/${testID}`;
    console.log(url);
    return this.http.put<Root>(url, data);
  }

}

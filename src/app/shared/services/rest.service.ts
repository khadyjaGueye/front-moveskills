import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Data, Model } from '../../interfaces/model';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RestService<T> {

  protected url: string = "";
  protected message: string = ""
  private selectedParcourId: number | null = null;  // Variable pour stocker l'ID du parcours

  constructor(private http: HttpClient) { }

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

  show(id: number): Observable<Model<Data>> {
    return this.http.get<Model<Data>>(`${this.url}/${id}`);
  }

  update(data: any, id: number | null): Observable<Model<Data>> {
    return this.http.put<Model<Data>>(`${this.url}/${id}`, data);
  }
  edit(data: any, id: number | null,parcour:string): Observable<Model<Data>> {
    const baseUrl = environment.apiBaseUrl + "parcours";
    return this.http.put<Model<Data>>(`${baseUrl}/${id}${parcour}`, data)
  }

  edit1(data: any, id: number | null): Observable<Model<Data>> {
    const api = "https://backend-moveskills.dev-illimitis.com/api/parcours"
    return this.http.put<Model<Data>>(`${api}/${id}/status/approved`, data);
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
  // handleResponse<T>(responseOrError: T | HttpErrorResponse) {
  //   if (responseOrError instanceof HttpErrorResponse) {
  //     this.message = responseOrError.error.data.message;
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: this.message,
  //       timer: 2000
  //     });
  //   } else {
  //     const response = responseOrError as Model<Data>;
  //     this.message = response.data.message;
  //     Swal.fire({
  //       position: 'top-end',
  //       icon: 'success',
  //       title: this.message,
  //       showConfirmButton: false,
  //       timer: 2000
  //     });
  //   }

  // }

  handleResponse<T>(responseOrError: T | HttpErrorResponse) {
    if (responseOrError instanceof HttpErrorResponse) {
      this.message = responseOrError.error?.data?.message || "Une erreur est survenue.";
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: this.message,
        timer: 2000
      });
    } else {
      const response = responseOrError as Model<Data>;
      this.message = response.data?.message || "Opération réussie.";
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: this.message,
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserInfo } from '../interfaces/auth-interface';
import { Data, Model } from '../../interfaces/model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticatedUser: UserInfo | undefined;

  constructor(private http: HttpClient) {
  }
  login(user: UserInfo): Observable<Model<Data>> {
    const url = "https://backend-moveskills.dev-illimitis.com/api/login"
    return this.http.post<Model<Data>>(url, user);
  }

  logout(id: number) {
    const url = `${environment.apiBaseUrl}/logout/${id}`;
    return this.http.get(url);
  }

  public authentificateUser(user: UserInfo, token: string): Observable<boolean> {
    this.authenticatedUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token)
    return of(true);
  }

  // Exemple : vérification d'un token dans localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Adaptez selon votre logique
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  filter(apprenants: any[], searchTerm: string): any[] {
    if (!searchTerm) return apprenants;
    return apprenants.filter(apprenant =>
      apprenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apprenant.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

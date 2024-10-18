import { Injectable } from '@angular/core';
import { RestService } from '../../../../shared/services/rest.service';
import { Data } from '../../../../interfaces/model';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApprenantService extends RestService<Data>{

  override url = environment.apiBaseUrl;
  
}

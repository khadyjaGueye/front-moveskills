import { Injectable } from '@angular/core';
import { RestService } from '../../../../shared/services/rest.service';
import { Data } from '../../../../interfaces/model';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FormateurService extends RestService<Data>{

  override url = environment.apiBaseUrl;


}

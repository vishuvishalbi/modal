import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HTTP
  ) { }

  async startActivate(param) {
    const header = {
      'content-type': 'application/json'
    }
    return await this.http.post('', param , {});
  }
}

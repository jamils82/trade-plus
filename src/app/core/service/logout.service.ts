import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { POST_REVOKE } from './endPointURL'

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private http: HttpClient) { }
  public logoutRevoke() {
    let data: Observable<any> = new Observable<any>();
    let auth0AccessToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
    let formData = {
      tokenVal: 'client_id=' +
        'FB_OauthClient' +
        '&client_secret=' +
        'secret' +
        '&token=' +
        auth0AccessToken.token.access_token +
        '&token_type_hint=' +
        'access_token'
    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + auth0AccessToken.token.access_token
    });
    let url = POST_REVOKE.url;
    return this.http.post(url, formData.tokenVal, { headers: headers })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  logout() {
    let headers = {
      //'origin': '*'
   //  'Access-Control-Allow-Origin': '*',
    }
    this.http.get<any>('https://fi-dev.au.auth0.com/v2/logout?client_id=5P9KyuxJHI0vTqCjKdRs3QuWsN4N8XAq', {headers}).subscribe(data => {
     
   })
  }
}

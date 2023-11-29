import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GET_IFRAMETOKEN_API, orderCheckoutPage } from './endPointURL';

@Injectable({
  providedIn: 'root',
})
export class AccountPaymentService {
  constructor(private http: HttpClient) {}

  getIframeOTP(data): Observable<any> {
    let url = GET_IFRAMETOKEN_API.url;
    return this.http
      .post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
}

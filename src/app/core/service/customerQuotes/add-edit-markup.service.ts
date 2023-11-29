import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {JOB_DETAILS} from '../endPointURL';

@Injectable({
  providedIn: 'root'
})
export class AddEditMarkupService {
  constructor(private http: HttpClient) { }

  addMarkup(payload, quoteId) {
    let apiUrl = JOB_DETAILS.url+quoteId+'/markup?fields=BASIC';
    return this.http.post<any>(apiUrl, payload);

  }
}

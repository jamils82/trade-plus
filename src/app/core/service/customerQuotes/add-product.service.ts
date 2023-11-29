import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { JOB_DETAILS } from '../endPointURL';

@Injectable({
  providedIn: 'root'
})
export class AddProductService {
  constructor(private http: HttpClient) { }


  saveProduct(payload, quoteId,stageId) {
    let apiUrl = JOB_DETAILS.url+quoteId+'/sob/entries?fields=DEFAULT';
    return this.http.post<any>(apiUrl, payload);

  }
  
  deleteProduct(data, quotesId,stageId) {
    let apiUrl = JOB_DETAILS.url+quotesId+'/sob/deleteEntry/'+data.entryNumber+'?fields=BASIC';
    return this.http.delete<any>(apiUrl);
   }
}

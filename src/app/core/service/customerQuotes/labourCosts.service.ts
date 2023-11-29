import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { JOB_DETAILS } from '../endPointURL';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LabourCostsService {    
  setCostData = new BehaviorSubject<boolean>(null);

    constructor(private http: HttpClient) { }
    retrieveLabourCosts(quoteId,currentTab) {
      let apiUrl = JOB_DETAILS.url+quoteId+'/other-costs/'+currentTab;
      return this.http.get<any>(apiUrl);    
    }

    createLabourOtherCosts(quoteId,currentTab,data) : Observable<any> {
      let apiUrl = JOB_DETAILS.url+quoteId+'/other-costs/'+currentTab;
      return this.http.post(apiUrl, data)
      .pipe(
          catchError(errorRes => {
              return throwError(errorRes);
          })
        );  
    }
    updateLabourOtherCosts(quoteId,currentTab,data): Observable<any> {
      let apiUrl = JOB_DETAILS.url+quoteId+'/other-costs/'+currentTab;
      return this.http.patch(apiUrl, data)
        .pipe(
            catchError(errorRes => {
                return throwError(errorRes);
            })
        );
    }

    deleteCost(data, quotesId) {
      let apiUrl = JOB_DETAILS.url+quotesId+'/other-costs/'+data.type+'/'+data.name;
      return this.http.delete<any>(apiUrl);
     }

     retrieveLabourOtherCosts(quoteId,currentTab) {
      let apiUrl = JOB_DETAILS.url+quoteId+'/other-costs/OtherCosts';
      return this.http.get<any>(apiUrl);    
    }

    fetchLabourOtherCosts(quoteId,currentTab) {
      let apiUrl = JOB_DETAILS.url+quoteId+'/other-costs/' + currentTab;
      return this.http.get<any>(apiUrl);    
    }
}




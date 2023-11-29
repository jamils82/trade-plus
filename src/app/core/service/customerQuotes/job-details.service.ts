import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { JOB_DETAILS, COREOGIC_ADDRESS_API, REPRICE_QUOTE } from '../endPointURL';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobDetailsService {  
  getDetails = new BehaviorSubject(null);
  sendQuoteId = new BehaviorSubject(null);
  setDetailApiData = new BehaviorSubject<boolean>(null);
  getcurrentJobDetails = new BehaviorSubject<any>(null);
  public jobName = this.getDetails.asObservable();
  totalMaterialAmount = new BehaviorSubject(null);
  setTotalValue = new BehaviorSubject(null)
  markupAdded = new BehaviorSubject(false);
  enableReview = new BehaviorSubject(null);
  catalogProducts: boolean;
  getCurrentCostTab = new BehaviorSubject<any>(null)
  getStageList = new BehaviorSubject<any>(false);
  constructor(
    private http: HttpClient
  ) { }

  getJobDetials(quotesId) {
    let apiUrl = JOB_DETAILS.url + `${quotesId}?fields=DEFAULT`;
    return this.http.get<any>(apiUrl);

  }

  getCreateNewQuote() {
    let apiUrl = JOB_DETAILS.url + 'quoteHeaderCode/NEW' + '?fields=DEFAULT';
    return this.http.get<any>(apiUrl);

  }

  // Materials -retrieve products
  getProductsForReviewPage(quotesId) {
    let apiUrl = JOB_DETAILS.url + quotesId + '/sob?fields=FULL';
    return this.http.get<any>(apiUrl);
  }
  
  // Review Page fetch products
  getProductsForReviewPageEntries(quotesId) {
    let apiUrl = JOB_DETAILS.url + quotesId + '/sob/entries?fields=DEFAULT';
    return this.http.get<any>(apiUrl);
  }

  // CoreLogicAPIAdress
  fetchCoreLogicAPIAdress(searchText) {
    let apiUrl = COREOGIC_ADDRESS_API.url + searchText;
    return this.http.get<any>(apiUrl);
  }

  generatePdf(quoteId) {
    let apiUrl = JOB_DETAILS.url + quoteId + "/report";
    let requestBody = {
      "tradeAccountId": localStorage.getItem('selectedTradeAccount') || '',
      "jobAccountId": localStorage.getItem('selectedJobAccount') || '',
    };

    return this.http.post<any>(apiUrl, requestBody);
  }
  generateEmail(quoteId, emailData) {
    let apiUrl = JOB_DETAILS.url + quoteId + "/email";

    return this.http.post<any>(apiUrl, emailData);
  }

  updatePriceService(quoteId: any): Observable<any> {
    let baseUrl = JOB_DETAILS.url;
    let apiUrl = REPRICE_QUOTE.url;

    return this.http.get<any>(baseUrl + quoteId + apiUrl);
  }

  getCompanyDetails(quoteId): Observable<any> {
    let apiUrl = JOB_DETAILS.url + quoteId + "/company-profile?fields=DEFAULT";

    return this.http.get<any>(apiUrl);
  }

  updateQuoteStatus(quoteId, status): Observable<any> {
    let apiUrl = JOB_DETAILS.url + quoteId + "/status";
    let requestBody = {
      "status": status
    };

    return this.http.post<any>(apiUrl, requestBody);
  }
  createStageSection(quoteId, name): Observable<any> {
    let apiUrl = JOB_DETAILS.url + quoteId + "/sob";
    let requestBody = {
      "name": name
    };
    return this.http.post<any>(apiUrl, requestBody);
  }
  getStagesofBuild(quoteId): Observable<any> {
    let apiUrl = JOB_DETAILS.url + quoteId + "/sob?fields=BASIC";
    return this.http.get<any>(apiUrl);
  }
  deleteStageSection(quoteId:string,stageId): Observable<any> {
    let apiUrl = JOB_DETAILS.url+quoteId+ "/sob/"+stageId;
    return this.http.delete(apiUrl)
      .pipe(
          catchError(errorRes => {
              return throwError(errorRes);
          })
      );
  }
  shuffleSection(quoteId,targetPosition,stageId): Observable<any> {
    let apiUrl = JOB_DETAILS.url+ quoteId +'/sob/'+stageId;
    let requestBody = {
      "targetPosition": targetPosition
    };
    return this.http.patch(apiUrl,requestBody)
        .pipe(
            catchError(errorRes => {
                return throwError(errorRes);
            })
        );
    }
}

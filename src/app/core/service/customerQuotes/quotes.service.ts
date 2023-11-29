import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { COMPANY_PROFILE, GET_QUOTES, GET_QUOTES_ENDPOINT , GET_QUOTE_DETAIL_ENDPONT, JOB_DETAILS, SELECTED_BRANCH, UPLOADFILESTOQUOTE } from '../endPointURL';
//import { ProductHelpService } from './helpwithproduct.service';
//import { FIUserAccountDetailsService } from './userAccountDetails.service';

@Injectable({
    providedIn: 'root'
})
export class QuotesService {
    Quote: [] = [] 
    userData: any;
    currentTab = 'NOTSENT';
    quoteStatus="";
    checkOpenModalFrom = new BehaviorSubject(null);
    getLatestQuotes = new BehaviorSubject<boolean>(null);
    getLatestFiles = new BehaviorSubject(null);
    maxFileSizeLimit = 20971520;
    acceptedFileList = [];
    constructor(
      private http: HttpClient,
    ) { } 
    getdetails() {    
      let apiUrl = GET_QUOTES.url;    
      return this.http.get<any>(apiUrl);    
    }  
  
    createQuoteService(quoteData: string,quoteCodeid ): Observable<any> {
      let apiUrl = GET_QUOTES.url + '?selectedTradeAccount=' + localStorage.getItem('selectedIUID') || '';
      // let quoteCode = {
      //   'quoteCode': quoteCodeid
      // }
      return this.http.post(apiUrl, quoteData)
          .pipe(
              catchError(errorRes => {
                  return throwError(errorRes);
              })
          );
      }

      createQuoteServiceNew(quoteData: string,quoteCodeid ): Observable<any> {
        let apiUrl = GET_QUOTES.url + '?selectedTradeAccount=' + localStorage.getItem('selectedIUID') || '';
      // let quoteCode = {
      //   'quoteCode': quoteCodeid
      // }
      return this.http.patch(apiUrl, quoteData)
          .pipe(
              catchError(errorRes => {
                  return throwError(errorRes);
              })
          );
        }

      // createNewQuoteService(quoteData: string, id): Observable<any> {
      //   let apiUrl = GET_QUOTES.url + '?selectedTradeAccount=' + id;
      //   return this.http.post(apiUrl, quoteData)
      //       .pipe(
      //           catchError(errorRes => {
      //               return throwError(errorRes);
      //           })
      //       );
      //   }
  
      updateQuoteService(quoteData: string): Observable<any> {
        let apiUrl = GET_QUOTES.url + '?selectedTradeAccount=' + localStorage.getItem('selectedIUID') || '';;
        return this.http.patch(apiUrl, quoteData)
          .pipe(
              catchError(errorRes => {
                  return throwError(errorRes);
              })
          );
      }
  
      deleteQuoteService(quoteId: string): Observable<any> {
        let apiUrl = JOB_DETAILS.url+quoteId;
        return this.http.delete(apiUrl)
          .pipe(
              catchError(errorRes => {
                  return throwError(errorRes);
              })
          );
      }
  
      addCompanyProfileService(data: any): Observable<any> {
        let apiUrl = COMPANY_PROFILE.url;
        return this.http.post<any>(apiUrl, data); 
      }
  
      getCompanyProfileService(){
        let baseUrl = COMPANY_PROFILE.url;
        return this.http.get<any>(baseUrl);    
      }
  
      getUploadedFileToQuote(quoteId: any): Observable<any> {
        let baseUrl = JOB_DETAILS.url;
        let apiUrl = UPLOADFILESTOQUOTE.url;
        return this.http.get<any>(baseUrl+quoteId+apiUrl);
      }
  
      uploadFileToQuote(quoteId: any, data): Observable<any> {
        let baseUrl = JOB_DETAILS.url;
        let apiUrl = UPLOADFILESTOQUOTE.url;
        return this.http.post<any>(baseUrl+quoteId+apiUrl, data, {reportProgress: true,
          observe: 'events'}).pipe(catchError(this.errorMgmt));
      }
  
      updateFileStatus(quoteId: any, selected, mediaPk): Observable<any> {
        let baseUrl = JOB_DETAILS.url;
        let apiUrl = UPLOADFILESTOQUOTE.url;
        let mediaOption = {             
          "mediaSelected": selected                 
        };
        return this.http.patch<any>(baseUrl+quoteId+apiUrl+'/'+mediaPk, mediaOption);
      }
  
      deleteFileService(quoteId: any, mediaPk): Observable<any> {
        let baseUrl = JOB_DETAILS.url;
        let apiUrl = UPLOADFILESTOQUOTE.url;
        return this.http.delete<any>(baseUrl+quoteId+apiUrl+'/'+mediaPk);
      }
  
      renameMediaFile(quoteId,newName,mediaPk): Observable<any> {
        let apiUrl = JOB_DETAILS.url + quoteId + UPLOADFILESTOQUOTE.url+'/'+mediaPk;
        let body = {             
          "realFileName":newName                 
        };
        return this.http.patch<any>(apiUrl,body);
      }
  
      errorMgmt(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
        } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => {
          return errorMessage;
        });
      }
      getDisplayOptions(quoteId: string): Observable<any> {
        let baseUrl = JOB_DETAILS.url+quoteId+'/displayOptions';
        return this.http.get<any>(baseUrl);
      }
      updateDisplayOptions(quoteId: string,displayOptions): Observable<any> {
        let apiUrl = JOB_DETAILS.url+quoteId+'/displayOptions';
        return this.http.patch(apiUrl, displayOptions)
          .pipe(
              catchError(errorRes => {
                  return throwError(errorRes);
              })
          );
      }
      selectedBranchDetails() {
        let apiUrl = SELECTED_BRANCH.url+'/branches/'+localStorage.getItem('branchCode')+'?depotsRequired=false&fields=FULL';    
        return this.http.get<any>(apiUrl);   
      }
    
}
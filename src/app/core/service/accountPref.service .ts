import { ActiveCartService } from '@spartacus/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GET_CLOUD_INTEGRATION_LOAD_API, CLOUD_INTEGRATION_XERO, GET_STATEMENTS_PREFERENCE_API, GET_DOWNLOAD_FORMATS_API, GET_MY_LIST_API, GET_CLOUD_CONNECTION } from './endPointURL';
import {  POST_PREFERENCES_SETTINGS_API, GET_ORG_USERS_RESPONSE } from './endPointURL';
import { ProductHelpService } from './helpwithproduct.service';
import { FIUserAccountDetailsService } from './userAccountDetails.service';

@Injectable({
    providedIn: 'root'
})
export class AccountPrefService {
    private _connectionStatus: String = 'A';
   selectedId = localStorage.getItem('selectedIUID');
    constructor(
        private http: HttpClient,

    ) { }

    public setConnectStatus(value) {
        this._connectionStatus = value;
    }

    public getConnectStatus() {
        return this._connectionStatus;
    }

    public statementsGetAPI(data): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = GET_STATEMENTS_PREFERENCE_API.url + '?selectedTradeAccount=' + data + '&fields=DEFAULT';
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public downloadFormatsGetAPI(data): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = GET_DOWNLOAD_FORMATS_API.url + '?formatType=' + data;

        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }
    public myListGetAPI(userId: any): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = GET_MY_LIST_API.url + '?userId=' + userId;
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }
    public cloudIntIntialService(): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = GET_CLOUD_INTEGRATION_LOAD_API.url

        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public xeroCloudIntegration(connectionStatus: String, emailid: string, data: string): Observable<any> {
        let url = CLOUD_INTEGRATION_XERO.url + connectionStatus + `&emailid=${emailid}` + data;
        return this.http.patch(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public myOBFergusConnect(cloudProviderName: String, ): Observable<any> {
        let url = GET_CLOUD_CONNECTION.url + 'b2bUnitId=' + this.selectedId  + '&cloudProviderName=' + cloudProviderName;
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public updatePreferencesSettings(email:any, accountId: any, data: any): Observable<any> {
        let url = POST_PREFERENCES_SETTINGS_API.url + email +'/patchPreferences?fields=DEFAULT&selectedTradeAccount=' + accountId;
        return this.http.patch(url, data, {headers: { 'Content-Type': 'application/json' },}).pipe(catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
    }

    public getOrgUsersResponse(): Observable<any>{
        let result: Observable<any> = new Observable<any>();
        let url = GET_ORG_USERS_RESPONSE.url
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        }).pipe(catchError(errorRes => {
                    return throwError(errorRes);
                })
            );

    }

}
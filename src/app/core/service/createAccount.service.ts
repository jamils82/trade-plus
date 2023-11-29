import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { FB_B2B_USER, LINK_TRADE_ACCOUNTS, LIST_TRADE_ACCOUNTS, POST_ADD_NEW_TEAM_MEMBER_ENDPOINT, SWITCH_TRADE_ACCOUNTS } from "./endPointURL";

@Injectable()
export class CreateAccountService {
    constructor(private http: HttpClient) { }

    public fbB2BUserAPICall(noteData: any): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = FB_B2B_USER.url;
        return this.http.post(url, noteData, {
            headers: { 'Content-Type': 'application/json'
        },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
        return result;
    }

    public linkTradeAccountsAPICall(noteData: any): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = LINK_TRADE_ACCOUNTS.url + noteData.emailId + '/linktradeaccounts';
        return this.http.post(url, noteData, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
        return result;
    }

    public getListTradeAccountsAPICall(noteData: any): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = LIST_TRADE_ACCOUNTS.url + noteData.email + '/listtradeaccounts' + '?fields=children(FULL)%2Caddresses(BASIC)%2CunitType%2Cpermissions%2Cstatus%2Cselected%2Cbranch_pos(FULL)%2CisPrimaryAccount%2Cname%2Cuid';
        return this.http.get(url, { params: noteData})
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
        return result;
    }

    public switchTradeAccountsAPICall(noteData: any): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = SWITCH_TRADE_ACCOUNTS.url + 'trade-account?tradeAccount=' + noteData.accountId;
        return this.http.post(url, noteData, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
        return result;
    }
}
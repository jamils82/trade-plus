import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { POST_TRADEACCOUNT_ENDPOINT } from "./endPointURL copy";

@Injectable()
export class UserAccountSelectionChangeService {

    constructor(private http: HttpClient) {

    }
    getChangedAccountDetails(uid: string): Observable<any> {
        var url = POST_TRADEACCOUNT_ENDPOINT.url + uid
        return this.http.post(url, {
            headers: { 'Content-Type': 'text/html' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { POST_USER_PROFILE_UPDATE } from "./endPointURL";


@Injectable()
export class UserProfileDetailsService {
    constructor(private http: HttpClient) { }

    public sendUserProfileDetails(userProfileData: string): Observable<any> {
        let url = POST_USER_PROFILE_UPDATE.url;
        return this.http.post(url, userProfileData, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { POST_ADD_NEW_TEAM_MEMBER_ENDPOINT } from "./endPointURL";

@Injectable()
export class AddNewMemberService {
    constructor(private http: HttpClient) { }

    public addNewMember(noteData: string): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = POST_ADD_NEW_TEAM_MEMBER_ENDPOINT.url;
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
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { DELETE_INVITEE_ENDPOINT, GET_INVITEE_LIST_ENDPOINT, POST_CREATE_INVITEE_ENDPOINT, POST_UPDATE_INVITEE_ENDPOINT } from './endPointURL';

@Injectable({
    providedIn: 'root'
})
export class TeamMemberService {

    constructor(private http: HttpClient) { }

    public getInviteeList(data): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = GET_INVITEE_LIST_ENDPOINT.url + data.email + '/listofinvites?fields=DEFAULT' + '&selectedTradeAccount=' + data.uid + '&userId=' + data.email;
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
        return result;
    }

    public createInviteeList(data): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = POST_CREATE_INVITEE_ENDPOINT.url + data.invitedBy+ '/createInvite?fields=DEFAULT' + '&userId=' + data.invitedBy;
        return this.http.post(url, data, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
        return result;
    }

    public updateInviteeList(noteData): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = POST_UPDATE_INVITEE_ENDPOINT.url + noteData.invitedBy + '/updateInvite?fields=DEFAULT' + '&userId=' + noteData.invitedBy;
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

    public deleteInviteeList(noteData): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = DELETE_INVITEE_ENDPOINT.url + noteData.invitedBy + '/deleteInvite?fields=DEFAULT' + '&userId=' + noteData.invitedBy;
        // return this.http.delete(url, JSON.parse(noteData), {
        //     headers: { 'Content-Type': 'application/json' },
        // })
        //     .pipe(
        //         catchError(errorRes => {
        //             return throwError(errorRes);
        //         })
        //     );

        const options = {
            headers: { 'Content-Type': 'application/json' },
            body: noteData
        };

        return this.http.delete(url, options);
    }
}

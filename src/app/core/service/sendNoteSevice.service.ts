import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { POST_SEND_NOTE_ENDPOINT } from "./endPointURL";

@Injectable()
export class SendNoteService {
    constructor(private http: HttpClient) { }

    public sendNote(noteData: string): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = POST_SEND_NOTE_ENDPOINT.url;
        return this.http.post(url, noteData, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }
}
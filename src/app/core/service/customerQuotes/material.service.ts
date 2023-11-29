import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {JOB_DETAILS} from '../endPointURL';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
updateRetreiveProduct = new BehaviorSubject<number>(null);
loadMoreMaterials = new BehaviorSubject<number>(null);
loadMoreSearch = new BehaviorSubject<number>(null);
private loadTriggerSubject = new Subject<any>();

constructor(private http: HttpClient, private router: Router) { }

  // Materials -retrieve products
  getProducts(quotesId,page,stageId): Observable<any> {
    let apiUrl = JOB_DETAILS.url+ quotesId +'/sob/entries?currentPage='+page+'&pageSize=20&fields=DEFAULT';
    return this.http.get<any>(apiUrl);
  }

  updateProducts(quoteId,entries,entryNumber,stageId): Observable<any> {
  let apiUrl = JOB_DETAILS.url+ quoteId +'/sob/updateEntry/'+entryNumber+'?fields=DEFAULT';
  return this.http.patch(apiUrl, entries)
      .pipe(
          catchError(errorRes => {
              return throwError(errorRes);
          })
      );
  }
  addProductsToMaterial(entry: any, quoteId: any,stageId): Observable<any> {
    let apiUrl = JOB_DETAILS.url+ quoteId +'/sob/entries?fields=DEFAULT';

    return this.http.post<any>(apiUrl, entry); 
  }
  allProductAdded(quoteId,added) {
    this.allProductAddedService(quoteId,added).subscribe(_res => {
      if (added) {
        this.router.navigate(['/quoteDetails/'+quoteId]);
      } 
    });
  }

  allProductAddedService(quoteId,added) {
    let apiUrl=JOB_DETAILS.url+quoteId+"/materialsCompleted";
    
    let requestBody = {
      "materialsCompleted": added
    };
    
    return this.http.post<any>(apiUrl, requestBody);
  }

  loaderTriggerSendEvent() {
    this.loadTriggerSubject.next();
  }
  loaderTriggerReceiveEvent() {
      return this.loadTriggerSubject.asObservable();
  }

}

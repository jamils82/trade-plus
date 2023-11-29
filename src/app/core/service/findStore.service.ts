import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, Subject, BehaviorSubject } from "rxjs";
import { catchError } from "rxjs/operators";
import { CHANGE_BRANCH, FIND_STORE, GOOGLEAPI_LINK } from "./endPointURL";

@Injectable()
export class FindStoreService {

  private selectBranch = new Subject<string>()
  private geoPoint = new BehaviorSubject<any>('')
  private homeBranchData = new BehaviorSubject<any>('')
  private primaryAccountUid = new BehaviorSubject<any>('')
  constructor(private http: HttpClient) { }

  public findStoreAPICall(noteData: any): Observable<any> {
    let result: Observable<any> = new Observable<any>();
    let url = FIND_STORE.url + '&query=' + noteData + '&lang=en&curr=AUD';
    return this.http.get(url, { params: noteData })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
    return result;
  }

  public changeBranch(data): Observable<any> {
    let url = CHANGE_BRANCH.url + data;
    return this.http
      .post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getAllStores(branchData, productCode?): Observable<any> {
    let url;
    if (productCode != undefined) {
      url = FIND_STORE.url + '&latitude=' + branchData.lat + '&longitude=' + branchData.long + '&productCode=' + productCode + '&pageSize=5&radius=1000000&sort=asc';
    }
    else {
      url = FIND_STORE.url + '&latitude=' + branchData.lat + '&longitude=' + branchData.long + '&pageSize=20&radius=1000000&sort=asc';
    }
    return this.http.get(url)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );

  }

  public getAllStoresSearch(branchData, productCode?): Observable<any> {
    let url;
    if (productCode != undefined) {
      url = FIND_STORE.url + '&latitude=' + branchData.lat + '&longitude=' + branchData.long + '&productCode=' + productCode + '&pageSize=5&radius=1000000&sort=asc';
    }
    else {
      url = FIND_STORE.url + '&latitude=' + branchData.lat + '&longitude=' + branchData.long + '&pageSize=20&radius=1000000&sort=asc';
    }
    return this.http.get(url)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );

  }

  public getGeoLocationforHybris(query): Observable<any> {
    let url = GOOGLEAPI_LINK.url + 'address=' + query + ',' + '+AU&key=AIzaSyAvFaeE_BCcuxnbxuSHDft-0oH495tiT3o';
    // let url = GOOGLEAPI_LINK.url;
    return this.http.get(url)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );

  }

  setSwitchBranch(message: string) {
    this.selectBranch.next(message)
  }

  getSwitchBranch(): Observable<string> {
    return this.selectBranch.asObservable();
  }

  setGeoPoint(message: any) {
    this.geoPoint.next(message)
  }

  getGeoPoint(): Observable<any> {
    return this.geoPoint.asObservable();
  }

  setHomeBranchData(message: any) {
    this.homeBranchData.next(message)
  }

  getHomeBranchData(): Observable<any> {
    return this.homeBranchData.asObservable();
  }

  setPrimaryAccountUID(message: any) {
    this.primaryAccountUid.next(message)
  }

  getPrimaryAccountUID(): Observable<any> {
    return this.primaryAccountUid.asObservable();
  }

}
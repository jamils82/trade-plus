import { ActiveCartService } from '@spartacus/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  GET_INVITEE_LIST_ENDPOINT,
  GET_LIST_My_LIST_ENDPOINT,
  GET_MY_QUOTE,
  invoice_adjustment,
  POST_Add_To_My_List_ENDPOINT,
  POST_CREATE_INVITEE_ENDPOINT,
  POST_CREATE_My_List_ENDPOINT,
  POST_Delete_Product_From_List_Name_ENDPOINT,
  POST_Edit_List_Name_ENDPOINT,
  POST_Pinned_My_List_ENDPOINT,
  POST_Save_To_My_List_ENDPOINT,
} from './endPointURL';
import { ProductHelpService } from './helpwithproduct.service';
import { FIUserAccountDetailsService } from './userAccountDetails.service';

@Injectable({
  providedIn: 'root',
})
export class MyListService {
  private _currentScreen = '';
  public productTitle: string = '';
  constructor(
    private activeCartService: ActiveCartService,
    private http: HttpClient,
    private fIUserAccountDetailsService: FIUserAccountDetailsService,
    private productHelpService: ProductHelpService
  ) {}

  setTitle(value) {
    this.productTitle = value;
  }
  getTitle() {
    return this.productTitle;
  }
  public getMyList(data): Observable<any> {
    let result: Observable<any> = new Observable<any>();
    let url =
      GET_LIST_My_LIST_ENDPOINT.url + 'getMyList?' + 'userId=' + data.email;
    return this.http
      .get(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
  // GET_My_Quotes_ENDPOINT.url + 'requestForm/' + 'quotes' + '?fields=DEFAULT';
  public getMyQuoteList(data): Observable<any> {
    let result: Observable<any> = new Observable<any>();
    // let url =
    // GET_My_Quotes_ENDPOINT.url  + 'quotes' + '?fields=DEFAULT';
    let url = GET_MY_QUOTE.url  + '?fields=DEFAULT' + '&pageSize=30&sort=date%3Adesc&currentPage=0'
    return this.http
      .post(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  

  

  public getMyListData(data): Observable<any> {
    let url = 
    GET_LIST_My_LIST_ENDPOINT.url+ 'getListDetail?' + 'userId=' + data.userID  + '&listName=' + data.listName
    return this.http
      .get(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  getUserID(): string {
    return JSON.parse(localStorage.getItem('userInfo')).email;
  }

  getDownloadInvoiceCSV(listName): Observable<HttpResponse<Blob>> {
    let url =
      invoice_adjustment.url +
      `mylist/downloadAsCsv?userId=${this.getUserID()}&listName=${listName}`;
    return this.http.get<Blob>(url, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }

  uploadCSV(listName, fileToUpload): Observable<any> {
    let url =
      invoice_adjustment.url +
      `mylist/uploadCsv?userId=${this.getUserID()}&listName=${listName}`;
    let uploadedFile = new FormData();
    // uploadedFile.append('fileMetadata', JSON.stringify(fileToUpload.name));
    uploadedFile.append('file', fileToUpload, fileToUpload.name);
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    return this.http.post(url, uploadedFile, { headers: headers });
  }

  public createMyList(data): Observable<any> {
    let url = POST_CREATE_My_List_ENDPOINT.url + 'createlist';
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
  public editMyList(data): Observable<any> {
    let url = POST_CREATE_My_List_ENDPOINT.url + 'renameMylist';
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

  public addItemToList(listName: string): Observable<any> {
    let productEntry = [];
    let selectedCode: string = '';
    let selectedData: any;
    if (
      this._currentScreen === 'plpListScreenSingleItem' ||
      this._currentScreen === 'plpGridScreenSingleItem' ||
      this._currentScreen === 'pdpScreen'
    ) {
      selectedData = this.productHelpService.getSelectedProductCode();
      const prodEnd = {
        code: selectedData?.code,
        quantity: selectedData?.quantity,
      };
      productEntry.push(prodEnd);
    } else if (this._currentScreen === 'plpScreenMultiItem') {
      selectedData = this.productHelpService.generatePlpAddAllItem();
      selectedData.forEach((element) => {
        const prodEnd = {
          code: element?.productCode,
          quantity: element?.quantity,
        };
        productEntry.push(prodEnd);
      });
    } else if (this._currentScreen === 'cartScreen') {
      this.activeCartService.getEntries().subscribe((data) => {
        data.forEach((element) => {
          const prodEnd = {
            code: element?.product.code,
            quantity: element?.quantity,
          };
          productEntry.push(prodEnd);
        });
      });
      selectedCode = this.productHelpService.getProductCodeListinCart();
    } else if (this._currentScreen === 'quickOrderMultiItem') {
      selectedData = this.productHelpService.getProductCodeArrInQuickOrder();
      selectedData.forEach((element) => {
        const prodEnd = {
          code: element?.productCode,
          quantity: element?.quantity,
        };
        productEntry.push(prodEnd);
      });
      // selectedCode = selectedCodeData.toString();
    }
    let splittedCodeList = selectedCode.split(',');
    if (productEntry.length == 0) {
      for (let i = 0; i < splittedCodeList.length; i++) {
        const prodEnd = {
          code: splittedCodeList[i],
          quantity: 1,
        };
        productEntry.push(prodEnd);
      }
    }
    let query: any = {
      userID: this.fIUserAccountDetailsService.getCurrentEmail(),
      deleteProduct: false,
      listName: listName,
    };
    query.productEntry = productEntry;
    let url = POST_Add_To_My_List_ENDPOINT.url;
    return this.http.post(url, query, {});
  }

  public addItemsToList(updateProductsInList): Observable<any> {
    let url = POST_Add_To_My_List_ENDPOINT.url;
    return this.http.post(url, updateProductsInList, {});
  }

  public saveList(saveList): Observable<any> {
    let url = POST_Save_To_My_List_ENDPOINT.url;
    return this.http.post(url, saveList, {});
  }

  public setcurrentScreen(screenName: string) {
    this._currentScreen = screenName;
  }

  public deleteMyList(data): Observable<any> {
    let url = POST_CREATE_My_List_ENDPOINT.url + 'deletelist';
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

  public archiveMyList(data): Observable<any> {
    let url = POST_CREATE_My_List_ENDPOINT.url + 'archiveMylist';
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

  public unArchiveMyList(data): Observable<any> {
    let url = POST_CREATE_My_List_ENDPOINT.url + 'archiveMylist';
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

  public pinnedMyList(data): Observable<any> {
    let url = POST_Pinned_My_List_ENDPOINT.url + 'pinnedMylist';
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

  public editListName(data): Observable<any> {
    let url = POST_Edit_List_Name_ENDPOINT.url + 'renameMylist';
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

  public deleteProductFromList(data): Observable<any> {
    const apiDAta = {
      deleted: true,
      listName: data.listName,
      productEntry: [
        {
          code: data.code,
          quantity: data.quantity,
        },
      ],
      userID: data.userId,
    };
    let url = POST_Delete_Product_From_List_Name_ENDPOINT.url;
    return this.http
      .post(url, apiDAta, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
} //

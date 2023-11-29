import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { CREATE_NEW_FORMAT_API, GET_DOWNLOAD_FORMATS_API, GET_DOWNLOAD_FORMATS_FILE_API, GET_FILE_FORMATS_API, GET_FORMAT_ATTRIBUTES_API } from './endPointURL';
import { CREATE_NEW_FORMAT_API, DELETE_FILE_FORMATS_API, GET_FORMAT_ATTRIBUTES_API, GET_DOWNLOAD_FORMATS_FILE_API, GET_FILE_FORMATS_API, EDIT_FORMAT_ATTRIBUTES_API, POST_DOWNLOAD_INVOICE_FORMAT } from './endPointURL';

@Injectable({
  providedIn: 'root',
})
export class downloadFormatService {
  formData: any;
  constructor(private http: HttpClient) { }

  getDownloadFileFormat(): Observable<any> {
    let result: Observable<any> = new Observable<any>();
    let apiUrl =
      GET_FILE_FORMATS_API.url +
      '?b2bUnitId=' +
      localStorage.getItem('selectedIUID') || '' + '&fields=DEFAULT';
    return this.http
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  deleteFileFormat(data) {
    let apiUrl =
      DELETE_FILE_FORMATS_API.url +
      '?docType=' + data.fileType + '&formatId=' + data.id + '&fields=DEFAULT'
    return this.http
      .delete(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  getDownloadFormats(pageIndexVal, pageSizeVal): Observable<any> {
    let result: Observable<any> = new Observable<any>();
    //rmeove static value line after list is dynamic
    let apiUrl =
      GET_DOWNLOAD_FORMATS_FILE_API.url +
      // '?b2bUnitId=123456' + '&docType=INVOICE&fields=DEFAULT';
      '?currentPage=' + pageIndexVal + '&pageSize=' + pageSizeVal + '&docType=DEFAULT&fields=DEFAULT';
    return this.http
      .get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  createNewFormat(data) {
    let url = CREATE_NEW_FORMAT_API.url +
      '?b2bUnitId=' +
      localStorage.getItem('selectedIUID') + '&fields=DEFAULT';
    return this.http.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getDefaultAttribtues(fileFormat, fileType) {
    let url = GET_FORMAT_ATTRIBUTES_API.url + '?docType=' + fileType + '&fields=DEFAULT&formatId=DEFAULT&formatType=' + fileFormat
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );

  }

  getNewAttribtues(fileFormat, fileType, id) {
    let url = GET_FORMAT_ATTRIBUTES_API.url + '?docType=' + fileType + '&fields=DEFAULT&formatId=' + id + '&formatType=' + fileFormat
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );

  }

  editFormatAPI(payload) {
    let url = EDIT_FORMAT_ATTRIBUTES_API.url +
      '?fields=DEFAULT'
    return this.http.patch(url, payload, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );

  }
  getDownloadFormatForInvoice() {
    let url = GET_DOWNLOAD_FORMATS_FILE_API.url +
      '?currentPage=0&docType=INVOICE&fields=FULL&pageSize=10&listType=DPD'
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );

  }

  postDownloadInvoiceFormat(invoiceNo, formatId) {
    let url = POST_DOWNLOAD_INVOICE_FORMAT.url +
      '?b2bUnitId=' + localStorage.getItem('selectedIUID') + '&docType=ALL&invoiceNumber=' + invoiceNo + '&pageSize=1&status=ALL&selectedFormat=' + formatId;
    const downloadFormat = { "documentNumbers": invoiceNo }
    return this.http.post(url, downloadFormat,
      { observe: 'response', responseType: 'blob' })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );

  }

}

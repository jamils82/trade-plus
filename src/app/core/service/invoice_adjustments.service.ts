import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { invoice_adjustment, quote_adjustment } from './endPointURL';

@Injectable({
  providedIn: 'root',
})
export class invoiceAdjustmentService {
  constructor(private http: HttpClient) {}

  public getbUnitId() {
    // return '125022';
    return localStorage.getItem('selectedIUID');
  }

  public getInvoiceList(startDate, endDate, pageSize, pageNumber, docType='ALL', status='ALL'): Observable<any> {
    let tempDoc = (docType == 'CRD') ? 'CREDITNOTE' : (docType == 'INV') ? 'INVOICE' : 'ALL';
    let url =
      invoice_adjustment.url +
      `invoice/getInvoiceList?b2bUnitId=${this.getbUnitId()}&docType=${tempDoc}&pageSize=${pageSize}&pageNumber=${pageNumber}&dateEnd=${endDate}&dateStart=${startDate}&status=${status}`;
    return this.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache',
      },
    });
  }
  public getInvoiceSearch(startDate, endDate, pageSize, pageNumber, value, itemSelected, docType='ALL', status='ALL'): Observable<any> {
    let tempDoc = (docType == 'CRD') ? 'CREDITNOTE' : (docType == 'INV') ? 'INVOICE' : 'ALL';
    let selectedIem;
    if(itemSelected == 'Item Code'){
      selectedIem = 'itemNumbers'
    }
    else if(itemSelected == 'Order/Job Ref.'){
      selectedIem = 'customerOrderRefs'
    }
    else if(itemSelected == 'Invoice/Credit No.'){
      selectedIem = 'documentNumbers'
    }
    else if(itemSelected == 'Sales Order No.'){
      selectedIem = 'salesOrderNumbers'
    }
    else if(itemSelected == 'Brand'){
      selectedIem = 'brand'
    }
    let url =
      invoice_adjustment.url +
      `invoice/getInvoiceList?b2bUnitId=${this.getbUnitId()}&docType=${tempDoc}&pageSize=${pageSize}&pageNumber=${pageNumber}&dateEnd=${endDate}&dateStart=${startDate}&status=${status}&searchKey=${selectedIem}&searchValue=${value}`;
    return this.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache',
      },
    });
  }

  public sortInvoice(sortOrder, currentPage, pageSize, sortType, startDate, endDate, docType, status): Observable<any> {
    sortOrder = sortOrder === true ? 'asc' : 'desc';
    let tempDoc = (docType == 'CRD') ? 'CREDITNOTE' : (docType == 'INV') ? 'INVOICE' : 'ALL';
    let url =
    invoice_adjustment.url +
    `invoice/getInvoiceList?b2bUnitId=${this.getbUnitId()}&docType=${tempDoc}&pageSize=${pageSize}&pageNumber=${currentPage}&dateEnd=${endDate}&dateStart=${startDate}&status=${status}&sortBy=${sortType}&sortByDir=${sortOrder}`;
  return this.http.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache',
    },
  });
  }

  public sortInvoiceWithText(sortOrder, currentPage, pageSize, sortType, startDate, endDate, docType = 'ALL', status = 'ALL', searchKey, searchBy): Observable<any> {
    sortOrder = sortOrder === true ? 'asc' : 'desc';
    let tempDoc = (docType == 'CRD') ? 'CREDITNOTE' : (docType == 'INV') ? 'INVOICE' : 'ALL';
    let selectedIem;
    if(searchBy == 'Item Code'){
      selectedIem = 'itemNumbers'
    }
    else if(searchBy == 'Order/Job Ref.'){
      selectedIem = 'customerOrderRefs'
    }
    else if(searchBy == 'Invoice/Credit No.'){
      selectedIem = 'documentNumbers'
    }
    else if(searchBy == 'Sales Order No.'){
      selectedIem = 'salesOrderNumbers'
    }
    else if(searchBy == 'Brand'){
      selectedIem = 'brand'
    }
    let url =
    invoice_adjustment.url +
    `invoice/getInvoiceList?b2bUnitId=${this.getbUnitId()}&docType=${tempDoc}&pageSize=${pageSize}&pageNumber=${currentPage}&dateEnd=${endDate}&dateStart=${startDate}&status=${status}&sortBy=${sortType}&sortByDir=${sortOrder}&searchKey=${selectedIem}&searchValue=${searchKey}`;
  return this.http.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache',
    },
  });
  }

  public getInvoiceDetail(invoiceNo): Observable<any> {
    let url =
      invoice_adjustment.url +
      `invoice/getInvoiceDetails?b2bUnitId=${this.getbUnitId()}&docType=ALL&invoiceNumber=${invoiceNo}&pageSize=10&status=ALL`;
    return this.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache',
      },
    });
  }

  getDownloadInvoiceCSV(invoiceNo): Observable<any> {
    let url =
      invoice_adjustment.url +
      `invoice/downloadAsCsv?b2bUnitId=${this.getbUnitId()}&docType=ALL&pageSize=1&status=ALL`;
    return this.http
      .post(
        url,
        {
          documentNumbers: invoiceNo,
        },
        { observe: 'response', responseType: 'blob' }
      )
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
  
  getQuoteDownloadInvoiceCSV(quoteNo): Observable<any> {
    let url =
    quote_adjustment.url + '/downloadAsCsv';
    return this.http.post(url, { quoteNumbers: quoteNo}, { headers: { 'Content-Type': 'application/json' }, })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
  getQuoteDownloadPDF(quoteNo): Observable<any> {
    let url =
    quote_adjustment.url + '/' + quoteNo + '/downloadAsPdf';
    return this.http.post(url, { headers: { 'Content-Type': 'application/pdf' }, })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getDownloadInvoicePDF(invoiceNo): Observable<any> {
    let url =
      invoice_adjustment.url +
      `invoice/getInvoicePDF?b2bUnitId=${this.getbUnitId()}&docType=INVOICE`;
    return this.http
      .post(
        url,
        {
          documentNumbers: invoiceNo,
        },
        { observe: 'response', responseType: 'blob' }
      )
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getDownloadStatementsPDF(statementNo): Observable<any> {
      let url =
      invoice_adjustment.url +
      `invoice/getInvoicePDF?b2bUnitId=${this.getbUnitId()}&docType=STATEMENT`;
    return this.http
      .post(
        url,
        {
          documentNumbers: statementNo,
        },
        { observe: 'response', responseType: 'blob' }
      )
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
  // `statement/getStatementList?b2bUnitId=${this.getbUnitId()}&dateEnd=2018-10-31&dateStart=2019-11-01&pageSize=1`;
  public getStatementList(startDate, endDate, pageSize, pageNumber): Observable<any> {
    let url =
      invoice_adjustment.url +
      `statement/getStatementList?b2bUnitId=${this.getbUnitId()}&dateEnd=${endDate}&dateStart=${startDate}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return this.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache',
      },
    });
  }

  public getStatementDetail(statementNo): Observable<any> {
    let url =
      invoice_adjustment.url +
      `statement/getStatementDetails?b2bUnitId=${this.getbUnitId()}&docType=ALL&pageSize=1&statementNumber=${statementNo}&status=ALL`;
    return this.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache',
      },
    });
  }

  public emailService(args) {
    let data = {
      b2bUnitId: this.getbUnitId(),
      body: args.message,
      ccEmails: args.cc,
      docType: args.docType,
      documentNumber: args.documentNumber,
      subject: args.subject,
      toEmails: args.to,
    };
    let url = invoice_adjustment.url + `webforms/invoicePdfEmail`;
    return this.http.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache',
      },
    });
  }
}

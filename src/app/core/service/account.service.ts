import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GET_ACCOUNT_BALANCE, Get_Order_Detail_ENDPOINT, Get_Order_List_ENDPOINT, GET_PAYMENT_HISTORY, GET_POD_API } from './endPointURL';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  param1:any;
  param2:any;

  public consignments: any = [];
  constructor(
    public http: HttpClient,
    private calendar: NgbCalendar,
    public datePipe: DatePipe,
    public router: Router,
    private route: ActivatedRoute
  ) { }
  public reOrder(data): Observable<any> {
    let url = Get_Order_Detail_ENDPOINT.url;
    url = url + data.userId + '/reOrder?fields=DEFAULT&orderCode=' + data.orderCode;
    return this.http.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }
  public getOrderList(data, pagination, currentPage, searchText, status?: string, orderType?: string): Observable<any> {
    const descDate = '&sortString=date:desc'
    if((data == "" || data == undefined || data == null) && (!this.router.url.includes('fromDate'))) {
      let fromDate = this.calendar.getPrev(this.calendar.getToday(), 'm', 1);
      let toDate = this.calendar.getToday();
      data = '&createdAfter=' + this.datePipe.transform(fromDate.year +'-' +fromDate.month +'-' +fromDate.day,'dd-MM-yyyyT00:00:00') +
         '&createdBefore=' +this.datePipe.transform(toDate.year + '-' + toDate.month + '-' + toDate.day,'dd-MM-yyyyT23:59:59');
        }
    else if(this.router.url.includes('fromDate')){
      this.route.queryParams.subscribe(params => {
        this.param1 = params['fromDate'];
        this.param2 = params['toDate'];
    });
     var year = this.param1.toString().split('-')[0];
     var month = this.param1.toString().split('-')[1];
     var day = this.param1.toString().split('-')[2];
    let myDate = new NgbDate(Number(year), Number(month), Number(day) )
    let fromDate = this.calendar.getPrev(myDate, 'm', 0)
    let toDate = this.calendar.getPrev(new NgbDate(Number(this.param2.toString().split('-')[0]), Number(this.param2.toString().split('-')[1]), Number(this.param2.toString().split('-')[2]) ), 'm', 0)
    data = '&createdAfter=' + this.datePipe.transform( fromDate.year +'-' +fromDate.month +'-' +fromDate.day,'dd-MM-yyyyT00:00:00') +
    '&createdBefore=' +this.datePipe.transform(toDate.year + '-' + toDate.month + '-' + toDate.day,'dd-MM-yyyyT23:59:59');
    }

    let url = Get_Order_List_ENDPOINT.url;
    if (pagination == undefined) {
      url = url + 'fields=DEFAULT' + data;
    }
    else {
      url = url + 'fields=DEFAULT' + data + pagination ;
    }
    if ( orderType == '&orderType=Delivery,Pick up' || orderType == '&orderType=Pick up,Delivery' ) {
      orderType = '&orderType=';
    }
    url = url + currentPage + searchText + descDate + status + orderType;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json',
      'currentTimeZone': Intl.DateTimeFormat().resolvedOptions().timeZone },
    }).pipe(
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }
  public getOrderDetail(guid): Observable<any> {
    let url = Get_Order_Detail_ENDPOINT.url;
    url = url + guid;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' ,
      'currentTimeZone': Intl.DateTimeFormat().resolvedOptions().timeZone},
    }).pipe(
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }

  public getProofOfDelivery(data): Observable<any> {
    let url = GET_POD_API.url;
    url = url + data.userId + '/fborders/deliveries/getPod?' + `branchId=${data.branchId}&consignmentId=${data.consignmentId}&customerAccountId=${data.customerAccountId}&deliveryId=${data.deliveryId}&orderId=${data.orderId}&shipmentId=${data.shipmentId}&hybrisOrderId=${data.hybrisOrderId}`
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  selectedId = localStorage.getItem('selectedIUID');
  public getAccountBalance(data): Observable<any> {
    let url = GET_ACCOUNT_BALANCE.url;
    url = url + '?b2bUnitId=' + this.selectedId
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public getPaymentHistory(): Observable<any> {
    let url = GET_PAYMENT_HISTORY.url;
    url = url + '?accountNumber=' + 'tradelink-spa_' + this.selectedId;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

}

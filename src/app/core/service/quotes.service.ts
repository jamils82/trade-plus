import { ActiveCartService } from '@spartacus/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { COMPANY_PROFILE, GET_Active_QUOTE_DETAIL_ENDPONT, GET_QUOTES_ENDPOINT , GET_QUOTE_DETAIL_ENDPONT, GET_SEARCH_QUOTE } from './endPointURL';
import { ProductHelpService } from './helpwithproduct.service';
import { FIUserAccountDetailsService } from './userAccountDetails.service';

@Injectable({
    providedIn: 'root'
})
export class QuotesService {

    constructor(
        private http: HttpClient,
        private fIUserAccountDetailsService: FIUserAccountDetailsService,
        private productHelpService: ProductHelpService) { }

    public getQuotes(dateRange?, pageSize?, currentPage?): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url;
        if(dateRange) {
            url = GET_QUOTES_ENDPOINT.url + dateRange + pageSize + '&sort=date%3Adesc' + currentPage;
        }
        else {
       
            url = GET_QUOTES_ENDPOINT.url;
        }
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public getSearchQuotes(dateRange?, searchText?, pageSize?, currentPage?): Observable<any> {
        let url;
        url = GET_SEARCH_QUOTE.url + dateRange + '&sort=date%3Adesc&searchText=' + searchText + pageSize + currentPage ;
        return this.http.post(url, {
            headers: { 'Content-Type': 'application/json' },
        })
        .pipe(
            catchError(errorRes => {
                return throwError(errorRes);
            })
        );
    }

    public getQuotesDetailData(data): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = GET_QUOTE_DETAIL_ENDPONT.url + '{quoteCode}?quoteCode=' + data;
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public getActiveQuotesDetailData(data,quoteCode): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = GET_Active_QUOTE_DETAIL_ENDPONT.url + data.email + '/convertQuote/'  + quoteCode + '?fields=DEFAULT,' +  'potentialProductPromotions,appliedProductPromotions,potentialOrderPromotions,appliedOrderPromotions,entries(totalPrice(formattedValue),product(images(FULL),stock(FULL)),basePrice(formattedValue,value),updateable),totalPrice(formattedValue),totalItems,totalPriceWithTax(formattedValue),totalDiscounts(value,formattedValue),subTotal(formattedValue),deliveryItemsQuantity,deliveryCost(formattedValue),totalTax(formattedValue, value),pickupItemsQuantity,net,appliedVouchers,productDiscounts(formattedValue),deliveryAddress(DEFAULT),deliveryMode(DEFAULT),customerInstructions,user,saveTime,name,description';
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public getActiveQuotesDetailQDPData(data,quoteCode,comments): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = GET_Active_QUOTE_DETAIL_ENDPONT.url + data.email + '/convertQuote/'  + quoteCode + '?comments=' + comments + '&fields=DEFAULT,' +  'potentialProductPromotions,appliedProductPromotions,potentialOrderPromotions,appliedOrderPromotions,entries(totalPrice(formattedValue),product(images(FULL),stock(FULL)),basePrice(formattedValue,value),updateable),totalPrice(formattedValue),totalItems,totalPriceWithTax(formattedValue),totalDiscounts(value,formattedValue),subTotal(formattedValue),deliveryItemsQuantity,deliveryCost(formattedValue),totalTax(formattedValue, value),pickupItemsQuantity,net,appliedVouchers,productDiscounts(formattedValue),deliveryAddress(DEFAULT),deliveryMode,customerInstructions,user,saveTime,name,description';
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public getExpiredQuoteNum(data): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = GET_QUOTE_DETAIL_ENDPONT.url + '{quoteCode}?quoteCode=' + data;
        return this.http.get(url, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    addCompanyProfileService(data: any): Observable<any> {
        let apiUrl = COMPANY_PROFILE.url;
        return this.http.post<any>(apiUrl, data); 
      }
    
}
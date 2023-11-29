import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CORE_LOGIC_PROPERTY_DETAIL_API, CORE_LOGIC_SUGGESTION_API, orderCheckoutPage,DELETE_CART_DATA } from './endPointURL';

@Injectable({
  providedIn: 'root',
})
export class checkoutService {
  public orderRefDel: any;
  public orderRefCC: any;
  public deliveryInstructionsDel: any;
  public deliveryInstructionsCC: any;
  public selectAddressDel: any;
  public selectAddressCC: any;
  public branchListData: any;
  public branchDetails: any;
  public deliverMode: any;
  private _coreLogicToken: string;
  constructor(private http: HttpClient) {}

  public getStates(): Observable<any> {
    let url = orderCheckoutPage.url + `countries/AU/regions`;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public getCheckoutInfo(data): Observable<any> {
    
    let url =
      orderCheckoutPage.url +
      `users/${data.email}/checkout-data/${data.deliveryMode}?fields=DEFAULT`;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json',
                'currentTimeZone': Intl.DateTimeFormat().resolvedOptions().timeZone },
    });
  }

  public updateCheckoutData(data): Observable<any> {
    let url =
      orderCheckoutPage.url +
      `users/${data.email}/update-checkout-data/${data.deliveryMode}?fields=DEFAULT`;
    let tempData: any = {
      accountId: data.email,
      cartId: data.cartId,
      deliveryMode: data.deliveryMode,
      requestedDate: data.requestedDate,
      requestedTime: data.requestedTime.substring(5, 8) == ':00' ? data.requestedTime.replace(':00 ', ' ') : data.requestedTime,
      purchaseOrderNumber: data.orderRef,
      addressId:
        data.isManual || !data.addressId ? '' : data.addressId.split('|')[0],
      specialInstructions: data.instructions,
      siteContacts: [
        {
          firstName: data.siteContacts?.firstName,
          lastName: data.siteContacts?.lastName,
          mobile: data.siteContacts?.mobile,
          mail: data.email,
          notificationOptions: {
            leftBranchMail: true,
            leftBranchSMS: true,
            missedDeliveryMail: true,
            missedDeliverySMS: true,
            onitsWayMail: true,
            onitsWaySMS: true,
            pickupReadySMS: true,
            scheduledForDeliveryMail: true,
            scheduledForDeliverySMS: true,
          },
        },
      ],
      branchID: data.branchID,
      branchName: data.branchName,
      branchRegionalCode: data.branchRegionalCode,
    };

    if ( data.isManual) {
      tempData.newDeliveryAddress = {
        country: {
          isocode: 'AU',
        },
        line1: `${data.manualAddress.lotNumber}`,
        line2: `${data.manualAddress.streetName}`,
        address3: `${data.manualAddress.streetType}`,
        address4: `${data.manualAddress.crossStreet}`,
        postalCode: data.manualAddress.postCode,
        region: {
          countryIso: 'AU',
          isocode: data.manualAddress.isoCOde == undefined ? localStorage.getItem('isPreState') : data.manualAddress.isoCOde,
        },
        shippingAddress: true,
        town: `${data.manualAddress.suburb}`,
        visibleInAddressBook: true,
      };
    }
    return this.http
      .post(url, tempData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public placeOrder(data: any): Observable<any> {
    let email = JSON.parse(localStorage.getItem('userInfo')).email
    let url =
      orderCheckoutPage.url +
      `users/${email}/orders?cartId=${data.code}`;
      let tempData = {
        orderNumber: data.code,
         paymentType: data.paymentType?.code,
          transactionReference: 'string',
           sourceType: 'B2B_TRADE_PORTAL'
          };

    return this.http
      .post(url, tempData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getBranches(latitude: any, longitude: any) {
    let url =
      orderCheckoutPage.url +
      `stores?currentPage=0&fields=FULL&latitude=${latitude}&longitude=${longitude}&pageSize=20&radius=1000000&sort=asc`;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public getBranchInfo(branchId: any) {
    let url = orderCheckoutPage.url + `branches/${branchId}?fields=DEFAULT`;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public setDefaultValue(value) {
    this.orderRefCC = value.orderRefCC;
    this.orderRefDel = value.orderRefDel;
    this.selectAddressDel = value.addressIdDel;
    this.selectAddressCC = value.addressIdCC;
    this.deliveryInstructionsDel = value.instructionsDel;
    this.deliveryInstructionsCC = value.instructionsCC;
    this.branchDetails = value.branchDetails;
    this.deliverMode = value.deliverMode;
  }

  public getDefaultValue() {
    let value = {
      orderRefCC: this.orderRefCC,
      orderRefDel: this.orderRefDel,
      addressIdDel: this.selectAddressDel,
      addressIdCC: this.selectAddressCC,
      delInstructionsDel: this.deliveryInstructionsDel,
      delInstructionsCC: this.deliveryInstructionsCC,
      branchDetails: this.branchDetails,
      deliverMode: this.deliverMode,
    };
    return value;
  }

  public getCoreLogicToken(): Observable<any> {
    let url =
      orderCheckoutPage.coreLogicToken +
      `access/oauth/token?client_id=uvHPUg8G4QrXL0azH5EID35v5y4JNwkH&client_secret=QA1alLenkFgF3tKS&grant_type=client_credentials`;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public backToQuote(cartData): Observable<any>{
    // let url = DELETE_INVITEE_ENDPOINT.url + noteData.invitedBy + '/deleteInvite?fields=DEFAULT' + '&userId=' + noteData.invitedBy;
    let url = DELETE_CART_DATA.url + cartData + '/delete';
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: cartData
  };

  return this.http.delete(url, options);
  }

  public getCoreLogicSearch(keyValue: any): Observable<any> {
    let url = CORE_LOGIC_SUGGESTION_API.url + keyValue;
    return this.http.get(url, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  // getStreetInfo(streetId: any, token: string): Observable<any> {
  //   let url =
  //     orderCheckoutPage.coreLogicToken +
  //     `search/au/property/street/514548??limit=1`;
  //   return this.http.get(url, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: 'Bearer ' + token,
  //     },
  //   });
  // }

  getPropertyInfo(propId: any): Observable<any> {
    let url = CORE_LOGIC_PROPERTY_DETAIL_API.url + propId;
    return this.http.get(url, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }
}

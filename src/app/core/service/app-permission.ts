import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FIUserAccountDetailsService } from './userAccountDetails.service';

@Injectable({
  providedIn: 'root'
})
export class AppPermissionService implements CanActivate {

  disablePricing: boolean = false;
  disableViewOrders: boolean = false;
  disableQuotes: boolean = false;
  disablePayments: boolean = false;
  // enableCustomQuotes: boolean = false;
  public _isDataLoaded = new BehaviorSubject<boolean>(false);
  constructor(
    public router: Router,
    private userProfileDetailsService: FIUserAccountDetailsService) {
      userProfileDetailsService.setCheckPermissions();
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {

        let permissionlist = data?.orgUnit?.children?.filter(x => x.uid == localStorage.getItem('selectedIUID'));
        if (permissionlist.length > 0) {
          for (let permission of permissionlist[0].permissions) {

            if (permission == 'accountOwnerGroup') {
              this.disablePricing = true;
              this.disableViewOrders = true; //Orders & Deliveries page.
              this.disablePayments = true;
              this.disableQuotes = true;
            }

            if (permission == 'tradelinkPricingGroup') {
              this.disablePricing = true;
            }

            if (permission == 'viewOrdersGroup') {
              this.disableViewOrders = true;
            }

            if (permission == 'accountManagementGroup') {
              this.disablePayments = true;
            }

            if (permission == 'accountManagementGroupInvoice') {
              this.disablePayments = true;
            }

            if (permission == 'placeOrdersGroup') {
              this.disableQuotes = true; //Place Orders &  View Quotes
            }
          }

          this._isDataLoaded.next(true);
        }

      }
    })
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let url = route.url[0].path;
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isloaded) => {
        if (isloaded == true) {
          if ((url == 'upcomingPriceChanges' || url == 'priceFiles' || url == 'priceFilesPage' || url == 'downloadFilesPage') && this.disablePricing == false) {
            this.router.navigate(['/']);
            resolve(false);
          }
          if ((url == 'quotesPage' || url == 'tpQuickOrderPage' || url == 'tpRequestQuotePage') && this.disableQuotes == false) {
            // alert("Hello")
            this.router.navigate(['/']);
            resolve(false);
          }
          if ( url == 'my-orders-deliveries' && this.disableViewOrders == false ) {
            this.router.navigate(['/']);
            resolve(false);
          }
          // if ((url == 'customerQuotes') && !this.enableCustomQuotes) {
          //   this.router.navigate(['/']);
          //   resolve(false);
          // }
          if ((url == 'accountPage' || url == 'paymentPage' || url == 'invoicePage' || url == 'statementsPage') && this.disablePayments == false) {
            this.router.navigate(['/']);
            resolve(false);
          } else {
            resolve(true)
          }
        }
      })
    })

  }
}

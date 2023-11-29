import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@spartacus/core";
import { UserAccountFacade } from "@spartacus/user/account/root";
import { BehaviorSubject, of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class FIUserAccountDetailsService {

    _isCreateInviteGroup: boolean = false;
    _isViewOrdersGroup: boolean = false;
    _isPricingGroup: boolean = false;
    _isPlaceOrdersGroup: boolean = false;
    _isAccountManagementGroup: boolean = false;
    _isAccountManagementGroupInvoice: boolean = false;
    _isAccountOwnerGroup: boolean = false;
    _currentEmail: string;
    _creditLimit: number = 0;
    public _isDataLoaded = new BehaviorSubject<boolean>(false);
    currentUID: string;

    constructor(private auth: AuthService, private userAccount: UserAccountFacade,
      private router: Router) {
        //  alert("I'm service");
    }

    public getUserAccount() {
        return this.auth.isUserLoggedIn().pipe(
            switchMap((isUserLoggedIn) => {
                if (isUserLoggedIn) {
                    return this.userAccount.get();
                } else {
                    return of(undefined);
                }
            })
        );
    }

    public getIsUserLoggedIn() {
        return this.auth.isUserLoggedIn();
    }

    public setCheckPermissions() {
        this.getUserAccount().subscribe((data) => {
            if (data != undefined) {
                //  this.emailId = data.uid;
                this._currentEmail = data.uid;
                this.currentUID = localStorage.getItem('selectedIUID');

                let permissionlist = data?.orgUnit?.children?.filter(x => x.uid == this.currentUID);
                if (permissionlist.length > 0) {
                    this._creditLimit = permissionlist[0].creditLimit;
                    for (let permission of permissionlist[0].permissions) {

                        if (permission == 'accountOwnerGroup') {
                            this._isAccountOwnerGroup = true;
                            this._isCreateInviteGroup = true;
                            this._isPricingGroup = true;
                            this._isViewOrdersGroup = true; //Orders & Deliveries page.
                            this._isAccountManagementGroup = true;
                            this._isAccountManagementGroupInvoice = true;
                            this._isPlaceOrdersGroup = true;
                        }

                        if (permission == 'createInviteGroup') {
                            this._isCreateInviteGroup = true;
                        }

                        if (permission == 'tradelinkPricingGroup') {
                            this._isPricingGroup = true;
                        }

                        if (permission == 'viewOrdersGroup') {
                            this._isViewOrdersGroup = true;
                        }

                        if (permission == 'accountManagementGroup') {
                            this._isAccountManagementGroup = true;
                        }

                        if (permission == 'accountManagementGroupInvoice') {
                            this._isAccountManagementGroupInvoice = true;
                        }

                        if (permission == 'placeOrdersGroup') {
                            this._isPlaceOrdersGroup = true; //Place Orders &  View Quotes
                        }
                        // if (permission == 'placeOrdersGroup') {
                        //     this._isPlaceOrdersGroup = true; //Place Orders &  View Quotes
                        // }
                    }
                    this._isDataLoaded.next(true);
                }
            }
        });

    }

    public isAccountOwnerPermission() {
        return this._isAccountOwnerGroup;
    }

    public isCreateInviteGroupPermission() {
        return this._isCreateInviteGroup;
    }


    public getCreditLimit() {
        return Number(this._creditLimit);
    }

    public isPricingPermission() {
        return new Promise<boolean>((resolve) => {
            this._isDataLoaded.subscribe((isDataLoaded) => {
                if (isDataLoaded) {
                    resolve(this._isPricingGroup);
                }
            })
        });
    }

    public isViewOrdersPermission() {
        return new Promise<boolean>((resolve) => {
            this._isDataLoaded.subscribe((isDataLoaded) => {
                if (isDataLoaded) {
                    resolve(this._isViewOrdersGroup);
                }
            })
        });

    }

    public isPlaceOrdersPermission() {
        return new Promise<boolean>((resolve) => {
            this._isDataLoaded.subscribe((isDataLoaded) => {
                if (isDataLoaded) {
                    resolve(this._isPlaceOrdersGroup);
                    if(!this._isPlaceOrdersGroup) {
                      if(window.location.href.includes('/tpQuickOrderPage') || window.location.href.includes('/tpRequestQuotePage')) {
                       this.router.navigate(['/']);
                      }
                    }
                }
            })
        });
    }

    public isAccountManagementInvoicePermission() {
        return new Promise<boolean>((resolve) => {
            this._isDataLoaded.subscribe((isDataLoaded) => {
                if (isDataLoaded) {
                    resolve(this._isAccountManagementGroupInvoice);
                    if(!this._isAccountManagementGroupInvoice) {
                          if(window.location.href.includes('/invoicePage') || window.location.href.includes('/statementsPage')) {
                           this.router.navigate(['/']);
                          }
                        }
                }
            })
        });
    }

    public navigateToHome(){
        this.router.navigate(['/']);
    }

    public isAccountManagementPermission() {
        return new Promise<boolean>((resolve) => {
            this._isDataLoaded.subscribe((isDataLoaded) => {
                if (isDataLoaded) {
                    resolve(this._isAccountManagementGroup);
                    if(!this._isAccountManagementGroup) {
                        if(window.location.href.includes('/accountPage') || window.location.href.includes('/paymentPage')) {
                         this.router.navigate(['/']);
                        }
                      }
                }
            })
        });
    }

  


    public getCurrentEmail() {
        return this._currentEmail;
    }


}

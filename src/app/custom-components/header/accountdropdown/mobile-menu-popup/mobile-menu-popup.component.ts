import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { saveByNavigationService } from './../../../../shared/services/saveByNagvigation.service';
import { SavePreferredEmailComponent } from 'src/app/custom-pages/account/save-preferred-email/save-preferred-email.component';
import { inputStateService } from 'src/app/shared/services/inputState.service';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@auth0/auth0-angular';
import { LogoutService } from './../../../../core/service/logout.service';
import { CreateAccountService } from './../../../../core/service/createAccount.service';
import { FindStoreService } from 'src/app/core/service/findStore.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '@spartacus/user/account/root';
import { environment } from './../../../../../environments/environment';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-mobile-menu-popup',
  templateUrl: './mobile-menu-popup.component.html',
  styleUrls: ['./mobile-menu-popup.component.scss']
})
export class MobileMenuPopupComponent implements OnInit {

  logoutURL = environment.auth0Domain + "/logout";
  urlSafe: SafeResourceUrl;
  emailId;
  geoPoint: any;
  modalRef: any;
  isOpen: boolean = false;
  accountIdSelected: number;
  uidSelected: any;
  sideMenuData: any = [];
  stateUpdated: boolean = false;
  disablePricing: boolean = true;
  disableViewOrders: boolean = true;
  disableQuotes: boolean = true;
  disablePayments: boolean = true;
  disableInvoice: boolean = true;
  treeControl = new NestedTreeControl<any>(node => node.items);
  dataSource = new MatTreeNestedDataSource<any>();
  private subscription = new Subscription();
  user$: Observable<User | undefined>;
  @Input() selectedLocationName: any;
  @Input() phoneNumber: any;
  @Input() accountList: any;
  @Input() homeBranchData: any;
  @Input() selectedName$: any;

  constructor(
    private fiUserAccountDetailsService: FIUserAccountDetailsService,
    private sanitizer: DomSanitizer,
    private findStoreService: FindStoreService,
    private createAccountService: CreateAccountService,
    private logoutService: LogoutService,
    private auth: AuthService,
    private modalService: NgbModal,
    private router: Router,
    private shareEvents: ShareEvents,
    private accountDropDownStateService: AccountDropDownStateService,
    private inputStateService: inputStateService,
    private saveByNavigation: saveByNavigationService,
    private userProfileDetailsService: FIUserAccountDetailsService
  ) { }

   hasChild = (_: number, node: any) => !!node.items && node.items.length > 0;

  ngOnInit(): void {
    this.user$ = this.fiUserAccountDetailsService.getUserAccount();
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.logoutURL);
    const obj = localStorage.getItem('branchDetails');
    this.geoPoint = JSON.parse(obj);
    this.accountDropDownStateService.getSideNavData().subscribe(data => {
      if (data) {
        this.dataSource.data = data;
        this.sideMenuData = data;
        this.sideMenuData.forEach(element => {
          element.isCollapsed = element?.items?.length > 0 ? false : undefined;
          if (element?.items?.length > 0) {
            element.items.forEach(child => {
              child.isCollapsed = child?.items?.length > 0 ? false : undefined;
              if (child?.items?.length > 0) {
                child.items.forEach(innerChild => {
                  innerChild.isCollapsed = innerChild?.items?.length > 0 ? false : undefined;
                });
              }
            });
          }
        });
      }
    })
  }

  openModal(checkState, url) {
    if (checkState) {
      // open modal

      const modalRef = this.modalService.open(SavePreferredEmailComponent, {
        windowClass: 'savePreferenceEmail',
        centered: true,
        size: 'lg'
      });
      this.stateUpdated = false;
      this.inputStateService.setUpdatedState(false);
      modalRef.componentInstance.selectedChoice = true;
      modalRef.result.then((result) => {
        if (result) {
          this.saveByNavigation.saveByNavigation(true);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate([url]));
        }
        else if (!result) {
          this.saveByNavigation.saveByNavigation(false);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate([url]));
        }
      });
    }
  }

  async getDisableButtonStatus() {
    this.disableViewOrders = await this.userProfileDetailsService.isViewOrdersPermission();
    this.disablePricing = await this.userProfileDetailsService.isPricingPermission();
    this.disableQuotes = await this.userProfileDetailsService.isPlaceOrdersPermission();
    this.disablePayments = await this.userProfileDetailsService.isAccountManagementPermission();
    this.disableInvoice = await this.userProfileDetailsService.isAccountManagementInvoicePermission();
  }

  getDisableStatus(url) {
    if ((url == '/upcomingPriceChanges' || url == '/priceFiles' || url == '/priceFilesPage' || url == '/downloadFilesPage') && !this.disablePricing) {
      return true;
    }
    if ((url == '/quotesPage' || url == '/tpQuickOrderPage' ||  url == '/tpRequestQuotePage') && !this.disableQuotes) {
      return true;
    }
    if ((url == '/accountPage' || url == '/paymentPage' ) && !this.disablePayments) {
      return true;
    }
    if ((url == '/invoicePage' || url == '/statementsPage') && !this.disableInvoice ) {
      return true;
    }  
    else {
      return false;
    }
  }

  routeURL(url) {
    this.modalService.dismissAll();

    this.shareEvents.mobileSearchVal = '';
    this.shareEvents.mobileSearchPage = 'product';
    if (this.inputStateService.statusControl == true) {
      this.openModal(true, url);
    }
    else {
      if (this.router.url == url) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate([url]));
      } else {
        this.router.navigateByUrl(url);
      }
    }

  }

  phoneNumberClicked() {
    (<any>window).dataLayer.push({
      'event':'Phone Click',
      'eventCategory':'Phone',
    //  'eventAction':window.location.href, //Pass the URL of the screen from where user clicked on the Phone
    });
  }  

  closePopup() {
    this.modalService.dismissAll()
  }

  onDropdownClick() {
    this.isOpen = !this.isOpen;
  }

  accountSelect() {
    this.isOpen = !this.isOpen;
  }

  changeAccount(i, accountSwitch, data) {
    // localStorage.setItem('selectedAcc',data.name);
    localStorage.setItem('selectedIUID', data.uid);
    this.uidSelected = data;
    this.accountIdSelected = i;
    this.modalRef = this.modalService.open(accountSwitch, {
      windowClass: 'accountSwitch',
      centered: true,
      size: 'lg',
    });
  }

  changeChildAccount(i, accountSwitch, data) {
    // localStorage.setItem('selectedAcc',data.children[i].name)
    localStorage.setItem('selectedIUID', data.children[i].uid);
    this.uidSelected = data.children[i];
    this.accountIdSelected = i;
    this.modalRef = this.modalService.open(accountSwitch, {
      windowClass: 'accountSwitch',
      centered: true,
      size: 'lg',
    });
  }

  openFindStore(content) {
    this.findStoreService.setGeoPoint(this.geoPoint);
    this.findStoreService.setHomeBranchData(this.homeBranchData);
    this.modalRef = this.modalService.open(content, {
      windowClass: 'branch',
      centered: false,
      size: 'lg',
    });
  }

  switchAccount($event) {
    if ($event) {
      let i = this.accountIdSelected;


      this.modalService.dismissAll();
      const linkTradeAccountObject = {
        accountId: this.uidSelected.uid,
        emailId: this.emailId,
        isAccountOwner: true,
      };

      this.subscription.add(
        this.createAccountService
          .switchTradeAccountsAPICall(linkTradeAccountObject)
          .subscribe((response) => {
            if (response == 'Success') {
              localStorage.setItem(
                'branchDetails',
                JSON.stringify(this.uidSelected.selected_pos)
              );
              window.location.reload();
            } else {
              // Handle Case for Failed Call
            }
          })
      );
    } else {
      this.modalService.dismissAll();
    }
  }

  navigateToAccount() {
    this.modalService.dismissAll();
    this.router.navigate(['/preferencesPage'])
  }

  logout(content) {
    this.fiUserAccountDetailsService.getUserAccount().subscribe((data) => {
      this.emailId = data.uid;
    })
    this.findStoreService.getPrimaryAccountUID().subscribe(
      result => {
        if (result) {
          const linkTradeAccountObject = {
            "accountId": result,
            "emailId": this.emailId,
            "isAccountOwner": true
          }

          this.createAccountService.switchTradeAccountsAPICall(linkTradeAccountObject).subscribe((response) => {
          });
        }
      })
    this.logoutService.logoutRevoke().subscribe(() => {
      // this.auth.logout({ returnTo: environment.UIsiteURl + '/login' });
      this.auth.logout({ returnTo: environment.UIsiteURl + '/tlAuthLandingPage' });
      sessionStorage.clear();
      localStorage.clear();

    })
  }

}

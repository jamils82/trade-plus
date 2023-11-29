import { AccountDropDownStateService } from './../../../shared/services/accountsDropdownState.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router, RouterEvent, RoutesRecognized } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CmsNavigationComponent } from '@spartacus/core';
import {
  CategoryNavigationComponent,
  CmsComponentData,
  NavigationService,
} from '@spartacus/storefront';
import { BehaviorSubject, Subscription } from 'rxjs';
import { inputStateService } from 'src/app/shared/services/inputState.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { SavePreferredEmailComponent } from 'src/app/custom-pages/account/save-preferred-email/save-preferred-email.component';
import { AcountPrefMainComponent } from 'src/app/custom-pages/account/acount-pref-main/acount-pref-main.component';
import { saveByNavigationService } from 'src/app/shared/services/saveByNagvigation.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { filter } from 'rxjs/operators';
import { ChnageQuotePopupComponent } from '../../request-quote-mod/requestquote/chnage-quote-popup/chnage-quote-popup.component';
@Component({
  selector: 'app-custom-navbar',
  templateUrl: './custom-navigation.component.html',
  styleUrls: ['./custom-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomNavbarComponent
  extends CategoryNavigationComponent
  implements OnInit, OnDestroy {
  customMenuItems: any = [];
  disablePricing: boolean = true;
  disableViewOrders: boolean = true;
  disableQuotes: boolean = true;
  disablePayments: boolean = true;
  disableInvoice: boolean = true;
  public tempUrlData: any = [];
  serviceSubscribe: Subscription;
  public stateUpdated: boolean = false;
  previousUrl: string;
  currentUrl: string;
  modalRef: any;
  navigateUrl: any;
  pageState: any;
  quoteFlag: boolean;
  disableRequestQuote: boolean = true;
  disableQuickOrder: boolean = true;
  // disableCustomQuotes: boolean = false;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth;
  }

  constructor(
    componentData: CmsComponentData<CmsNavigationComponent>,
    service: NavigationService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public route: Router,
    private cd: ChangeDetectorRef,
    private inputStateService: inputStateService,
    private modalService: NgbModal,
    private saveByNavigation: saveByNavigationService,
    private accountDropDownStateService: AccountDropDownStateService,
    public commonService: CommonService,
  ) {
  
    super(componentData, service);
    
  }

  async ngOnInit() {
    this.serviceSubscribe = this.inputStateService.stateUpdated$.subscribe(result => {
      if (result) {
        this.stateUpdated = result;
      }
    });
    await this.getDisableButtonStatus();
    this.serviceSubscribe = this.accountDropDownStateService.getNavData().subscribe( data => {
      this.navMenuList();
    })
    this.navMenuList();
    this.currentUrl = this.route.url;
    this.previousUrl = null;
    this.route.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
      // console.log("prev: ", this.previousUrl)
      // console.log("curr: ", this.currentUrl)
        })  
   
  }

  navMenuList() {
    this.serviceSubscribe = this.node$.subscribe((data) => {
      this.customMenuItems = data.children.map((item) => {
        let child: any;
        if (item.children) {
          child = this.getChild(item.children);
          if (item.url && item.title != 'My Account') {
            child.unshift({ text: 'All Products', url: item.url });
          }
          return { text: item.title, items: child, url: item.url };
        }
        return { text: item.title, url: item.url };
      });
      this.cd.markForCheck();
      this.accountDropDownStateService.setSideNavData(this.customMenuItems);
    });
  }

  

  /* Method helps to "parse|optimize" server side data to menu items */
  getChild(children: any): void {
    return children.map((child) => {
      let childList: any;
      if (child.children) {
        childList = this.getChild(child.children);
        if (child.url) {
          childList.unshift({ text: 'All Products', url: child.url });
        }
        return { text: child.title, items: childList, url: child.url };
      }
      return { text: child.title, url: child.url };
    });
  }
  landingPageRouting(url) {
    this.navigateUrl = url;
    this.pageState = this.commonService.getPage();
    if(this.currentUrl == '/tpRequestQuotePage' && this.pageState == true){
      this.openModalQuoteHome();
    }
    else{
      document.location.href = url;
      // this.route.navigate([url]);
    }
  }
  openModalQuoteHome(){
    this.modalRef = this.modalService.open(ChnageQuotePopupComponent, {
      windowClass: 'ChnageQuotePopup',
      centered: true,
      size: 'lg',
    });
    this.modalRef.componentInstance.selectedChoice = true;
    this.modalRef.result.then((result) => {
      // console.log("Result Quote:", result)
      if(result){
        document.location.href = this.navigateUrl;
        // this.route.navigate([this.navigateUrl]);
      }
    })
  }
  async getDisableButtonStatus() {
    this.disableViewOrders = await this.userProfileDetailsService.isViewOrdersPermission();
    this.disablePricing = await this.userProfileDetailsService.isPricingPermission();
    this.disableQuotes = await this.userProfileDetailsService.isPlaceOrdersPermission();
    this.disablePayments = await this.userProfileDetailsService.isAccountManagementPermission();
    this.disableInvoice = await this.userProfileDetailsService.isAccountManagementInvoicePermission();
    // this.disableCustomQuotes = await this.userProfileDetailsService.isAccountOwnerPermission();
    // this.disableRequestQuote = await this.userProfileDetailsService.isRequestQuotePermission();
    // this.disableQuickOrder = await this.userProfileDetailsService.isQuickOrderPermission();
  }
  getDisableStatus(url) {
    if ((url == '/upcomingPriceChanges' || url == '/priceFiles' || url == '/priceFilesPage' || url == '/downloadFilesPage') && !this.disablePricing) {
      return true;
    }
    if ((url == '/quotesPage' || url == '/tpQuickOrderPage' ||  url == '/tpRequestQuotePage') && !this.disableQuotes) {
      return true;
    }
    // if ((url == '/customerQuotes') && (!this.disablePayments && !this.disableCustomQuotes)) {
    //   return true;
    // }
    if ((url == '/accountPage' || url == '/paymentPage' ) && !this.disablePayments ) {
      return true;
    }
    if ((url == '/invoicePage' || url == '/statementsPage') && !this.disableInvoice ) {
      return true;
    } 
    else {
      return false;
    }
  }
  routeToURL(item) {
    window.location.href = item;
  }
  // routeURL(url) {
  //   if(this.stateUpdated){
  //       this.openModal(true, url);
  //   }
  //   else{
  //     if (this.route.url == url) {
  //       this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //         this.route.navigate([url]));
  //     } else {
  //       this.route.navigateByUrl(url);
  //     }
  //   }

  // }
  requestURL(url){
    this.route.navigate([url]);
  }
  routeURL(url) {
    this.navigateUrl = url;
    this.quoteFlag = false;
    this.commonService.setFlag(this.quoteFlag)
    this.pageState = this.commonService.getPage();
    // console.log("Page state:", this.pageState)
    sessionStorage.removeItem("dateFilter");
    if(this.currentUrl == '/tpRequestQuotePage' && this.pageState == true){
      this.openModalQuote();
    }
    else{
      if (this.inputStateService.statusControl == true) {
        this.openModal(true, url);
      }
      else {
        if (this.route.url == url) {
          this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.route.navigate([url]));
            // window.open(url, "_self");
        } else {
          this.route.navigateByUrl(url);
          // window.open(url, "_self");
        }
      }
    }

  }

  openModalQuote(){
    // alert("1st popup")
    this.modalRef = this.modalService.open(ChnageQuotePopupComponent, {
      windowClass: 'ChnageQuotePopup',
      centered: true,
      size: 'lg',
    });
    this.modalRef.componentInstance.selectedChoice = true;
    this.modalRef.result.then((result) => {
      // console.log("Result Quote:", result)
      if(result){
        this.route.navigateByUrl(this.navigateUrl);
        // this.route.navigate([this.navigateUrl]);
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
        // console.log("Result Modal:", result)
        if (result) {
          this.saveByNavigation.saveByNavigation(true);
          this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.route.navigate([url]));
        }
        else if (!result) {
          this.saveByNavigation.saveByNavigation(false);
          this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.route.navigate([url]));
        }
      });
    }
  }

  ngOnDestroy() {
    if(this.serviceSubscribe)
    this.serviceSubscribe.unsubscribe();
  }

}

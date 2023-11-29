import { Auth0TokenService } from './../../../core/service/token.service';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  HostListener,
} from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { Subscription } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { BehaviorSubject } from 'rxjs';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateAccountService } from 'src/app/core/service/createAccount.service';
import { FindStoreService } from 'src/app/core/service/findStore.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { filter } from 'rxjs/operators';
import { ChnageQuotePopupComponent } from '../../request-quote-mod/requestquote/chnage-quote-popup/chnage-quote-popup.component';

@Component({
  selector: 'app-accountdropdown',
  templateUrl: './accountdropdown.component.html',
  styleUrls: ['./accountdropdown.component.scss'],
})
export class AccountdropdownComponent implements OnInit {
  isMobile: boolean = false;
  openMenu: boolean = false;
  openMenubg: boolean = false;
  isOpen: boolean = false;
  private subscription = new Subscription();
  userFirstName: string;
  branchList: any = {};
  accountList: any = [];
  businessData = [];
  selectedName$ = new BehaviorSubject<any>('');
  selectedLocationName: any;
  uidSelected: any;
  @Output() valueChange = new EventEmitter();
  isLoading$ = new BehaviorSubject<boolean>(false);
  selcetedAccount: any;
  modalRef: any;
  accountIdSelected: number;
  branchtry: any;
  emailId: any;
  geoPoint: any;
  homeBranchData: any;
  phoneNumber: any;
  cartValue: any;
  pageState: any;
  currentUrl: string;
  previousUrl: any;
  contentData: any;

  constructor(
    private shareEvents: ShareEvents,
    private accountDropDownStateService: AccountDropDownStateService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    private router: Router,
    private modalService: NgbModal,
    private createAccountService: CreateAccountService,
    private findStoreService: FindStoreService,
    private auth0TokenService: Auth0TokenService,
    public commonService: CommonService,
  ) {
    this.accountDropDownStateService.isDataAvailable = false;
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (data.orgUnit?.children && data.orgUnit?.children?.length > 0) {
          this.getListTradeAccounts(data.orgUnit);
        } else {
          const decodeToken: any = this.auth0TokenService.getDecodeToken();
          this.router.navigate(['/linkAccount']);
        }
      }
    });

    this.currentUrl = this.router.url;
    this.previousUrl = null;
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
      // console.log("prev: ", this.previousUrl)
      // console.log("curr: ", this.currentUrl)
        })
  }

  ngOnInit(): void {
    let templateClass = document.getElementsByTagName(
      'header'
    ) as HTMLCollectionOf<HTMLElement>;
    templateClass[0].style.display = 'block';
    let footerClass = document.getElementsByTagName(
      'footer'
    ) as HTMLCollectionOf<HTMLElement>;
    footerClass[0].style.display = 'block';
    let breadcrumbClass = document.getElementsByClassName(
      'BottomHeaderSlot'
    ) as HTMLCollectionOf<HTMLElement>;
    breadcrumbClass[0].style.display = 'block';
    this.isMobile = CommonUtils.isMobile();
    this.accountDropDownStateService.getCartValue().subscribe((data) => {
      this.cartValue = data;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 767) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  getListTradeAccounts(result) {
    if (result.children && result.children.length === 0) {
    }
    result.children.sort((book1, book2) => {
      return this.compareObjects(book1, book2, 'name');
    });
    this.accountList = result.children.filter(
      (x) => x.unitType != 'ACCESS_ACCOUNT'
    );
    result.children.forEach((element) => {
      if (element.isPrimaryAccount && !element.selected) {
        this.findStoreService.setPrimaryAccountUID(element.uid);
      }
      if (element.selected) {
        this.selectedName$.next(element.name);
        localStorage.setItem('selectedIUID', element.uid);
        if (localStorage.getItem('branchDetails')) {
          const obj = localStorage.getItem('branchDetails');
          this.selectedLocationName = JSON.parse(obj).name;
          let phone = '';
          if (JSON.parse(obj)?.address?.phone) {
            phone = JSON.parse(obj).address?.phone;
            phone = phone.replace(/\s/g, '');
            this.phoneNumber =
              phone.substring(0, 2) +
              ' ' +
              phone.substring(2, 6) +
              ' ' +
              phone.substring(6, phone.length);
          }
          this.geoPoint = JSON.parse(obj);
        } else {
          localStorage.setItem(
            'branchDetails',
            JSON.stringify(element.selected_pos)
          );
          const obj = localStorage.getItem('branchDetails');
          this.selectedLocationName = JSON.parse(obj).name;
          let phone = '';
          if (JSON.parse(obj)?.address?.phone) {
            phone = JSON.parse(obj).address?.phone;
            phone = phone.replace(/\s/g, '');
            this.phoneNumber =
              phone.substring(0, 2) +
              ' ' +
              phone.substring(2, 6) +
              ' ' +
              phone.substring(6, phone.length);
          }
          this.geoPoint = JSON.parse(obj);
        }
        this.homeBranchData = element.branch_pos;
        this.findStoreService.setGeoPoint(this.geoPoint);
        localStorage.setItem(
          'homeBranchInfo',
          JSON.stringify(this.homeBranchData)
        );
        this.findStoreService.setHomeBranchData(this.homeBranchData);
      }
    });
    this.userProfileDetailsService.setCheckPermissions();
  }
  compareObjects(object1, object2, key) {
    const obj1 = object1[key].toUpperCase();
    const obj2 = object2[key].toUpperCase();

    if (obj1 < obj2) {
      return -1;
    }
    if (obj1 > obj2) {
      return 1;
    }
    return 0;
  }

  changeAccount(i, content, data) {
    this.uidSelected = data;
    this.accountIdSelected = i;
    this.contentData= content;
   this.pageState = this.commonService.getPage();
    if(this.currentUrl == '/tpRequestQuotePage' && this.pageState == true){
      this.openModalQuote();
    }
    else{
      if (this.cartValue?.entries?.length > 0) {
        this.modalRef = this.modalService.open(content, {
          windowClass: 'accountSwitch',
          centered: true,
          size: 'lg',
        });
      } else {
        this.switchAccount(true);
      }
    }
  }

  openModalQuote(){
  
    this.modalRef = this.modalService.open(ChnageQuotePopupComponent, {
      windowClass: 'ChnageQuotePopup',
      centered: true,
      size: 'lg',
    });
    this.modalRef.componentInstance.selectedChoice = true;
    this.modalRef.result.then((result) => {
      // console.log("Result Quote:", result)
      if(result){
        if (this.cartValue?.entries?.length > 0) {
          this.modalRef = this.modalService.open(this.contentData, {
            windowClass: 'accountSwitch',
            centered: true,
            size: 'lg',
          });
        } else {
          this.switchAccount(true);
        }
      }
    })
  }

  changeChildAccount(i, content, data) {
    this.uidSelected = data.children[i];
    this.accountIdSelected = i;
    if (this.cartValue?.entries?.length > 0) {
      this.modalRef = this.modalService.open(content, {
        windowClass: 'accountSwitch',
        centered: true,
        size: 'lg',
      });
    } else {
      this.switchAccount(true);
    }
  }

  openFindStore(content) {
    this.commonService.show()
    this.findStoreService.setGeoPoint(this.geoPoint);
    this.findStoreService.setHomeBranchData(this.homeBranchData);
    this.modalRef = this.modalService.open(content, {
      windowClass: 'branch',
      centered: false,
      size: 'lg',
    });
  }

  phoneNumberClicked() {
    (<any>window).dataLayer.push({
      event: 'Phone Click',
      eventCategory: 'Phone',
      //  'eventAction':window.location.href, //Pass the URL of the screen from where user clicked on the Phone
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
              localStorage.setItem('selectedIUID', this.uidSelected.uid);
              localStorage.setItem(
                'branchDetails',
                JSON.stringify(this.uidSelected.selected_pos)
              );
              window.location.reload();
            } else {
            }
          })
      );
    } else {
      this.modalService.dismissAll();
    }
  }

  onDropdownClick() {
      this.isOpen = !this.isOpen;
    
  }

  

  accountSelect() {
    this.isOpen = !this.isOpen;
  }

  menuClick() {
    this.openMenu = !this.openMenu;
    this.openMenubg = !this.openMenubg;
  }

  mobileCloseMenu() {
    this.shareEvents.contactCustomerServicePopupMobileSendEvent();
  }

  openMobileMenu(content) {
    this.accountDropDownStateService.setNavData(true);
    this.modalRef = this.modalService.open(content, {
      windowClass: 'mobile-menu',
      centered: false,
      size: 'sm',
    });
  }
}

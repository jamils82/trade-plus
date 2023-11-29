import { FindStoreService } from 'src/app/core/service/findStore.service';
import { CreateAccountService } from 'src/app/core/service/createAccount.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { LogoutService } from 'src/app/core/service/logout.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { User } from '@spartacus/user/account/root';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { filter } from 'rxjs/operators';
import { ChnageQuotePopupComponent } from '../request-quote-mod/requestquote/chnage-quote-popup/chnage-quote-popup.component';
@Component({
  selector: 'app-topaccount',
  templateUrl: './topaccount.component.html',
  styleUrls: ['./topaccount.component.scss']
})
export class TopaccountComponent implements OnInit {

  logoutURL = environment.auth0Domain + "/logout";
  urlSafe: SafeResourceUrl
  isMobile: boolean = false;
  modalRef: any;
  emailId;
  pageState: any;
  user$: Observable<User | undefined>;
  iframeRef: any;
  previousUrl: string;
  helpsetion:boolean = false;
  currentUrl: string;

  constructor(
    private fiUserAccountDetailsService: FIUserAccountDetailsService, 
     private logoutService: LogoutService,
     private auth: AuthService,
    private createAccountService: CreateAccountService,
    private findStoreService: FindStoreService,
    private modalService: NgbModal,
     public sanitizer: DomSanitizer,
     private router: Router,
     public commonService: CommonService,
    ) {}

  ngOnInit(): void {
    
    this.isMobile = CommonUtils.isMobile();
    this.user$ = this.fiUserAccountDetailsService.getUserAccount();
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.logoutURL);
    this.currentUrl = this.router.url;
    this.previousUrl = null;
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
      // console.log("prev: ", this.previousUrl)
      // console.log("curr: ", this.currentUrl)
        }) 
  }

  logout(content) {
    this.fiUserAccountDetailsService.getUserAccount().subscribe((data)=>{
      this.emailId = data.uid;
    })
    this.findStoreService.getPrimaryAccountUID().subscribe(
      result => {
        if(result) {
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

  openFiltersPopup(content) {
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg', backdropClass: 'logout-popup' });
  }

  navigateToAccount() {
    this.pageState = this.commonService.getPage();
    if(this.currentUrl == '/tpRequestQuotePage' && this.pageState == true){
      this.openModalQuote();
    }
    else{
      this.router.navigate(['/preferencesPage'])
    }
   
  }
  toggleHelp(){

    this.helpsetion = !this.helpsetion;
  }
  openDropdown(){
    this.helpsetion = false;
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
        this.router.navigate(['/preferencesPage']);
      }
    })
  }

}

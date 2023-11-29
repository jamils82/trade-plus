import { AuthService } from '@auth0/auth0-angular';
import { LogoutService } from 'src/app/core/service/logout.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CmsService } from '@spartacus/core';
import { AccountPrefService } from 'src/app/core/service/accountPref.service ';
import { CreateAccountService } from 'src/app/core/service/createAccount.service';
import { Auth0TokenService } from 'src/app/core/service/token.service'
import { environment } from "src/environments/environment"
import { CommonService } from 'src/app/core/service/CommonService/common.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit, OnDestroy {

  //fbb2bUserObject = {"digitalID":"3454535334543","email":"varathar7@gmail.com","firstName":"test1208","lastName":"testlastname1208","mobileNumber":"1234567890"}
  // fbb2bUserObject = {"digitalID":"","email":"","firstName":"","lastName":"","mobileNumber":""}
  modal;
  btn;
  span;
  cloudModal: any;
  accordions: any;
  linkTradeAccountObject: any;
  buttonDisable: boolean = true;
  acceptTermsAndCondtionValue: boolean = true;
  acceptNotificationValue: boolean = true;
  serviceErrMessage: string
  decodeToken: any = this.auth0TokenService.getDecodeToken()
  infoMessage: any;
  successInd: boolean = false;
  errorInd: boolean = false;
  signInUrl;
  connectionStatus: string;
  connectionDesc: any = '';
  selectedOption: any = '';
  contactUSDetail:boolean = true;
  iconDown:boolean = false;
  iconUp:boolean = true;
  seletedIndex: number;
  constructor(private cmsService: CmsService,
    private createAccountService: CreateAccountService,
    private auth0TokenService: Auth0TokenService,
    private accountPrefService: AccountPrefService,
    private router: Router,
    private auth: AuthService,
    private logoutService: LogoutService,
    private commonService: CommonService) {
  }

  ngOnInit(): void {
    if (this.router.url.indexOf('linkAccount') > -1) {
      let templateClass = document.getElementsByTagName("header") as HTMLCollectionOf<HTMLElement>;
      templateClass[0].style.display = "none";
      let footerClass = document.getElementsByTagName("footer") as HTMLCollectionOf<HTMLElement>;
      footerClass[0].style.display = "none";
      let breadcrumbClass = document.getElementsByClassName("BottomHeaderSlot") as HTMLCollectionOf<HTMLElement>;
      if (breadcrumbClass[0] != undefined) {
        breadcrumbClass[0].style.display = "none";
      }
      document.querySelector('body')?.classList.add('createAccount');
    }
    console.log("Tocken:", this.decodeToken.email)
    if (this.validateEmail(this.decodeToken.email)) {
      this.getListTradeAccounts(this.decodeToken.email);

    }
  }
  //email Validation function
  validateEmail(email) {
    const re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    return re.test(String(email).toLowerCase());
  }

  //ListTradeAccounts Function once the createUser response is successful
  getListTradeAccounts(data) {
    const listTradeAccountObject = {
      "email": data
    }
    this.createAccountService.getListTradeAccountsAPICall(listTradeAccountObject).subscribe(
      result => {
        if (result.tradeAccounts && result.tradeAccounts.length === 0) {
          this.infoMessage = "The number entered is <b><u> not linked to an account</u></b>. Please check the number or contact your branch manager and ask them to check your profile."
          this.errorInd = true
        }
        this.accordions = result.tradeAccounts;
      },
      error => {
        this.infoMessage = "The number entered is <b><u> not linked to an account</u></b>. Please check the number or contact your branch manager and ask them to check your profile."
        this.errorInd = true
      })
      console.log("Accordionssssssss:", this.accordions)
  }

  // get the object of the selected Account
  accountValue(value, index) {
    console.log("Accordion val:", value)
    this.seletedIndex = index;
    console.log(index,this.seletedIndex);
    this.linkTradeAccountObject = value;
    if (this.linkTradeAccountObject != undefined && this.acceptTermsAndCondtionValue == false) {
      this.buttonDisable = false;
    }
    else {
      this.buttonDisable = true;
    }
  }

  // enable and disable button when terms and conditions checkbox is checked or unchecked
  acceptTermsAndConditions() {
    this.acceptTermsAndCondtionValue = !this.acceptTermsAndCondtionValue;
    if (this.linkTradeAccountObject != undefined && this.acceptTermsAndCondtionValue == false) {
      this.buttonDisable = false;
    }
    else {
      this.buttonDisable = true;
    }
  }
  acceptNotifications() {
    this.acceptNotificationValue = !this.acceptNotificationValue;
  }

  // linkTradeAccount API call is made once we click the sign up button
  linkTradeAccounts() {
    this.modal = document.getElementById("myModal");
    this.btn = document.getElementById("btn");
    this.span = document.getElementsByClassName("close-popup-btn")[0];

    const linkTradeAccountObject = {
      "accountId": this.linkTradeAccountObject.uid,
      "emailId": this.decodeToken.email,
      "isAccountOwner": true,
      "subscribed": this.acceptNotificationValue
    }
    this.createAccountService.linkTradeAccountsAPICall(linkTradeAccountObject).subscribe(
      result => {
        this.router.navigate(['/success']);
      },
      error => {
        this.infoMessage = "Link Account Failed"
        this.errorInd = true
        this.errorInd = true;
        // this.infoMessage = error.error.errors[0].message ;
      })
  }
  closeErrorMessage() {
    this.errorInd = false;
    this.successInd = false;
  }

  closePopup() {
    // document.location.href = '/';
    this.modal.style.display = "none";
    this.accountPrefService.cloudIntIntialService().subscribe((data: any) => {
      if (data) {
        this.cloudModal = document.getElementById("cloudModal");
        if (data.partners[0].connectionStatus == 'A') {
          this.cloudModal.style.display = "block";
        } else {
          document.location.href = '/';
        }
        this.connectionStatus = data.partners[0].connectionStatus == 'I' ? 'A' : data.partners[0].connectionStatus;
        this.connectionDesc = data.partners[0].description;
      } else {
        document.location.href = '/';
      }
    });
  }
  yesCloudPopup() {
    document.location.href = '/';
    this.cloudModal.style.display = "none";
  }

  noCloudPopup() {
    if (this.connectionDesc != '') {
      let data: string;
      if (this.connectionDesc == 'MYOB') {
        data = '&partnerCode=MYB&partnerDesc=MYOB';
      } else if (this.connectionDesc == 'XERO') {
        data = '&partnerCode=FER&partnerDesc=FERGUS';
      } else if (this.connectionDesc == 'FERGUS') {
        data = '&partnerCode=XRO&partnerDesc=Xero';
      }
      this.accountPrefService.xeroCloudIntegration('D', this.decodeToken.email, data).subscribe((data) => {
        if (data != undefined) {
          const isError: boolean = data == '200' ? false : true;
          document.location.href = '/';
          this.cloudModal.style.display = "none";
        }
      }, (error) => {
        document.location.href = '/';
        this.cloudModal.style.display = "none";
      });
    } else {
      document.location.href = '/';
      this.cloudModal.style.display = "none";
    }
  }
  returnToSignIn() {
    this.signInUrl = environment.UIsiteURl;
    this.logoutService.logoutRevoke().subscribe(() => {
      this.auth.logout({ returnTo: environment.UIsiteURl + '/tlAuthLandingPage' });
      sessionStorage.clear();
      localStorage.clear();
    })
  }
  NeedHelp(){
    this.iconDown = !this.iconDown;
    this.iconUp = !this.iconUp;
    this.contactUSDetail = !this.contactUSDetail;
  }
  
  ngOnDestroy() {
    document.querySelector('body')?.classList.remove('createAccount');
  }
}

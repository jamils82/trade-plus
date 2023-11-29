import { CommonUtils } from './../../../core/utils/utils';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountPaymentService } from 'src/app/core/service/account-payments.service';
import { AccountService } from 'src/app/core/service/account.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { environment } from 'src/environments/environment';
import { CmsService } from '@spartacus/core';
export let transactionOTP: any = '';

@Component({
  selector: 'app-custom-account-payments',
  templateUrl: './custom-account-payments.component.html',
  styleUrls: ['./custom-account-payments.component.scss'],
})
export class CustomAccountPaymentsComponent implements OnInit {
  forInputEnable: string = '';
  accountSummaryData: any = {};
  paymentDues: any = [];
  public PaymentOTP: any = transactionOTP;
  expanded = { l1: -1 };
  selectAmount: any;
  paymentOptions: any;
  enableButton: boolean;
  savedCardInfo: any;
  amountObj: any;
  customAmount: any;
  isCustom: any;
  dueThisMonth: any = 0.00;
  overDue: any = 0.00;
  totalOutStanding: any = 0.00;
  isAmountValid: any;
  emailId: string = '';
  paymentHistory: any = [];
  isMobile: boolean = false;
  constructor(
    public dialog: MatDialog,
    private accountPaymentService: AccountPaymentService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.accountService
          .getAccountBalance(this.emailId)
          .subscribe((data) => {
            if (data) {
              this.accountSummaryData = data;
              this.paymentDues = data.ageingValues;
              this.overDue = this.accountSummaryData.balanceOverDueInvoices;
              this.dueThisMonth = this.accountSummaryData.balanceDueInvoices;
              this.totalOutStanding = this.accountSummaryData.balanceOpenValues;
            }
          });
      }
    });
    this.accountService.getPaymentHistory().subscribe((data) => {
      if (data && data.paymentHistory && data.paymentHistory.length > 0) {
        this.paymentHistory = data.paymentHistory;
      }
    });
    let cardInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.savedCardInfo = cardInfo.savedCards;
  }
  isRadioChecked;
  maskingCard(cardNo: string) {
    return cardNo.replace(cardNo.substr(0, 6), 'XXXXXX');
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 43 &&
      charCode === 32
    ) {
      return false;
    }
    this.isRadioChecked = true;
    this.selectAmount = "customAmount";
    return true;
  }

  negativeConverter(value) {
    let val: any = parseFloat(value).toFixed(2);
    if (/\-/g.test(val)) {
      let isMinus = val.split('-')[1];
      let valReturn = '-$' + parseFloat(isMinus).toLocaleString(undefined, {minimumFractionDigits: 2});
      return valReturn;
    } else {
      let valReturn = '$' + parseFloat(value).toLocaleString(undefined, {minimumFractionDigits: 2});
      return valReturn;
    }
  }

  negativeConverterPayments(value) {
    let val: any = parseFloat(value).toFixed(2);
    if (/\-/g.test(val)) {
      let isMinus = val.split('-')[1];
      let valReturn = '-' + parseFloat(isMinus).toLocaleString(undefined, {minimumFractionDigits: 2});
      return valReturn;
    } else {
      let valReturn = parseFloat(value).toLocaleString(undefined, {minimumFractionDigits: 2});
      return valReturn;
    }
  }

  changeValTest(valu: string) {
    if(valu == 'Successful') {
      return valu.replace('Successful', 'Success')
    } else {
      return valu
    }
  }
  isSave: boolean = false;
  payNowDialog() {
    this.enableButton = false;
    let userIDVal = JSON.parse(localStorage.getItem('userInfo'));
    let isNew = this.paymentOptions == 'New Credit Card';
    let customerNum = localStorage.getItem('selectedIUID');
    this.amountObj = {
      customer: 'tradelink-spa_' + customerNum,
      invoice: [{ code: '', amount: '', status: '' }],
      paymentAmount: this.isAmountValid,
      userId: 'tradelink-spa_' + userIDVal?.uid,
      cardNumber: isNew ? '' : this.paymentOptions,
      newCard: isNew ? true : false,
      saveCard: isNew ? this.isSave : false,
    };
    this.accountPaymentService
      .getIframeOTP(this.amountObj)
      .subscribe((response) => {
        this.dialog.open(PayNowComponent, {
          width: '778px',
          height: '318px',
          panelClass: 'pay-now-dialog',
          data: {
            transactionData: response,
            newOrExistingCard:
              this.paymentOptions == 'New Credit Card' ? 'New' : 'Old',
          },
        });
      });

    this.dialog._getAfterAllClosed().subscribe((data) => {
      this.payButtonEnable();
      if (sessionStorage.getItem('PaymentTransactionStatus') == 'true') {
        sessionStorage.removeItem('PaymentTransactionStatus');
        document.location.reload();
      }
    });
  }
  otherPaymentDialog() {
    this.dialog.open(OtherPaymentOptionComponent, {
      width: '778px',
      height: 'fit-content',
      panelClass: 'other-payment-dialog',
    });
  }

  merchantDialog() {
    this.dialog.open(MarchantFeesComponent, {
      width: '868px',
      height: 'fit-content',
      panelClass: 'merchant-fees-dialog',
    });
  }

  payButtonEnable() {
    if (this.paymentOptions !== undefined && this.selectAmount && this.isAmountValid !== null 
      && this.isAmountValid !== 0 && this.isAmountValid !== undefined) {
      this.enableButton = true;
    //  this.enableButton = this.isAmountValid == null ? false : true;
    }
    else {
      this.enableButton = false;
    }
  }
}

// For Pay Now button
@Component({
  selector: 'app-custom-pay-now',
  templateUrl: './custom-pay-now.component.html',
  styleUrls: ['./custom-account-payments.component.scss'],
})
export class PayNowComponent implements OnInit {
  paymentIframeURL: any = '';
  constructor(
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.generateIframeURL();
  }

  closePopup() {
    this.dialog.closeAll();
  }
  generateIframeURL() {
    // preparing URL with Transaction OTP
    if (this.data.newOrExistingCard == 'New') {
      this.paymentIframeURL = `${environment.paymentURL}?TransactionId=${this.data.transactionData.transactionReference}`;
    } else {
      let savedCardPaymentURL =
        environment.UIsiteURl +
        '/tradeLink-spa' +
        this.data.transactionData.paymentRedirectUrl;
      this.paymentIframeURL = savedCardPaymentURL;
    }
    // sanitizing payment iframe URL Endpoints using DomSanitizer
    this.paymentIframeURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.paymentIframeURL
    );
  }
}

// For Other Payment Option
@Component({
  selector: 'app-other-payment-option',
  templateUrl: './other-payment-option.component.html',
  styleUrls: ['./custom-account-payments.component.scss'],
})
export class OtherPaymentOptionComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
  close() {
    this.dialog.closeAll();
  }
}

// For Other MERCHANT FEES
@Component({
  selector: 'app-marchant-fees',
  templateUrl: './marchant-fees.component.html',
  styleUrls: ['./custom-account-payments.component.scss'],
})
export class MarchantFeesComponent implements OnInit {
  popUpData: any;
  constructor(
    public dialog: MatDialog,
    private cmsService: CmsService) {}

  ngOnInit(): void {
    this.cmsService.getComponentData("TPMerchantFeesComponent").subscribe((data) => {
      this.popUpData = data;
    })
  }

  close() {
    this.dialog.closeAll();
  }
}

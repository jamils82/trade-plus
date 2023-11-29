import { Component, Input, OnInit } from '@angular/core';
import {
  Router
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
@Component({
  selector: 'app-account-left-nav',
  templateUrl: './account-left-nav.component.html',
  styleUrls: ['./account-left-nav.component.scss']
})
export class AccountLeftNavComponent implements OnInit {
  prefTypeNum = 1
  @Input() selectedTab = '1true';
  public disablePrices = new BehaviorSubject<boolean>(false);
  public disableQuotes = new BehaviorSubject<boolean>(false);
  public disablePayments = new BehaviorSubject<boolean>(false);
  public disableInvoice = new BehaviorSubject<boolean>(false);
  public prices = false;
  public quotes = false;
  public payments = false;
  public invoice = false;
  constructor(private router: Router,
    public userProfileDetailsService: FIUserAccountDetailsService) { }

  async ngOnInit() {
    await this.getPermissionsStatuses();
    if (this.selectedTab == "statements") {
      document.getElementById('menu-items').scrollLeft = 380;
    }
    else if (this.selectedTab == "quotes") {
      document.getElementById('menu-items').scrollLeft = 580;
    }
    else if (this.selectedTab == "pricefile") {
      document.getElementById('menu-items').scrollLeft = 400;
    }
    else if (this.selectedTab == "download") {
      document.getElementById('menu-items').scrollLeft = 450;
    }
    else if (this.selectedTab == "invoices") {
      document.getElementById('menu-items').scrollLeft = 220;
    }
    else if (this.selectedTab == "payments") {
      document.getElementById('menu-items').scrollLeft = 140;
    }
  }

  pageNavigate(url: string) {
    sessionStorage.removeItem("dateFilter");
   // window.open(url, "_self");
    if ((url == 'upcomingPriceChanges' || url == 'priceFiles' || url == 'priceFilesPage' || url == 'downloadFilesPage') && !this.prices) {
      return;
    } else if (url == 'quotesPage' && !this.quotes) {
      //window.open(url, "_self");
      return;
    } else if ((url == 'accountPage' || url == 'paymentPage' ) && !this.payments) {
      return;
    } 
    else if ((url == 'invoicePage' || url == 'statementsPage' ) && !this.invoice) {
      return;
    } 
    else {
      this.router.navigate([('/' + url)])
    }
  }
  async getPermissionsStatuses() {
    const disablePrices$ = await this.userProfileDetailsService.isPricingPermission();
    const disableQuotes$ = await this.userProfileDetailsService.isPlaceOrdersPermission();
    const disablePayments$ = await this.userProfileDetailsService.isAccountManagementPermission();
    const disableInvoice$ = await this.userProfileDetailsService.isAccountManagementInvoicePermission();
    // console.log("Behave Invoice:", disableInvoice$)
    this.prices = disablePrices$;
    this.invoice = disableInvoice$;
    // console.log("Invoice:", this.invoice)
    this.quotes = disableQuotes$;
    // console.log("Quotes:", this.quotes)
    this.payments = disablePayments$;
    this.disablePrices.next(!disablePrices$);
    this.disableQuotes.next(!disableQuotes$);
    this.disablePayments.next(!disablePayments$);
  }

}

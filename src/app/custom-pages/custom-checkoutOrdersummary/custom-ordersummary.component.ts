import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { checkoutService } from 'src/app/core/service/checkout.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';

@Component({
  selector: 'app-custom-order-summary',
  templateUrl: './custom-ordersummary.component.html',
  styleUrls: ['./custom-ordersummary.component.scss'],
})
export class CustomOrderSummaryComponent {
  userActivity;
  userInactive: Subject<any> = new Subject();
  successInd$ = new BehaviorSubject<boolean>(false);
  errorInd: boolean = false;
  isDisabled: boolean = false;
  public infoMessage: string = `Due to the delay since you first selected ‘Checkout’ the pre-populated date and time may have updated to ensure we can meet our customer promise.  Please check these are still suitable or select Edit to adjust.`;
  currentUrl: string;
  prevUrl: any;

  constructor(
    public router: Router,
    public checkoutService: checkoutService,
    public commonService: CommonService
  ) {
    this.currentUrl = this.router.url;
        this.prevUrl = null;
        this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
          this.prevUrl = this.currentUrl;
          this.currentUrl = event.urlAfterRedirects;
          localStorage.setItem('prevBrowseUrl', this.prevUrl)
          // console.log("prev: ", this.previousUrl)
          // console.log("curr: ", this.currentUrl)
            }) 
    this.commonService.show();
    this.setTimeout();
    this.userInactive.subscribe(() => {
      this.isDisabled = true;
      this.errorInd = true;
    });
  }
  public deliveryCompData: any;

  closeSuccessMsg() {
    this.errorInd = false;
    // this.router.navigateByUrl('orderCheckoutPage');
    // this.successInd$.next(false);
  }

  setTimeout() {
    this.userActivity = setTimeout(
      () => this.userInactive.next(undefined),
      300000
    );
  }

  backClick(): void {
    this.router.navigateByUrl('orderCheckoutPage');
  }

  created(args: any): void {
    this.deliveryCompData = args;
  }

  placeOrder(): void {
    console.log("Data::::", JSON.stringify(this.deliveryCompData))
    this.commonService.show();
    // console.log("deliveryCompData place order",JSON.stringify(this.deliveryCompData));
    clearTimeout(this.userActivity);
    localStorage.setItem('TypeOfConfirm', 'confirmationDelivery');
    localStorage.removeItem('isPreState');
    this.checkoutService.placeOrder(this.deliveryCompData).subscribe((data) => {
      this.commonService.hide();
      localStorage.setItem('orderId', data.code);
      location.href = `/orderConfirmation?isDelivery=${this.deliveryCompData.deliveryMode}`;
    });
  }
}

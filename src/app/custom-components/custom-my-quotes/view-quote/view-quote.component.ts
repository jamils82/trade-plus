import { CommonUtils } from './../../../core/utils/utils';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { QuotesService } from 'src/app/core/service/quotes.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { filter } from 'rxjs/operators';
import { UserProfileDetailsService } from 'src/app/core/service/userprofileDetails.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';

@Component({
  selector: 'app-view-quote',
  templateUrl: './view-quote.component.html',
  styleUrls: ['./view-quote.component.scss']
})


export class ViewQuoteComponent implements OnInit {
  @Input() quoteDetailViewData;
  quoteDetailViewList: any;
  selectedQuoteCheckoutData:any;
  isMobile: boolean = false;
  emailId: any;
  comments:any;
  selectedUID: any;
  selectedQuoteData: any;
  previousUrl: string;
  currentUrl: string;
  quoteQuantity: any;
  address: string;

  constructor(private router: Router,
    private quotesService: QuotesService,
    public commonService: CommonService,
    public userProfileDetailsService : FIUserAccountDetailsService,
    public route: Router,) { }

  ngOnInit(): void {
    this.selectedUID = localStorage.getItem('selectedIUID');
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
       // this.redirectToCheckout('5037719');
      }
    });
    this.isMobile = CommonUtils.isMobile();
    this.quoteDetailViewList = this.quoteDetailViewData;
    //console.log("this.quoteDetailViewData",JSON.stringify(this.quoteDetailViewData));
    if(this.quoteDetailViewList.deliveryAddress.address4 != undefined){
      this.address = this.quoteDetailViewList.deliveryAddress.formattedAddress.split(',')[0] + ',' + this.quoteDetailViewList.deliveryAddress.line2 + "," + this.quoteDetailViewList.deliveryAddress.address3 + "," +
      this.quoteDetailViewList.deliveryAddress.address4 + "," + this.quoteDetailViewList.deliveryAddress.town + "," +
      this.quoteDetailViewList.deliveryAddress.postalCode + "," + this.quoteDetailViewList.deliveryAddress.region.name;   
    }
    else{
      this.address = this.quoteDetailViewList.deliveryAddress.formattedAddress.split(',')[0] + ',' + this.quoteDetailViewList.deliveryAddress.line2 + "," + this.quoteDetailViewList.deliveryAddress.address3 + "," +
      '' + "," + this.quoteDetailViewList.deliveryAddress.town + "," +
      this.quoteDetailViewList.deliveryAddress.postalCode + "," + this.quoteDetailViewList.deliveryAddress.region.name;   
  
    }

    this.comments = this.quoteDetailViewList.customerInstructions;
    for(var i=0; i<this.quoteDetailViewList.entries.length; i++){
      this.quoteQuantity = this.quoteDetailViewList.entries[i].quantity;
      this.commonService.setData(this.quoteQuantity);
    }    

    this.currentUrl = this.route.url;
  //  console.log("URL:", this.currentUrl)
   this.commonService.setUrl(this.currentUrl);
  }

  status(status) {
    if (status == 'ACTIVE' || status == 'Active')
        return {
            background: '#e4f2e7',
            color: '#0B961B',
            width: '130px',
            Text: 'center'
        };
    else if (status == 'EXPIRED')
        return {
            background: '#fcedef',
            color: '#973937',
            width: '130px',
            Text: 'center'
        };
        else if (status == 'SUBMITTED')
        return{
            background: '#DBECFF',
            color: '#003D7A',
            width: '130px',
            Text: 'center'
        }
        else if (status == 'PENDING')
        return{
            background: '#FFF6C7',
            color: '#E39500',
            width: '130px',
            Text: 'center'
        }
        else if (status == 'BUYER_ORDERED' || status == 'CONVERTED')
        return{
            background: '#E5E5E5',
            color: '#CDCDCD',
            width: '130px',
            Text: 'center',
            cursor: 'context-menu'
        }
    else return { background: 'grey', color: '#973937' };
}

  backClicked() {
    window.location.reload();
  }

  redirectToQuote(event, quoteValue){
    // console.log(event)
    // alert("2nd click")
    // console.log("quoteValue",quoteValue);
    event.stopPropagation();
    this.quotesService.getExpiredQuoteNum(quoteValue).subscribe(result => {
        if(result){
            this.selectedQuoteData = result.entries;      
        }
        // console.log("Selected Quote Entries:", JSON.stringify(this.selectedQuoteData)) 
        if(this.selectedQuoteData != undefined){
            this.router.navigate(['/tpRequestQuotePage']);
            this.commonService.setData(this.selectedQuoteData);     
            }

    })  
}

redirectToCheckout(codeQuote,event) {
        
      event.stopPropagation();
      this.selectedUID = localStorage.getItem('selectedIUID');
    const data = {
      userId: this.selectedUID,
      email: this.emailId,
        };
  //  console.log("email data",JSON.stringify(data));
 this.quotesService.getActiveQuotesDetailQDPData(data,codeQuote,this.comments).subscribe((result) => {
     if (result) {
      // console.log("result",result);
      // let productIds = [];
        // let productNames = [];
        result.entries.forEach(element => {
          // productIds.push(element?.product?.code);
          // productNames.push(element?.product?.name);
          (<any>window).dataLayer.push({
            'event':'ATC ClicK',
            'eventCategory':'Add To Cart',
            'eventAction': 'action', //Pass the product title
            'productId': element?.product?.code,
            'producName': element?.product?.name,
            'sku': element?.product?.code
          });
        });
        this.selectedQuoteCheckoutData = result;
        if(this.selectedQuoteCheckoutData != undefined){
        this.commonService.setQlpFlag('QDP');
        if(this.comments) {
          localStorage.setItem("comments", this.comments);
        }
        else {
          localStorage.setItem("comments", '');
        }
        //   (<any>window).dataLayer.push({
      //     'event':'ATC ClicK',
      //     'eventCategory':'Add To Cart',
      //     'eventAction': 'action', //Pass the product title
      //     'productId': productIds,
      //     'producName': productNames,
      //     'sku': productIds
      // });
         this.commonService.setQdpQuoteData(this.selectedQuoteCheckoutData);
        this.router.navigate(['/orderCheckoutPage']);
        }
        

         // this.quoteDetailViewData = data;
         // this.checkoutDeatilViewData = data.purchaseOrderNumber;
         // this.commonService.setCheckoutData(this.checkoutDeatilViewData);
         // this.router.navigate(['/orderCheckoutPage']);
         
     }
 })

 


}

}

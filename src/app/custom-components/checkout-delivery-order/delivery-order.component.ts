import { ActiveCartService } from '@spartacus/core';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { checkoutService } from 'src/app/core/service/checkout.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'delivery-order',
  templateUrl: './delivery-order.component.html',
  styleUrls: ['./delivery-order.component.scss'],
})
export class DeliveryOrderComponent implements OnInit {
  @Input() deliveryData: any;

  @Input() isSelectButton: any;

  @Output() created = new EventEmitter<any>(true);

  cartItemsData: any;
  cartDataObj: any;
  updatedTime: any;
  emailId: any;
  previousUrl:any;
  displayData: any;
  displayAddress: any;
  branchId: any;
  getCheckoutQuoteData:any;
  addressVal: any;
  public isDeliveryBox: any;
  public orderRef: string;
  manualAddress: string;
  mode: boolean = true;
  public defaultRequestTime: any;
  mytime: any
  constructor(
    public route: Router,
    public router: ActivatedRoute,
    protected activeCartService: ActiveCartService,
    public cd: ChangeDetectorRef,
    public commonService: CommonService,
    public checkoutService: checkoutService,
    public datePipe: DatePipe,
  ) {
    this.commonService.show();
  }

  ngOnInit(): void {
    this.isDeliveryBox = (this.router.queryParams as any).value.isDelivery;
    this.branchId = localStorage.getItem('branchID');
    this.previousUrl = localStorage.getItem('previousUrl');
    // alert(this.previousUrl);
    this.cd.markForCheck();
    if(this.previousUrl == '/quotesPage'){
      this.mode = false;
      this.getQuoteData();
    }
    else if(this.previousUrl == '/cart'){
      this.mode = true;
    this.getCartData();
    }
    this.manualAddress = window.localStorage.getItem('manualAddress');
    const confirmationData = JSON.parse(localStorage.getItem('cart-data'));
    const getBranchInfo = JSON.parse(localStorage.getItem('homeBranchInfo'));    
    this.updateGAFourDataLayer(confirmationData, getBranchInfo);
  }

  updateGAFourDataLayer(confirmationData:any, getBranchInfo:any){
    console.log(confirmationData);
    let GAtempdata = [];
    const getFulfilmentBranch = JSON.parse(localStorage.getItem('branchDetails'));
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    confirmationData.entries.forEach((val) => {
      GAtempdata.push({
        // List of productFieldObjects.
        'item_name': val?.product?.name, // Name
        'item_id': val?.product?.code, //SKU ID
        'price': val?.product?.price?.value,
        'item_brand': val?.product?.brand, //brand of product
        'item_category': val?.product?.tlCategories[0]?.name,
        'item_category_2': val?.product?.tlCategories[1]?.name,
        'item_category_3': val?.product?.tlCategories[2]?.name,
        'item_category_4': val?.product?.tlCategories[3]?.name ? val?.product?.tlCategories[2]?.name : '',
        'quantity': val.quantity.toString(),
        'item_variant': '', // If Variant Exists else left blank
        'item_totalQuantity': val.quantity.toString(),
        'item_stock': val.product.stock.stockLevelStatus,
       // 'added_from': 'PDP’,
       // 'item_list_name': 'PDP'
      });
    });

    let productDL = {
      'event': 'begin_checkout',
      'step': 3,
      'step_label': 'Order Summary - Load', 
      'feature_type': 'checkout flow',
      'fulfillment': this.isDeliveryBox == 'true' ? 'Delivery' : 'Pick Up',
      'parent_branch': getBranchInfo?.branchID,
      'fulfillment_branch': this.isDeliveryBox == 'true'  ? getFulfilmentBranch.branchID : '',
      'userId': userInfo.uid,
      'accountId': localStorage.getItem('selectedIUID'),
      ecommerce: {
        items: {
          'transaction_id': null,
          'value': confirmationData.totalPriceWithTax.value,
          'tax': confirmationData.totalTax.value,
          'currency':'NZD',
          items: GAtempdata,
        },
      },
    };

    (<any>window).dataLayer = (<any>window).dataLayer || [];
    console.log(productDL, 'productDL');
    (<any>window).dataLayer.push(productDL);
  }

  getCartData() {
    this.activeCartService.getActive().subscribe((data: any) => {
      if (data.entries && data.entries.length !=0 ) {
        localStorage.setItem('cart-data', JSON.stringify(data));
      } else {
        data = JSON.parse(localStorage.getItem('cart-data'));
      }
      this.cartItemsData = data.entries;
      this.cartDataObj = { ...data };
      this.cartDataObj.purchaseOrderNumber =
        this.isDeliveryBox == 'true'
          ? localStorage.getItem('orderRefDel')
          : localStorage.getItem('orderRefCC');

      if (data.accountId) {
        this.cartDataObj['deliveryMode'] = this.isDeliveryBox;
        this.cartDataObj['branchId'] = this.branchId;
        this.created.emit(this.cartDataObj);
        const tempData = {
          email: data.user.uid,
          deliveryMode: this.isDeliveryBox == 'true' ? 'Delivery' : 'Pick Up',
        };
        this.checkoutService
          .getCheckoutInfo(tempData)
          .subscribe((responseData) => {
            if (responseData != undefined) {
              this.displayData = responseData;
              if (
                localStorage.getItem('TypeOfConfirm') == 'confirmationDelivery'
              ) {
                this.displayData.requestedDate =
                  localStorage.getItem('requestedDate');
                this.displayData.requestedTime =
                  localStorage.getItem('requestedTime');
              } else {
                this.mytime = localStorage.getItem('updatedTime');
                this.displayData.requestedTime = this.mytime;
                localStorage.setItem(
                  'requestedDate',
                  this.displayData.requestedDate
                );
                localStorage.setItem(
                  'requestedTime',
                  this.displayData.requestedTime
                );
              }
              this.displayData.siteContacts = JSON.parse(
                localStorage.getItem('contactDetails')
              );
              this.commonService.hide();
            }
          });

        if (this.isDeliveryBox == 'false') {
          this.checkoutService
            .getBranchInfo(this.branchId)
            .subscribe((response: any) => {
              this.displayAddress = response.address;
            });
        } else {
          let tempValue: string = localStorage.getItem('deliveryFormatAddress');
          this.displayAddress = {
            formattedAddress: tempValue === 'undefined' ? null : tempValue,
          };
        }
      }
    });
  }
  
  getRoundMinTime(updatedTime) {
    var coff = 1000 * 60 * 30;
    return new Date(Math.ceil(updatedTime.getTime() / coff) * coff);
  }

  getQuoteData() {
    this.getCheckoutQuoteData = this.commonService.getAddressData();
      if (this.getCheckoutQuoteData && this.getCheckoutQuoteData.entries && this.getCheckoutQuoteData.entries.length !=0 ) {
        localStorage.setItem('cart-data', JSON.stringify(this.getCheckoutQuoteData));
      } else {
        this.getCheckoutQuoteData = JSON.parse(localStorage.getItem('cart-data'));
      }
      this.cartItemsData = this.getCheckoutQuoteData.entries;
      this.cartDataObj = { ...this.getCheckoutQuoteData };
      this.orderRef = this.cartDataObj.purchaseOrderNumber;
      this.cartDataObj.purchaseOrderNumber =
        this.isDeliveryBox == 'true'
          ? localStorage.getItem('orderRefDel')
          : localStorage.getItem('orderRefCC');
          
      if (this.getCheckoutQuoteData.accountId) {
        this.cartDataObj['deliveryMode'] = this.isDeliveryBox;
        this.cartDataObj['branchId'] = this.branchId;
        this.created.emit(this.cartDataObj);

        const tempData = {
          email: JSON.parse(localStorage.getItem('userInfo')).email,
          deliveryMode: this.isDeliveryBox == 'true'? 'Delivery' : 'Pick Up',
        };
        this.checkoutService
          .getCheckoutInfo(tempData)
          .subscribe((responseData) => {
            if (responseData != undefined) {
              this.displayData = responseData;
              if (
                localStorage.getItem('TypeOfConfirm') == 'confirmationDelivery'
              ) {
                this.displayData.requestedDate =
                  localStorage.getItem('requestedDate');
                this.displayData.requestedTime =
                  localStorage.getItem('requestedTime');
              } else {
                localStorage.setItem(
                  'requestedDate',
                  this.displayData.requestedDate
                );
                localStorage.setItem(
                  'requestedTime',
                  this.displayData.requestedTime
                );
              }
              this.displayData.siteContacts = JSON.parse(
                localStorage.getItem('contactDetails')
              );
              this.commonService.hide();
            }
          });

        if (this.isDeliveryBox == 'false') {
          this.checkoutService
            .getBranchInfo(this.branchId)
            .subscribe((response: any) => {
              this.displayAddress = response.address;
            });
        } else {
          let tempValue: string = localStorage.getItem('deliveryFormatAddress');
          this.displayAddress = {
            formattedAddress: tempValue === 'undefined' ? null : tempValue,
          };
        }
      }
    
  }

  commaSpace(value) {
    return value?.replaceAll(',', ', ');
  }

  edit(): void {
    this.route.navigateByUrl('orderCheckoutPage');
  }
}

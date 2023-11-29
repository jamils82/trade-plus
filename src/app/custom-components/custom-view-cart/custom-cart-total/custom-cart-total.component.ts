import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import {
  ActiveCartService, Cart, OrderEntry, PromotionLocation, SelectiveCartService,
  AuthService, RoutingService, MultiCartService
} from '@spartacus/core';
import { CartTotalsComponent } from '@spartacus/storefront';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-cart-total',
  templateUrl: './custom-cart-total.component.html',
  styleUrls: ['./custom-cart-total.component.scss']
})
export class CustomCartTotalComponent extends CartTotalsComponent implements OnDestroy {
  public cartList: any;
  modalRef: any;
  heading: string = '';
  infoMessage: string = '';
  totalPriceWithTax: number;
  previousUrl: string;
  public removeCartList: any = [];
  cart$: Observable<Cart>;
  entries$: Observable<any[]>;
  isMobile: boolean = false;
  placeOrderPermission: boolean = false;
  cartSubscription: Subscription;
  rejected = new BehaviorSubject<boolean>(false);
  poaProduct: boolean = false;
  constructor(activeCartService: ActiveCartService,
    protected selectiveCartService: SelectiveCartService,
    protected authService: AuthService,
    protected routingService: RoutingService,
    public modalService: NgbModal,
    private userProfileDetailsService: FIUserAccountDetailsService,
    private router: Router,
    private productHelpService: ProductHelpService,
    public commonService: CommonService,
    private multiCartService: MultiCartService) {
      super(activeCartService)
      this.previousUrl = router.url;
      this.commonService.setUrl(this.previousUrl);
   
  }

  ngOnInit() {
    this.getPermissionsStatus();
    this.isMobile = CommonUtils.isMobile();
    
    this.cart$ = this.activeCartService.getActive();
    this.entries$ = this.activeCartService
      .getEntries()
      .pipe(filter((entries) => entries.length > 0));
      this.entries$.subscribe(data => {
        // console.log("this.entries$", data);
        let count = 0;
        const selected = data.filter(element => {
          return (element.product.price?.formattedValue == 'POA' || element.product.price?.formattedValue == '$0.00')
          //   return true;
          // }
        });
        this.poaProduct = selected.length> 0 ? true: false
        data.forEach(element => {
          if(element.rejected == true) {
            count = 1;
          }
        });
        if(count == 1) {
          this.rejected.next(true);
        } else {
          this.rejected.next(false);
        }
      })
  }
  async getPermissionsStatus() {
    this.placeOrderPermission = await this.userProfileDetailsService.isPlaceOrdersPermission();
    this.cart$.subscribe((data) => {
      if (this.placeOrderPermission && data.totalPriceWithTax && data.totalPriceWithTax != undefined) {
        this.totalPriceWithTax = data.totalPriceWithTax.value;
      }
    })
  }
  clearCart() {
    this.commonService.show();
    this.activeCartService.getActiveCartId().subscribe(data => {
      let obj = {
        cartId: data
      }
      this.productHelpService.clearAllCart(obj).subscribe(data => {
        if(data)  {
          // this.activeCartService.getActive()
          this.multiCartService.reloadCart(data);
          this.activeCartService.isStable().subscribe((data) => {
            if (data) { 
              this.commonService.hide();
            }
          })    
        }
      })
    })
    // this.cartSubscription = this.entries$.subscribe((result) => {
    //   this.cartList = result;
    //   this.cartList.forEach(cartItem => {
    //     setTimeout(() => {
    //       this.activeCartService.removeEntry(cartItem);
    //     }, 500);
    //   });
    // });
    // this.removeCartList
    // forkJoin(this.removeCartList);
  }

  checkout(data: any) {
    if (this.userProfileDetailsService.isAccountOwnerPermission()) {
      this.router.navigate(['/orderCheckoutPage']);
    } else if ((this.userProfileDetailsService.getCreditLimit() == 0) && this.placeOrderPermission) {
      this.router.navigate(['/orderCheckoutPage']);
    }
    else if ((this.totalPriceWithTax > this.userProfileDetailsService.getCreditLimit()) && this.placeOrderPermission) {
      this.heading = 'ORDER LIMIT EXCEEDED';
      this.infoMessage = 'You have exceeded the order limit assigned by your manager or the account owner. Please, either speak with them about extending your limit, or revise the items in your Cart.';
      this.openPopup(data);
    } else if (!this.placeOrderPermission && !this.userProfileDetailsService.isAccountOwnerPermission()) {
      this.heading = 'UNAUTHORISED TO PLACE ORDERS';
      this.infoMessage = 'Sorry, you do not have authority to be able to place orders. Please contact your account owner or manager, who can change this for you.';
      this.openPopup(data);
    } else {
      this.router.navigate(['/orderCheckoutPage']);
    }
    this.updateDataLayerStep1();
  }
  updateDataLayerStep1 () {
    let GAEntriesdata = [];
    this.entries$.subscribe(entries=>{
      entries.forEach((val) => {
        GAEntriesdata.push({
          // List of productFieldObjects.
          item_name: val?.product?.name, // Name
          item_id: val?.product?.code, //SKU ID
          price: val?.product?.price?.value,
          item_brand: val?.product?.brand, //brand of product
          'item_category': val?.product?.tlCategories[0]?.name,
          'item_category_2': val?.product?.tlCategories[1]?.name,
          'item_category_3': val?.product?.tlCategories[2]?.name,
          'item_category_4': val?.product?.tlCategories[3]?.name ? val?.product?.tlCategories[3]?.name : '',
          'item_variant': '', // If Variant Exists else left blank
          quantity: val.quantity.toString(),
  
        });
      });
    })
    let productDL = {
      'event': 'begin_checkout',
      'step': 1,
      'step_label': 'Order Checkout - Load', 
      'feature_type' : 'checkout flow',
      'userId':'auth0 | guid',
      'accountId':localStorage.getItem('selectedIUID'),
      'ecommerce': {'purchase': {
        'currency':'AUD',
        'items' : GAEntriesdata,
      },}, 
    };
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push(productDL);
  }
  openPopup(data: any) {
    this.modalRef = this.modalService.open(data, {
      windowClass: 'warningMessagePopup',
      centered: true,
      size: 'md',
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription)
      this.cartSubscription.unsubscribe();
  }
}

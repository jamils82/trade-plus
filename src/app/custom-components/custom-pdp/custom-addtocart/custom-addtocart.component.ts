import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CMSTabParagraphContainer, Product, CmsService, WindowRef, ActiveCartService } from '@spartacus/core';
import { CurrentProductService, TabParagraphContainerComponent, CmsComponentData, BreakpointService,AddToCartComponent, ModalService } from '@spartacus/storefront';
import { BehaviorSubject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';


// constructor(
//   modalService: ModalService,
//   currentProductService: CurrentProductService,
//   cd: ChangeDetectorRef,
//   activeCartService: ActiveCartService,
//   // eslint-disable-next-line @typescript-eslint/unified-signatures
//   component?: CmsComponentData<CmsAddToCartComponent>
// );

@Component({
  selector: 'app-custom-addtocart',
  templateUrl: './custom-addtocart.component.html',
  styleUrls: ['./custom-addtocart.component.scss']
})
export class CustomAddtocartComponent extends AddToCartComponent implements  OnDestroy  {
  @Input() productCode: string;
  @Input() showQuantity = true;
  @Input() showEmptyPrice: boolean;
  @Output() successMessageEmitterMessage = new EventEmitter<boolean>();

  /**
   * As long as we do not support #5026, we require product input, as we need
   *  a reference to the product model to fetch the stock data.
   */
  @Input() product: Product;
  @Input() plpList: boolean;
  @Input() plpGrid: boolean;
  @Input() quickOrder: boolean;
  @Input() screenName: any;
  @Input() isPOAProduct?: boolean = true;
  private qualitySubscribe: Subscription;

  modalRef: any;
  quantity = 1;
  constructor( modalService: ModalService,
    currentProductService: CurrentProductService,
    cd: ChangeDetectorRef,
    activeCartService: ActiveCartService,
    private productHelpService:ProductHelpService,
    public commonService: CommonService
   ) {   
      super(modalService,currentProductService,cd,activeCartService)
      // this.addToCartForm.valueChanges
      //   alert(1)
      // })

      this.qualitySubscribe = this.addToCartForm.valueChanges
      .pipe(startWith(this.addToCartForm.value))
      .subscribe((value) =>{
       // alert(1)
       if(this.product?.code && value?.quantity){
         this.quantity = value.quantity;
        if(this.screenName != 'pdp') {
          this.productHelpService.updatePLPProItem({code:this.product.code, quantity:value?.quantity})
        }
       }
      }
      );


    }

    openModal() {};
    pdpLoader() {
      this.commonService.show();
      (<any>window).dataLayer.push({
        'event':'ATC ClicK',
        'eventCategory':'Add To Cart',
        'eventAction':this.product.description, //Pass the product title
        'eventLabel': 'PDP',
        'productId': this.product.code,
        'producName': this.product.description,
        'sku': this.product.code,
        ecommerce: {
          'currency':'AUD',
          items: [{
            'item_list_name':'PDP',//Pass the screen title or category from where the user clicking on Add to Cart
            'item_id': this.product.code,
            'item_name': this.product.description,
            'price': this.product.price.value,
            'item_brand': this.product.manufacturer,
            'item_category': this.product.categories[0].name,
            'quantity': this.quantity,
          }]
        },
      });
      this.activeCartService.isStable().subscribe((data) => {
        if (data) {
          this.commonService.hide();
        }
      })
    }

    plpLoader() {
      console.log("Product:::",JSON.stringify(this.product))
      this.commonService.show();
      
      (<any>window).dataLayer.push({
        'event':'ATC ClicK',
        'eventCategory':'Add To Cart',
        'eventAction':this.product.name, //Pass the product title
        'eventLabel': 'PLP',
        'productId': this.product.code,
        'producName': this.product.name,
        'sku': this.product.code,
        ecommerce: {
          'currency':'AUD',
          items: [{
            'item_list_name':'PLP',//Pass the screen title or category from where the user clicking on Add to Cart
            'item_id': this.product.code,
            'item_name': this.product.name,
            'price': this.product.price.value,
            'item_brand': this.product.manufacturer,
            'quantity': this.quantity,
          }]
        },
      });
      this.activeCartService.isStable().subscribe((data) => {
        if (data) {
          console.log("dataaaa:::",JSON.stringify(data))
          this.commonService.hide();
        }
      })
    }
  // ngOnInit(): void {
  // }

  stockInOtherBranches(content) {
       this.modalRef = this.modalService.open(content, { windowClass: 'in-stock-availability', centered: true, size: 'lg' });
    }

    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      if (this.qualitySubscribe) {
        this.qualitySubscribe.unsubscribe();
      }
    }


    // addSingleItemToList(){

    //   this.productHelpService.setSelectedProductCode(this.product.code);
    // }
    successMessageEmitter() {
      this.successMessageEmitterMessage.emit();
    }

}

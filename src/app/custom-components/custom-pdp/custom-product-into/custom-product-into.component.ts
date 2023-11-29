import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { CurrentProductService } from '@spartacus/storefront';
import { Product, ProductScope } from '@spartacus/core';

@Component({
  selector: 'app-custom-product-into',
  templateUrl: './custom-product-into.component.html',
  styleUrls: ['./custom-product-into.component.scss']
})
export class CustomProductIntoComponent implements OnInit, OnChanges {

  products$: Observable<Product> = this.currentProductService.getProduct('SPECIFICATIONS');
  @Input() pageId:String = "pdp";
  screenName = "pdp";
  infoMessage: string = '';
  successInd$ = new BehaviorSubject<boolean>(false);
  resetQuantity$ = new BehaviorSubject<any>(false);
  constructor( private currentProductService: CurrentProductService,
    public commonService: CommonService) { }

  ngOnChanges():void{
    this.resetQuantity$.next(false) ;
  }
  ngOnInit(): void {
    this.commonService.show();
    this.products$.subscribe( data => {
      this.resetQuantity$.next(false) ;
      if(data?.numberOfReviews) {
        data.numberOfReviews = 40;
      }     
      setTimeout(() => {
        this.resetQuantity$.next(true) ;
      }, 400);
      this.commonService.onLoadPDPGTM('product', 'PDP', '0', window.location.href, data?.code, data?.name, data?.code);
      if(window.location.href.includes('/product/')) {
        this.commonService.onGlobalSearchClickEventGTM('SuggestedSearch', data?.name, sessionStorage.getItem('searchInputValue'));
      }
      this.commonService.hide();
    })
  }
  successMessageEmitterMessage() {
    this.infoMessage = 'Your items have been successfully added to list';
    this.successInd$.next(true);
    setTimeout(() => {
      this.infoMessage = '';
      this.successInd$.next(false);
    }, 10000);
  }
}

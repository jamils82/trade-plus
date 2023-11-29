import { Component, OnInit, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CmsSearchBoxComponent, RoutingService, WindowRef } from '@spartacus/core';
import { CmsComponentData, SearchBoxComponent, SearchBoxComponentService } from '@spartacus/storefront';
import { CommonService } from 'src/app/core/service/CommonService/common.service';


@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent extends SearchBoxComponent {

  @Input() fromPage: boolean;
  @Input() quickOrderIndex: number = 0
  @Input() screenMode: String = ""
  @Output() prodCodecallBack = new EventEmitter();
  @Output() srpSearch = new EventEmitter();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef<any>;
  @Input() selectedCode: string = ""

  constructor(
    searchBoxComponentService: SearchBoxComponentService,
    componentData: CmsComponentData<CmsSearchBoxComponent>,
    winRef: WindowRef,
    routingService: RoutingService,
    eref: ElementRef,
    private commonService: CommonService
  ) {
    super(searchBoxComponentService, componentData, winRef, routingService)
  }

  search(query: string): void {
    if(query.length >= 3) {
      this.searchBoxComponentService.search(query, this.config);
      // force the searchBox to open
      this.srpSearch.emit(query);
      this.open();
    }
  }
  onFocus(query: string):void {
    if(query.length >= 3) {
      this.open();
    }
  }
  hideDropDown() {
    let plpSearch = document.getElementsByClassName('plp-search') as HTMLCollectionOf<HTMLElement>;
    if (this.screenMode == "quickOrder") {
      plpSearch[this.quickOrderIndex].style.display = "block";
    }
    else {
      plpSearch[0].style.display = "block";
    }
  }

  open(): void {
    this.searchBoxComponentService.toggleBodyClass('product-searchbox-is-active', true);

    this.hideDropDown()

  }

  avoidReopen(event: UIEvent): void {

    if (this.searchBoxComponentService.hasBodyClass('product-searchbox-is-active')) {
      this.close(event, true);
      event.preventDefault();
    }
  }

  close(event: UIEvent, force: true): void {

    let plpSearch = document.getElementsByClassName('plp-search') as HTMLCollectionOf<HTMLElement>;
    plpSearch[this.quickOrderIndex].style.display = "none";
    this.searchBoxComponentService.clearResults();
  }

  blurSearchBox(event: UIEvent): void {

    this.winRef.document.body.classList.remove('product-searchbox-is-active')
    this.searchBoxComponentService.clearResults();
    this.searchBoxComponentService.clearResults();
    this.searchBoxComponentService.toggleBodyClass(
      'product-searchbox-is-active',
      false
    );
    this.hideDropDown();
    if (event && event.target) {
      (<HTMLElement>event.target).blur();
    }
  }

  searchItemHandler(event, product) {
    let productDetail: any = {};
    // console.log(JSON.stringify(product));
    productDetail.code = product.code;
    // console.log(product);
    if (product.price && (product.price.formattedValue == 'POA' || product.price?.formattedValue == '$0.00')) {
      productDetail.isPOAproduct = true;
    }
    // console.log("Product details:",productDetail)
    this.prodCodecallBack.emit(productDetail);
    this.close(event, true);
  }

  closeCheckOnblur(event) {
    if (this.screenMode !== "quickOrder") {
      this.close(event, true);
    }
  }

  searchGTMEventPixel(query: string): void { 
    this.commonService.onGlobalSearchClickEventGTM('', query)
    sessionStorage.setItem('searchTermVal', query)
  }

  resultGTMClick(q, aq) {
    this.commonService.onGlobalSearchClickEventGTM('SuggestedSearch', q, aq)
  }

  quickOrderResultGTMClick(q, aq) {
    this.commonService.onGlobalSearchClickEventGTM('QuickOrderSuggestEvent', q, aq)
  }


}

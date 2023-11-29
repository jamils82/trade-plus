import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CmsSearchBoxComponent, ProductService, RoutingService, WindowRef } from '@spartacus/core';
import { CmsComponentData, SearchBoxComponent, SearchBoxComponentService, SearchBoxConfig } from '@spartacus/storefront';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductSearchComponent } from 'src/app/custom-components/custom-product/product-search/product-search.component';
@Component({
  selector: 'app-m-product-search',
  templateUrl: './m-product-search.component.html',
  styleUrls: ['./m-product-search.component.scss']
})

export class MobileProductSearchComponent extends SearchBoxComponent implements OnInit {
  config = {
    displaySuggestions: true,
    displayProducts: true,
    displayProductImages: true,
    maxProducts: 120,
    maxSuggestions: 10,
    minCharactersBeforeRequest: 2
  };

  searchConfig: SearchBoxConfig = {
    displayProductImages: true,
    displayProducts: true,
    displaySuggestions: false,
    maxProducts: 5

  }
  searchText: string = '';
  selectedPage: string = 'product';
  searchValue: any;
  previousSearch: string = 'product';
  @Output() searchvalueChange = new EventEmitter();
  @Input() searchVal;
  @ViewChild('product') productPageRef: ProductSearchComponent;
  searchALL: string = 'product';
  srpData: any;
  constructor(public searchBoxComponentService: SearchBoxComponentService,
    public componentData: CmsComponentData<CmsSearchBoxComponent>,
    public winRef: WindowRef, private shareEvents: ShareEvents,
    public rotingService: RoutingService,
    private productService: ProductService,
    public ref: ChangeDetectorRef,
    private router: Router, private modalService: NgbModal) {
    super(searchBoxComponentService, componentData, winRef, rotingService);
  }
  ngOnInit() {
    this.searchText = this.shareEvents.mobileSearchVal != '' ? this.shareEvents.mobileSearchVal : '';
    // this.selectedPage = this.shareEvents.mobileSearchPage != '' ? this.shareEvents.mobileSearchPage : 'product';
    this.previousSearch = this.shareEvents.mobileSearchPage != '' ? this.shareEvents.mobileSearchPage : 'product';
    if (!(window.location.pathname.includes("search"))) {
      this.searchVal = '';
    }
    this.searchActive();
    this.ref.markForCheck();
  }

  searchActive() {
    if (window.location.pathname.includes("teamManagementPage")) {
      this.selectedPage = 'memberTeam';
    }
    if (window.location.pathname.includes("my-orders-deliveries")) {
      this.selectedPage = 'orderDelivery';
    }
    if (window.location.pathname.includes("quotesPage")) {
      this.selectedPage = 'quote';
    }
    if (window.location.pathname.includes('mylist')) {
      this.selectedPage = 'mylist';
    }
    if (window.location.pathname.includes('statementsPage')) {
      this.selectedPage = 'statement';
    }
    if (window.location.pathname.includes('invoicePage')) {
      this.selectedPage = 'invoice';
    }
    this.searchALL = this.selectedPage;
    this.ref.markForCheck();

  }

  onClearSearch() {
    if (this.previousSearch == 'product' && this.productPageRef != undefined ) {
      // this.router.navigate(['/search']);
      // this.modalService.dismissAll();
      this.productPageRef.searchInput.nativeElement.value = '';
      this.productPageRef.search('   ')
      this.productPageRef.close(null, true);
    }
    this.searchText = '';
    this.shareEvents.mobileSearchVal = this.searchText;
    this.shareEvents.mobileSearchSubject.next(this.searchText.toLocaleLowerCase());
    this.searchvalueChange.emit(this.searchText);
    // this.shareEvents.mobileSearchPage = 'product';
    // this.searchALL = 'product'
    // this.modalService.dismissAll();
  }

  // Product
  routeProduct() {
    if (window.location.pathname.includes('search')) {
      this.router.navigate(['/my-products/all'])
    }
  }

  searchClick(val) {
    this.searchvalueChange.emit(val)
  }
  closePopup() {
    this.modalService.dismissAll('');
  }
  srpSearch(data) {
    this.srpData = data;
  }
  sendEvent() {
    if (this.searchALL == 'product') {
      if(this.srpData)
      this.router.navigate(['/search/' + this.srpData])
      else
      this.router.navigate(['/search'])
      // this.searchvalueChange.emit(this.searchText);
    } else {
      this.searchText == this.searchText == undefined ? '' : this.searchText;
      this.shareEvents.mobileSearchVal = this.searchText.toLowerCase();
      this.shareEvents.mobileSearchPage = this.selectedPage;
      this.shareEvents.mobileSearchSubject.next(this.searchText);
      this.searchvalueChange.emit(this.searchText);
    }
    this.modalService.dismissAll();
  }
  prodCodecallBack(event) {
    let productSearch = '/p/' + event.code;
    // this.productService.get(event.code).subscribe((prodData: any) => {
    //   if (prodData) {
        // productSearch = productSearch + prodData?.name;
        this.router.navigate([productSearch]);
        this.modalService.dismissAll();
    //   }
    // });
  }
  onItemChange(val: string) {
    this.searchALL = val;
  }
}

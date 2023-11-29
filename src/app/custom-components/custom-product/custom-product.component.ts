import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { PageLayoutService, ProductListComponent, ProductListComponentService, ViewConfig, FacetService, FacetList, SearchBoxConfig, SortingComponent } from '@spartacus/storefront';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActiveCartService, MultiCartService, PageMetaService, PaginationModel } from '@spartacus/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-custom-product',
  templateUrl: './custom-product.component.html',
  styleUrls: ['./custom-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomProductComponent extends ProductListComponent implements OnDestroy {
  screenName: any;
  infoMessage: string = '';
  successInd$ = new BehaviorSubject<boolean>(false);
  breadcrumb$: Observable<any> = this.pageMetaService.getMeta();
  modalRef: any;
  viewListMode: boolean = true
  disableButton: boolean = true;
  facetList$: Observable<FacetList> = this.facetService.facetList$;
  pageSize: number = 12;
  currentPage: number = 0;
  prodSubcription: Subscription;
  paginationModel: PaginationModel = {
    currentPage: 0,
    pageSize: this.pageSize,
    sort: '',
    totalPages: 5,
    totalResults: 50,
  };
  isMobile: boolean = false;
  searchConfig: SearchBoxConfig = {
    displayProductImages: true,
    displayProducts: true,
    displaySuggestions: false,
    maxProducts: 5

  }


  //selectAll$ =  new BehaviorSubject<any>(false);

  selectAllParent: boolean = false
  selectedItemCount: number = 0
  viewMoreVisible: boolean = false;
  currentValue = 12;

  selectedProductList: any = [];
  poaProduct: boolean = false;
  addToCartDisabled: boolean = false;
  parentAddToCartDisabled: boolean = false;
  parentPoaProduct: boolean = false;
  products: any = [];
  constructor(pageLayoutService: PageLayoutService,
    productListComponentService: ProductListComponentService,
    scrollConfig: ViewConfig,
    private facetService: FacetService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private activeCartService: ActiveCartService,
    private multiCartService: MultiCartService,
    private productHelpService: ProductHelpService,
    private modalService: NgbModal,
    private myListService: MyListService,
    private pageMetaService: PageMetaService,
    public commonService: CommonService) {
    super(pageLayoutService, productListComponentService, scrollConfig)
    this.isMobile = CommonUtils.isMobile();
    this.prodSubcription = this.model$.subscribe(prodModel => {
      // this.breadcrumb$.subscribe((data) => {
      // if(prodModel.freeTextSearch == "") {
      //   data.title = 'Products';
      // }
      // else if(prodModel.freeTextSearch && prodModel.freeTextSearch != "") {
      //   data.title = prodModel.freeTextSearch;
      // }
      // });
      this.products = prodModel.products;
      this.pageSize = prodModel.pagination.pageSize
      if(prodModel?.pagination?.totalResults > 12) {
        this.viewMoreVisible = true;
      }
      else {
        this.viewMoreVisible = false;
      }
      this.selectAllParent = false;
      this.selectedItemCount = 0;
      this.productHelpService.plpASelectAllChild.next(false);
      // ************* add the product for selectAll to help service  ***************
      let prodListForThePage = prodModel?.products.map((item) =>
        Object.assign({}, item, { selected: false, quantity: 1 })
      )
      this.productHelpService.setUpdatePLPProductArray(prodListForThePage);
      // *************  END ************ add the product for selectAll to help service  ***************
      if (prodModel?.products?.length == 0) {
        let templateClass = document.getElementsByClassName("ProductLeftRefinements") as HTMLCollectionOf<HTMLElement>;
        templateClass[0].style.display = "none";
        let SearchResultsGridSlot = document.getElementsByClassName("SearchResultsGridSlot") as HTMLCollectionOf<HTMLElement>;
        if (SearchResultsGridSlot[0]) SearchResultsGridSlot[0].style.maxWidth = "100%";
      }
      else {
        let templateClass = document.getElementsByClassName("ProductLeftRefinements") as HTMLCollectionOf<HTMLElement>;
        templateClass[0].style.display = "block";
        let SearchResultsGridSlot = document.getElementsByClassName("SearchResultsGridSlot") as HTMLCollectionOf<HTMLElement>;
        if (SearchResultsGridSlot[0]) SearchResultsGridSlot[0].style.maxWidth = "73.5%";
      }
      if((prodModel?.freeTextSearch && prodModel?.freeTextSearch != "") || (window.location.href.includes('search'))) {
        let newVal: any = sessionStorage.getItem('searchTermVal');
        if(newVal.substring(newVal.indexOf(':'))) {
          this.commonService.onGlobalSearchClickEventGTM('', newVal.split(':')[0]);
          this.commonService.onLoadSearchGTM('search', 'Search', '0', window.location.href, newVal.split(':')[0]);
        } else {
          this.commonService.onGlobalSearchClickEventGTM('', sessionStorage.getItem('searchTermVal'));
          this.commonService.onLoadSearchGTM('search', 'Search', '0', window.location.href, sessionStorage.getItem('searchTermVal'));
        }
        
      } else {
        let catProdModelVal = JSON.parse(JSON.stringify(prodModel));
        this.commonService.onLoadGTMMethod('category', 'PLP', '0', window.location.href, catProdModelVal?.categories, prodModel?.breadcrumbs?.[0]?.facetValueCode);
      }
      this.commonService.hide();
    })



  }

  changeViewMode(modeValue: boolean) {

    // this.disableButton = modeValue;
    this.viewListMode = modeValue
    // if (this.disableButton != modeValue) {
    //   this.selectedItemCount = 0;
    //   this.disableButton = !this.disableButton
    // }
    // if (this.viewListMode) {
    //   let listButtonClass = document.getElementsByClassName("list-btn") as HTMLCollectionOf<HTMLElement>;
    //   listButtonClass[0].style.backgroundColor = "#E0E1E2";
    //   listButtonClass[0].style.color = "#495A64"
    //   let buttonClass = document.getElementsByClassName("grid-btn") as HTMLCollectionOf<HTMLElement>;
    //   buttonClass[0].style.backgroundColor = "#003D7A";
    //   buttonClass[0].style.color = "#fff"
    // } else {
    //   let listButtonClass = document.getElementsByClassName("list-btn") as HTMLCollectionOf<HTMLElement>;
    //   listButtonClass[0].style.backgroundColor = "#003D7A";
    //   listButtonClass[0].style.color = "#fff"
    //   let buttonClass = document.getElementsByClassName("grid-btn") as HTMLCollectionOf<HTMLElement>;
    //   buttonClass[0].style.backgroundColor = "#E0E1E2";
    //   buttonClass[0].style.color = "#495A64"
    // }
  }

  viewMoreClick() {
    this.currentValue += 12;
    this.model$.subscribe(prodModel => {
      if(prodModel?.pagination?.totalResults <= this.currentValue) {
        this.viewMoreVisible = false
      }
      else {
        this.viewMoreVisible = true;
      }
    })
    this.updateQuery(this.currentValue);
  }
  //  (viewPageEvent)="pageChangeOTTB($event)
  pageChangeOTTB(event) {
    this.paginationModel.currentPage = event;
    this.currentPage = event
    this.updateQuery()

    //window.scroll(0,0);
  }

  updateQuery(pageSizeMob?) {
    let queryParams: any;
    if(this.isMobile) {
      queryParams = { pageSize: pageSizeMob, currentPage: this.currentPage };
    }
    else {
      queryParams = { pageSize: this.pageSize, currentPage: this.currentPage };
    }
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }

  perPageChange(value) {
   this.pageSize = value
   sessionStorage.setItem("PLPCurrentPageSize", value )
    this.currentPage = 0
    this.updateQuery()

    //window.scroll(0,0);
  }

  getSelectedItem(item) {
    let selItem = {
      productCode: item.productCode,
      quantity: item.quality,
    }
    if (!item.isChecked) {
      this.selectedItemCount -= 1


      this.selectedProductList = this.selectedProductList.filter( (obj) => {
        return obj.productCode != item.productCode;
      } )
      this.selectAllParent = false
    }
    else {
      this.selectedItemCount += 1;
      this.selectedProductList.push(item);
      if (this.selectedItemCount === this.pageSize) {
        this.selectAllParent = true
      }
    }
    //  const selected = this.selectedProductList.filter(element => {
    //   return (element.poaProduct == true )
    // });
    // this.poaProduct = selected.length> 0 ? true: false
    // const selectedVal = this.selectedProductList.filter(element => {
    //   return (element.addToCartDisabled == true )
    // });
    // this.addToCartDisabled = selectedVal.length> 0 ? true: false
    this.addToCartButtonDisabled();
  }

  addToCartEmpty() {
    this.commonService.show();
        this.activeCartService.getActiveCartId().subscribe(data => {
      let obj = {
        "cardId": data,
        "carts": this.productHelpService.generatePlpAddAllItem()
      }
      this.productHelpService.addAllToCart(obj).subscribe(data => {
        if(data)  {
          let prodId = [];
          data.cartModifications.forEach(element => {
            prodId.push(element?.entry?.product?.code);
          });
          for ( let i = 0; i < this.productHelpService.generateGAData().length ; i ++) {
            (<any>window).dataLayer.push({
              'event':'ATC ClicK',
              'eventCategory':'Add To Cart',
              'eventAction':this.productHelpService.generateGAData()[i].name, //Pass the product title
              'eventLabel':'PLP', //Pass the screen title or category from where the user clicking on Add to Cart
              'productId': prodId[i],
              'sku': prodId[i]
              });
          }
          // this.productHelpService.generateGAData().forEach(item => {
          //   console.log('item==>',item);
          //   (<any>window).dataLayer.push({
          //     'event':'ATC ClicK',
          //     'eventCategory':'Add To Cart',
          //     'eventAction':item.name, //Pass the product title
          //     'eventLabel':'PLP', //Pass the screen title or category from where the user clicking on Add to Cart
          //     'productId': test
          //     });
          // });

          // this.activeCartService.getActive()
          this.multiCartService.reloadCart(data);
          this.activeCartService.isStable().subscribe((data) => {
            if (data) {
              this.commonService.hide();
            }
          })
        }
      })
    });
  }

  addSelectedItemToCart() {
    let cartIdSession = ""
    this.addToCartEmpty();
    // let templateClass = document.getElementsByClassName("ProductGridPageTemplate") as HTMLCollectionOf<HTMLElement>;
    // if (templateClass.length > 0) {
      // templateClass[1].style.backgroundColor = "white";
      // templateClass[1].style.opacity = "0.5";
      // document.getElementById("addAllToCart").style.display = "block";
      // this.commonService.show();
      // this.activeCartService.isStable().subscribe((data) => {
      //   if (data) {
      //     this.commonService.hide();
      //   }
      //   if (data) {
      //     templateClass[1].style.backgroundColor = "#E8EFF7";
      //     templateClass[1].style.opacity = "1";
      //     document.getElementById("addAllToCart").style.display = "none";
      //   }
      // });
    // }
    // let searchResultsTemplateClass = document.getElementsByClassName("SearchResultsGridPageTemplate") as HTMLCollectionOf<HTMLElement>;
    // if (searchResultsTemplateClass.length > 0) {
    //   // searchResultsTemplateClass[1].style.backgroundColor = "white";
    //   searchResultsTemplateClass[1].style.opacity = "0.5";
    //   document.getElementById("addAllToCart").style.display = "block";
    //   this.activeCartService.isStable().subscribe((data) => {
    //     if (data) {
    //       searchResultsTemplateClass[1].style.backgroundColor = "#E8EFF7";
    //       searchResultsTemplateClass[1].style.opacity = "1";
    //       document.getElementById("addAllToCart").style.display = "none";
    //     }
    //   });
    // }
  }

  addToCartButtonDisabled() {
    let obsoleteCount = 0;
    let poaCount = 0;
    this.productHelpService.generatePlpAddAllItem().forEach(element => {
      this.products.forEach(element2 => {
        if(element.productCode == element2.code) {
          if(element2.price?.formattedValue == 'POA' || element2.price?.formattedValue == '$0.00') {
            poaCount = 1;
          }
          if(element2.addToCartDisabled == true) {
            obsoleteCount = 1;
          }
          // const parentVal = element2.filter((element: any) => {
          //   return (element.addToCartDisabled == true )
          // });
          // this.parentAddToCartDisabled = parentVal.length> 0 ? true: false;
          // const parentSelected = this.products.filter((element: any) => {
          //   return (element.price?.formattedValue == 'POA' || element.price?.formattedValue == '$0.00')
          // });
          // this.parentPoaProduct = parentSelected.length> 0 ? true: false;
        }
      });
    });
    if(obsoleteCount == 1) {
      this.parentAddToCartDisabled = true;
    }
    else if(obsoleteCount == 0){
      this.parentAddToCartDisabled = false;
    }
    if(poaCount == 1) {
      this.parentPoaProduct = true;
    }
    else if(poaCount == 0){
      this.parentPoaProduct = false;
    }
  }
  landingPageRouting(){
    this.router.navigateByUrl('/');
  }

  selectAllChangeHandler(event) {
    this.selectAllParent = event.target.checked
    if (event.target.checked) {
      this.selectedItemCount = this.pageSize;
      const parentVal = this.products.filter((element: any) => {
        return (element.addToCartDisabled == true )
      });
      this.parentAddToCartDisabled = parentVal.length> 0 ? true: false;
      const parentSelected = this.products.filter((element: any) => {
        return (element.price?.formattedValue == 'POA' || element.price?.formattedValue == '$0.00')
      });
      this.parentPoaProduct = parentSelected.length> 0 ? true: false;
    }
    else {
      this.selectedItemCount = 0;
      this.parentAddToCartDisabled = false;
      this.parentPoaProduct = false;
      this.poaProduct = false;
      this.addToCartDisabled = false;
    }
    this.productHelpService.updateAllPlpProd(event.target.checked);

    this.productHelpService.plpASelectAllChild.next(event.target.checked);
    this.addToCartButtonDisabled();
    //alert(event.target.checked)
  }
  successMessageEmitter() {
    this.infoMessage = 'Your items have been successfully added to list';
    this.successInd$.next(true);
    setTimeout(() => {
      this.infoMessage = '';
      this.successInd$.next(false);
    }, 10000);

  }

  ngOnDestroy() {
    if (this.prodSubcription)
      this.prodSubcription.unsubscribe();
  }
}//

import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { ActiveCartService, OrderEntry, Cart } from '@spartacus/core';
import { MiniCartComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { filter } from 'rxjs/operators';
import { ChnageQuotePopupComponent } from '../request-quote-mod/requestquote/chnage-quote-popup/chnage-quote-popup.component';

@Component({
  selector: 'app-custom-mini-cart',
  templateUrl: './custom-mini-cart.component.html',
  styleUrls: ['./custom-mini-cart.component.scss'],
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
})
export class CustomMiniCartComponent extends MiniCartComponent implements OnInit {
  entries$: Observable<OrderEntry[]> = this.activeCartService.getEntries();
  cart$: Observable<Cart> = this.activeCartService.getActive();
  isMobile = CommonUtils.isMobile();
  isShowMenu = false;
  totalPriceFormat: String = ""
  modalRef: any;
  searchPlaceHolder: string = 'Search';
  items: any = [];
  showSearch: boolean = false;
  pageState: any;
  currentUrl: string;
  previousUrl: any;
  constructor(private _eref: ElementRef,
    protected activeCartService: ActiveCartService,
    private productHelpService: ProductHelpService,
    private router: Router,
    private modalService: NgbModal,
    public ref: ChangeDetectorRef,
    private accountDropDownStateService: AccountDropDownStateService,
    public commonService: CommonService,) {

    super(activeCartService);
  }

  ngOnInit() {
    if (window.location.pathname.includes('mylist')) {
      this.searchPlaceHolder = 'Search for a particular list';
    } else {
      this.searchPlaceHolder = 'Search';
    }
    this.cart$.subscribe(dataRes => {
      if (dataRes.totalPrice) this.totalPriceFormat = dataRes.totalPrice.formattedValue
      this.accountDropDownStateService.setCartValue(dataRes);
      this.router.events.subscribe((val) => {
        if (window.location.pathname.includes('mylist')) {
          this.searchPlaceHolder = 'Search for a particular list';
        } else {
          this.searchPlaceHolder = 'Search';
        }
        this.ref.markForCheck();
      });
    })



    if (this.entries$) {

      this.entries$.subscribe(data => {
        this.items = []
        this.productHelpService.updateCodeInCart(data)
        data.forEach(n => {
          this.items.push(n)
        })
      })

    }

    this.currentUrl = this.router.url;
    this.previousUrl = null;
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
        })
  }

  negativeConverter(value) {
    let val: any = parseFloat(value).toFixed(2);
    if (/\-/g.test(val)) {
      let isMinus = '-$' + val.replace('-', '');
      return (
        '-$' + parseFloat(isMinus.split('$')[1]).toFixed(2).toLocaleString()
      );
    } else {
      let isMinus = '$' + val;
      return (
        '$' + parseFloat(isMinus.split('$')[1]).toFixed(2).toLocaleString()
      );
    }
  }

  toggleMenu() {
    this.isShowMenu = !this.isShowMenu;
    // this.openCart();
  }

  mobileToggleMenu(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'minicartPopup', centered: true, size: 'lg' });
  }
  openSearch(content) {
    this.showSearch = true;
    this.modalRef = this.modalService.open(content, { windowClass: 'globalSearchPopup', centered: true, size: 'lg' });
  }
  onClickOutside(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isShowMenu = false;
    }
  }

  mouseoutFunction() {
    this.isShowMenu = false;
  }
  openCart() {
    this.pageState = this.commonService.getPage();
    if(this.currentUrl == '/tpRequestQuotePage' && this.pageState == true){
      // alert("IF")
      this.openModalQuote();
    }
    else{
      // alert("Else")
      this.router.navigate(['/cart']);
    }
    
  }

  openModalQuote(){
  
    this.modalRef = this.modalService.open(ChnageQuotePopupComponent, {
      windowClass: 'ChnageQuotePopup',
      centered: true,
      size: 'lg',
    });
    this.modalRef.componentInstance.selectedChoice = true;
    this.modalRef.result.then((result) => {
      if(result){
        this.router.navigate(['/cart']);
      }
    })
  }

  continueShop(){
    this.pageState = this.commonService.getPage();
    if(this.currentUrl == '/tpRequestQuotePage' && this.pageState == true){
      this.openModal();
    }
    else{
      this.router.navigate(['/'])
    }
   
  }
 
  openModal(){
  
    this.modalRef = this.modalService.open(ChnageQuotePopupComponent, {
      windowClass: 'ChnageQuotePopup',
      centered: true,
      size: 'lg',
    });
    this.modalRef.componentInstance.selectedChoice = true;
    this.modalRef.result.then((result) => {
      if(result){
        this.router.navigate(['/'])
      }
    })
  }
 

  navigateToAccount() {
    this.router.navigate(['/preferencesPage'])
  }
  searchtext(event) {
    this.showSearch = false;
  }
}

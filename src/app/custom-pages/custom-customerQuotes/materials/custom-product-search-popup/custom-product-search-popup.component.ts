import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CmsService, WindowRef } from '@spartacus/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { quoteConstants } from 'src/app/core/constants/general';
import { CustomSearchBoxService } from 'src/app/core/service/customerQuotes/customsearchbox.service';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { MaterialService } from 'src/app/core/service/customerQuotes/material.service';

@Component({
  selector: 'app-custom-product-search-popup',
  templateUrl: './custom-product-search-popup.component.html',
  styleUrls: ['./custom-product-search-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomProductSearchPopupComponent implements OnInit, OnChanges, OnDestroy {
  NgbModalRef: any;
  quoteConstants = quoteConstants;
  isLoading$ = new BehaviorSubject<boolean>(true);
  private subscription = new Subscription();
  modalRef: any;
  productType = 'search';
  quoteId: any;
  searchCompId: any;
  searchConfig: any;
  searchResult: any[];
  chosenWord: any;
  productResultData = [];
  paginationData: any;
  addedProduct:any;
  totalPrice:any;
  priceApiDown = false;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private cmsService: CmsService,
    private dataService: DataService,
    private winRef: WindowRef,
    private ref: ChangeDetectorRef,
    private customsearchboxService: CustomSearchBoxService,
    private materialService: MaterialService
  ) {
    this.searchCompId = this.dataService.searchCompUid;
  }
  
  @ViewChild('popupSearchInput')
  searchInputField!: ElementRef;
  @ViewChild('popupProductSearchContainer')
  productSearchContainer!: ElementRef;
  
  ngOnInit(): void {
   this.quoteId =  this.dataService.currentQuoteId;
    this.cmsService.getComponentData("SearchBox").subscribe(data=> {
      this.searchConfig = data;
    }); 

    this.subscription = this.materialService.loadMoreSearch.subscribe((res) => {
      if (res) {
        this.getProductResults(this.searchInputField.nativeElement.value,res);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ref.detectChanges();
  }

  cClose() {
    this.isLoading$.next(true);
  }

  cOpen() {
    this.isLoading$.next(false);
  }

  cSearch(term: any, event: Event) {
    if (term === '') {
      this.cClearResults();
    }
    this.paginationData = undefined;
    if (term.length >= 3) {
      this.productResultData.length = 0;
      this.customsearchboxService.getSearchSuggestion(term).subscribe((res) => {
        let category = [];
        let suggestions = [];
        if (res.suggestions) {
          suggestions = res.suggestions.slice(0,this.searchConfig.maxSuggestions);
        }
        if (res.category) {
          category = res.category.slice(0,this.searchConfig.maxCategory);
        }
        Array.prototype.push.apply(suggestions,category);
        
        if ((<HTMLInputElement>event.target).value === '') {
          this.cClearResults();
        } else {
          this.searchResult = suggestions;
          if (this.productResultData.length == 0) {
            this.isLoading$.next(false);
          }
          this.searchInputField.nativeElement.focus();
        }
      });
    } else {
      this.searchResult = [];
    }
  }

  cClearResults() {
    this.isLoading$.next(true);
    this.searchResult = [];
    this.paginationData = undefined;
    this.priceApiDown = false;
  }

  cLaunchSearchResult(event: Event, term: any) {
    if (term != '') {
      let element: HTMLElement = document.getElementById('product-search-loading-wrapper') as unknown as HTMLElement;
      element.style.display = 'block';
      this.productResultData.length = 0;
      this.getProductResults(term,0);
    }
  }

  getProductResults(term: any, page:any) {
    this.customsearchboxService.getSearchProducts(term,page).subscribe((data) => {
      // data.products.forEach( (element) => {
      //   if (element.uomFormat != '') {
      //     let uom = element.uomFormat;
      //     let full = '';
      //     for(var i=0; i < Number(uom.split('.')[0]); i++) {full = full + 'z'};
      //     let deci = '';
      //     let dot = '';
      //     if (uom.split('.')[1] != undefined){
      //       dot = '.';
      //       for(var i=0; i < Number(uom.split('.')[1]); i++) {deci = deci + '9'};
      //     }
      //     element['uomFormat'] = full+dot+deci;
      //   }
      // });

      this.productResultData.push(data.products);
      this.productResultData = [].concat.apply([], this.productResultData);
      this.paginationData = data.pagination;
      let element: HTMLElement = document.getElementById('product-search-loading-wrapper') as unknown as HTMLElement;
      element.style.display = 'none';
      this.cClose();
      this.productResultData[0].price == undefined ? this.priceApiDown = true : this.priceApiDown = false;

      setTimeout( function() {
        let lastProd: HTMLElement = document.getElementsByClassName('search-product-list') as unknown as HTMLElement;
        const elem = lastProd[(data.pagination.currentPage * data.pagination.pageSize)-4] as HTMLElement;
        const parent: HTMLElement = document.getElementsByClassName('product-results-area') as unknown as HTMLElement;
        if (data.pagination.currentPage != 0) {
          parent[0].scrollTo({ top: elem.offsetTop, behavior: 'smooth'});
        }
      },100);
  })
  }

  cUpdateChosenWord(term: any,name: any) {
    if (name === '' || name == undefined) {
      this.chosenWord = term;
    } else {
      this.chosenWord = name;
    }
  }

  cFocusPreviousChild(event: Event) {
    event.preventDefault(); // Negate normal keyscroll
    const [results, focusedIndex] = [
      this.cGetResultElements(),
      this.cGetFocusedIndex(),
    ];
    // Focus on last index moving to first
    if (results.length) {
      if (focusedIndex < 1) {
        results[results.length - 1].focus();
      } else {
        results[focusedIndex - 1].focus();      
      }
    }
  }
  cFocusNextChild(event: Event) {
    this.cOpen();
    event.preventDefault(); // Negate normal keyscroll
    const [results, focusedIndex] = [
      this.cGetResultElements(),
      this.cGetFocusedIndex(),
    ];
    // Focus on first index moving to last
    if (results.length) {
      if (focusedIndex >= results.length - 1) {
        results[0].focus();
      } else {
        results[focusedIndex + 1].focus();
      }
    }
  }
  
  cDispatchSuggestionEvent(e: any) {
    console.log(e);
  } 

  // Return result list as HTMLElement array
  cGetResultElements(): HTMLElement[] {
    return Array.from(
      this.winRef.document.querySelectorAll(
        '.productSearchPopup .searchProductToQuote .results .suggestions a'
      )
    );
  }

  // Return focused element as HTMLElement
  cGetFocusedElement(): HTMLElement {
    return <HTMLElement>this.winRef.document.activeElement;
  }

  cGetFocusedIndex(): number {
    return this.cGetResultElements().indexOf(this.cGetFocusedElement());
  }

  // Close search dropdown on click outside
  checkandclose(e: Event) {
    setTimeout(() =>{ 
      if(!this.productSearchContainer.nativeElement.contains(document.activeElement)) {
        this.cClose();
      }
    }, 500);
  }

  clearField(e: Event) {
    this.searchInputField.nativeElement.value = '';
    this.productResultData.length = 0;
    this.cClearResults();
  }

  closeModal(data:any){
    this.materialService.loadMoreSearch.next(null);
    //this.activeModal.close(data);
    this.modalService.dismissAll();
  }
  dismissModal(){
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

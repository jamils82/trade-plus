import { CommonUtils } from 'src/app/core/utils/utils';
import { SelectionModel } from '@angular/cdk/collections';
import { filter, first } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { QuotesService } from 'src/app/core/service/quotes.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { PeriodicElement } from '../custom-myteam/custom-myteam.component';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { QuickOrderModel } from '../quick-order/quick-order.model';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RequestquoteComponent } from '../request-quote-mod/requestquote/requestquote.component';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { invoiceAdjustmentService } from 'src/app/core/service/invoice_adjustments.service';
import { HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { Dayjs } from 'dayjs/esm';
// export interface PeriodicElement {
//   status: string,
//   code: string,
//   orderRef: string,
//   jobAccount: string,
//   createdDate: string,
//   expirationDate: string,
//   branch: string,
//   createdBy: string,
//   customerDetails: string
// }



@Component({
    selector: 'app-custom-my-quotes',
    templateUrl: './custom-my-quotes.component.html',
    styleUrls: ['./custom-my-quotes.component.scss'],
    providers: [RequestquoteComponent]
})


export class CustomMyQuotesComponent implements OnInit, AfterViewInit {
    @ViewChild('searchKeyValue') searchKeyValue;
    listData: any = [];
    fromDate: any;
    toDate: any;
    userActivity:any;
    currentPage: any = 'MyQuotes';
    dataSource: any;
    endDate: string;
    getdataSource:any;
    startDate: string;
    tempInvoiceNo: any;
    viewListMode: boolean = false;
    modalRef: any;
    selected :any = {};
    selectedQuoteCheckoutData:any;
    checkoutDeatilViewData:any;
    hasData: boolean = true;
    ACTIIVEBtn: boolean = true;
    editMode: boolean = false;
    selectedMyListData: any;
    quoteDetailViewData: any;
    currentPageIndex: number = 1;
    displayedColumns: string[] = [
        'select',
        'code',
        'orderRef',
        'branch',
        'createdBy',
        // 'requestedDeliveryDate',
        'createdDate',
        'expirationDate',
        'total',
        'status',
        'action'

    ];
    

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    testPaginator = {
        length: 100,
        pageSize: 12,
        pageIndex: 0,
    };
    currentItem: any = {};
    emailId: any;
    selection = new SelectionModel<any>(true, []);
    selectedName$ = new BehaviorSubject<any>('');
    selectedUID: string;
    infoMessage: string = '';
    successInd$ = new BehaviorSubject<boolean>(false);
    errorInd: boolean = false;
    showloader: boolean;
    noDataMsg = '';
    disableButton: boolean = true;
    showViewQuote: boolean = false;
    dummyList: any;
    searchValue: any;
    searchFilter: any;
    dummyPaginatorList: any;
    isMobile: Boolean = false;
    viewMoreItems: any = [];
    viewMoreVisible: boolean = false;
    currentValue = 24;
    currentValueMob = 24;
    paramsFromFilter: any = {};
    dataAfterFilter: any;
    isMobFilter: boolean = false;
    pageSize: any;
    dateFilter: string = '';
    quoteNum: any;
    myQuotelist: any;
    selectedList: any;
    selectedQuoteData: any;
    elementData: any = {};
    rows: any = [];
    @Output() prodCodecallBack = new EventEmitter();
    requestQuoteDetailViewData: any;
    showRequestQuote: boolean = false;
    previousUrl: string;
    dummyData: any;
    flag: boolean = false;
    searchVal : any;
    currentUrl: any;
    alwaysShowCalendars: boolean | undefined;
    ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
    'Last 30 Days': [moment().subtract(30, 'days')],
    'This Month': [moment().startOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  
  isInvalidDate = (m: moment.Moment) =>  {
    return this.invalidDates.some(d => d.isSame(m, 'day') )
  }
    makeDate: string;
    prev: string;

    constructor(public datePipe: DatePipe,
        private modalService: NgbModal,
        private quotesService: QuotesService,
        public shareEvents: ShareEvents,
        public ref: ChangeDetectorRef,
        private router: Router,
        private userProfileDetailsService: FIUserAccountDetailsService,
        public commonService: CommonService,
        public myListService: MyListService,
        private request: RequestquoteComponent,
        public service: invoiceAdjustmentService,
        private route: ActivatedRoute,
    ) {
        this.previousUrl = router.url;
        this.commonService.setUrl(this.previousUrl);
       
            let now = new Date();
            now.setMonth(now.getMonth() - 1);
            this.fromDate = moment().subtract(1, 'month').format('DD-MM-YYYY');
            this.toDate = moment().format('DD-MM-YYYY');
            this.selected = {startDate:this.fromDate, endDate:this.toDate};
            console.log(this.fromDate);
            console.log(this.toDate);
            console.log(this.selected);
            this.getList();
        
    }




    ngOnInit(): void {
        // this.currentUrl = this.router.url;
        // this.previousUrl = null;
        // this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
        //   this.previousUrl = this.currentUrl;
        //   this.currentUrl = event.urlAfterRedirects;
        //     })  
        
        this.isMobile = CommonUtils.isMobile();
        this.getdataSource = sessionStorage.getItem("dateFilter");
        
       
      
           
      
        
       
        this.shareEvents.mobileSearchSubject.subscribe((val) => {
            if (val != undefined) {
                this.getList();
            }
        })
        this.dataSource = new MatTableDataSource(this.dummyList);
       
        this.userProfileDetailsService.getUserAccount().subscribe((data) => {
            if (data != undefined) {
              this.emailId = data.uid;
             // this.redirectToCheckout('5037719');
            }
          });
         
    }

   



    // setTimeout() {
    //     this.userActivity = setInterval(() => {
    //     clearTimeout(this.userActivity);
    //       this.getdataSource = sessionStorage.getItem("dateFilter");
           
    //          if(this.getdataSource != null){
           
    //             this.dateRangeEmitter(this.getdataSource);
    //         }
           
    //        sessionStorage.removeItem("dateFilter");
    //       // window.open('/quotesPage', "_self");
    //     }, 1000);
    //   }

    ngAfterViewInit() {
        this.changeViewMode(false);
        this.getQuotesData();
    }

    redirectToCart(){
        this.router.navigate(['/cart']);

    }

    redirectToQuote(event, quoteValue){
        event.stopPropagation();
        this.quotesService.getExpiredQuoteNum(quoteValue).subscribe(result => {
            if(result){
                this.selectedQuoteData = result.entries;      
            }
            if(this.selectedQuoteData != undefined){
                this.router.navigate(['/tpRequestQuotePage']);
                this.commonService.setData(this.selectedQuoteData);     
                }

        })  
    }

    /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if(this.viewListMode){
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    }
    else{
        this.isAllSelected()
        ? this.selection.clear()
        : this.listData.forEach((row) => this.selection.select(row));
    }
      
  }

    getList() {
      
        this.flag = false;
        this.commonService.show();
        this.pageSize = '&pageSize=' + this.testPaginator.pageSize;
        const currentPage = '&currentPage=' + this.testPaginator.pageIndex;
        let initialDate = '&createdAfter=' + this.fromDate + 'T00:00:00&createdBefore=' + this.toDate + 'T23:59:59';
        // if(this.dateFilter != '') {
        //     initialDate = this.dateFilter;
        // }
        console.log("initialDateinitialDate",initialDate);
        console.log("pageSizepageSize",this.pageSize);
        console.log("currentPagecurrentPage",currentPage);

        this.quotesService.getQuotes(initialDate, this.pageSize, currentPage).subscribe((data) => {
            console.log("datadata",data);

            if (data) {
                this.ref.markForCheck()
                this.dummyList = data.quotes;
                this.listData = data.quotes;
                this.dummyPaginatorList = this.dummyList;
                    this.dataSource.filterPredicate = function (data, filter: string): boolean {
                        return data.code.toLowerCase().includes(filter);
                    };
                    this.testPaginator.length = data.pagination.totalResults;
                    setTimeout(() => {
                        this.testPaginator.length = data.pagination.totalResults;
                        this.ref.markForCheck();
                    })
                this.testPaginator.length = data.totalResults;
                this.dataSource.data = this.dummyList;
                this.viewMoreVisible = this.dummyList.length > 12 ? true : false;
                if (this.shareEvents.mobileSearchPage == 'quote') {
                    this.viewMoreItems = this.dummyList.filter(data => data.code.toLowerCase().includes(this.shareEvents.mobileSearchVal));
                    if ( this.viewMoreItems.length > 12 ) {
                        this.dummyList = this.viewMoreItems;
                        this.viewMoreItems = this.viewMoreItems.slice(0, 12);
                    }
                    this.viewMoreVisible = this.dummyList.length > 12 ? true : false;
                    this.listData = this.viewMoreItems;
                } else {
                    this.viewMoreItems = this.dummyList.slice(0, 12);
                }
                this.ref.markForCheck();
                this.commonService.hide();
            } else {
                this.listData = [];
                this.viewMoreItems = [];
                this.commonService.hide();
            }
        }, (error) => {
            this.listData = [];
            this.viewMoreItems = [];
            this.commonService.hide();
        });
    }
    getApiResponse() {
        this.pageSize = '&pageSize=' + this.testPaginator.pageSize;
        const currentPage = '&currentPage=' + this.testPaginator.pageIndex;    
        let initialDate = '&createdAfter=' + this.fromDate + 'T00:00:00&createdBefore=' + this.toDate + 'T23:59:59';
        this.quotesService.getQuotes(initialDate, this.pageSize, currentPage).subscribe((data) => {
            if (data) {
                this.ref.markForCheck()
                this.dummyList = data.quotes;
                this.dummyPaginatorList = this.dummyList;
                this.customPaginator();
                this.viewMoreVisible = data.pagination.totalResults > 12 ? true : false;
                if (this.shareEvents.mobileSearchPage == 'quote') {
                    this.viewMoreItems = this.dummyList.filter(data => data.code.toLowerCase().includes(this.shareEvents.mobileSearchVal));
                    if ( this.viewMoreItems.length > 12 ) {
                        this.dummyList = this.viewMoreItems;
                        this.viewMoreItems = this.viewMoreItems.slice(0, 12);
                    }
                    this.viewMoreVisible = data.pagination.totalResults > 12 ? true : false;
                    this.listData = this.viewMoreItems;
                } else {
                    this.viewMoreItems = this.dummyList.slice(0, 12);
                }
                this.ref.markForCheck();
            } else {
                this.listData = [];
                this.viewMoreItems = [];
            }
        }, (error) => {
            this.listData = [];
            this.viewMoreItems = [];
        });
    }


    customPaginator(event?) {
        this.listData = [];
        if (event) {
            for (let i = (event.pageIndex * event.pageSize); i < ((event.pageIndex + 1) * event.pageSize); i++) {
                if (this.dummyPaginatorList.length > i) {
                    this.listData.push(this.dummyPaginatorList[i])
                }
            }
        }
        else {
            for (let i = (this.testPaginator.pageIndex * this.testPaginator.pageSize); i < ((this.testPaginator.pageIndex + 1) * this.testPaginator.pageSize); i++) {
                if (this.dummyPaginatorList.length > i) {
                    this.listData.push(this.dummyPaginatorList[i])
                }
            }
        }
    }
    setDateRange(event) {

    }
    announceSortChange(sortState: Sort) {
        this.dataSource.data = this.dataSource.data.sort(function (a, b) { return a.pinned - b.pinned });
        if (sortState.direction === 'desc') {
            this.dataSource.data = this.dataSource.data.reverse()
        }
    }

    sortData(sort: Sort) {
        if (!sort.active || sort.direction === '') {
            return;
        }
        this.dataSource.data = this.dataSource.data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'code':
                    return this.compare(a.code, b.code, isAsc, false);
                // case 'requestedDeliveryDate':
                //     return this.compare(a.requestedDeliveryDate, b.requestedDeliveryDate, isAsc, true);
                case 'createdDate':
                    return this.compare(a.createdDate, b.createdDate, isAsc, true);
                case 'expirationDate':
                    return this.compare(a.expirationDate, b.expirationDate, isAsc, true);
                default:
                    return 0;
            }
        });
    }
    compare(a: any, b: any, isAsc: boolean, isDate?: boolean): any {
        if (!isDate) {
            return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
        } else {
            return isAsc ? new Date(b).getTime() - new Date(a).getTime() : new Date(a).getTime() - new Date(b).getTime()
        }
    }

    public doFilter = (value: string) => {
        this.flag = true;
        this.pageSize = '&pageSize=' + this.testPaginator.pageSize;
        const currentPage = '&currentPage=' + this.testPaginator.pageIndex; 
        let initialDate = '&createdAfter=' + this.fromDate + 'T00:00:00&createdBefore=' + this.toDate + 'T23:59:59';
       if(value.length!=0){
        this.quotesService.getSearchQuotes(initialDate, value, this.pageSize, currentPage).subscribe( data => {
            if (data) {
                this.ref.markForCheck()
                this.dummyList = data.quotes;
                this.listData = data.quotes;
                this.dummyPaginatorList = this.dummyList;
                    this.dataSource.filterPredicate = function (data, filter: string): boolean {
                        return data.code.toLowerCase().includes(filter);
                    };
                    this.testPaginator.length = data.pagination.totalResults;
                    setTimeout(() => {
                        this.testPaginator.length = data.pagination.totalResults;
                        this.ref.markForCheck();
                    })
                // this.testPaginator.length = data.totalResults;
               
                this.dataSource.data = this.dummyList;
                this.viewMoreVisible = this.dummyList.length > 12 ? true : false;
                if (this.shareEvents.mobileSearchPage == 'quote') {
                    this.viewMoreItems = this.dummyList.filter(data => data.code.toLowerCase().includes(this.shareEvents.mobileSearchVal));
                    if ( this.viewMoreItems.length > 12 ) {
                        this.dummyList = this.viewMoreItems;
                        this.viewMoreItems = this.viewMoreItems.slice(0, 12);
                    }
                    this.viewMoreVisible = this.dummyList.length > 12 ? true : false;
                    this.listData = this.viewMoreItems;
                } else {
                    this.viewMoreItems = this.dummyList.slice(0, 12);
                    // this.viewMoreItems = [];
                }
                this.ref.markForCheck();
                this.commonService.hide();
            } else {
                this.listData = [];
                this.viewMoreItems = [];
                this.commonService.hide();
            }
        }, (error) => {
            this.listData = [];
            this.viewMoreItems = [];
            this.commonService.hide();
        });

       }
       else{
        this.getList();
       }
    };

    public doFilterStatus = (value: string) => {
        this.listData = JSON.parse(JSON.stringify(this.dummyList));
        this.searchFilter = value;
        if (this.searchValue) {
            this.listData = this.listData.filter((obj) => obj.state.includes(value) && obj.code.toLocaleLowerCase().includes(this.searchValue));
        }
        else {
            this.listData = this.listData.filter((obj) => obj.state.includes(value));
        }
        this.dummyPaginatorList = this.listData;
        this.dataSource = new MatTableDataSource(this.listData);
        this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return data.code.toLowerCase().includes(filter);
        };
        // this.customPaginator(this.paginator)
        // this.dataSource.paginator = this.paginator;
        // setTimeout(() => {
        //     this.dataSource.paginator = this.paginator;
        //     this.ref.markForCheck();
        // })
    };

    changeViewMode(modeValue: boolean) {
        this.selection.clear();
        this.disableButton = modeValue;
        this.viewListMode = modeValue;
        if (this.disableButton != modeValue) {
            this.disableButton = !this.disableButton
        }
        // if (this.viewListMode) {
        //     let listButtonClass = document.getElementsByClassName("list-btn") as HTMLCollectionOf<HTMLElement>;
        //     listButtonClass[0].style.backgroundColor = "#E0E1E2";
        //     listButtonClass[0].style.color = "#495A64"
        //     let buttonClass = document.getElementsByClassName("grid-btn") as HTMLCollectionOf<HTMLElement>;
        //     buttonClass[0].style.backgroundColor = "#003D7A";
        //     buttonClass[0].style.color = "#fff"
        // } else {
        //     let listButtonClass = document.getElementsByClassName("list-btn") as HTMLCollectionOf<HTMLElement>;
        //     listButtonClass[0].style.backgroundColor = "#003D7A";
        //     listButtonClass[0].style.color = "#fff"
        //     let buttonClass = document.getElementsByClassName("grid-btn") as HTMLCollectionOf<HTMLElement>;
        //     buttonClass[0].style.backgroundColor = "#E0E1E2";
        //     buttonClass[0].style.color = "#495A64";
        // }
        // this.getQuotesData();
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
        else if (status == 'CONVERTED')
        return{
            background: '#E0E1E2',
            color: '#495A64',
            width: '130px',
            Text: 'center',
            cursor: 'context-menu'
        }
        else return { background: 'grey', color: '#973937' };
    }

    pageEvent($event) {
        this.testPaginator.pageIndex = $event.pageIndex;
        this.testPaginator.pageSize = $event.pageSize;
        if(this.flag == true){
            // alert(this.searchVal)
            this.doFilter(this.searchVal)
        }
       else{
        this.getList();
       }
    }
    getQuotesData() {
        this.listData = this.dummyList;
        if (this.searchFilter && this.searchValue) {
            this.listData = this.listData.filter((obj) => obj.code.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase()) && obj.state.includes(this.searchFilter));
        } else if(this.searchValue) {
            this.listData = this.listData.filter((obj) => obj.code.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase()));
        } else if(this.searchFilter) {
            this.listData = this.listData.filter((obj) => obj.state.includes(this.searchFilter));
        } else {
            this.listData = this.dummyList;
        }
        // this.dataSource = new MatTableDataSource(this.listData);
        // this.dataSource.paginator = this.paginator;
        // setTimeout(() => {
        //     this.dataSource.paginator = this.paginator;
        //     this.ref.markForCheck()
        // })
    }

    get formatFromDate() {

        return `${this.fromDate?.day}/${this.fromDate?.month}/${this.fromDate?.year}`
    }

    get formatToDate() {
        if (this.toDate?.day) {
            return `${this.toDate?.day}/${this.toDate?.month}/${this.toDate?.year}`
        } else {
            return `${this.fromDate?.day}/${this.fromDate?.month}/${this.fromDate?.year}`;
        }

    }

    public doFilterSelect = (event, value: string, type: any) => {
        this.filterData(type);
        const existingParams = (this.dataSource.filter || '').split(',');
        const param = value.trim();
        const newParams = event.target.checked
            ? [...existingParams, param]
            : existingParams.filter((v) => param !== v);
        this.dataSource.filter = newParams.join(',');
    };


    filterData(dataType) {
        this.dataSource.filterPredicate = (elm, filter) => {
            return (
                filter.split(',').includes('ALL') ||
                filter.split(',').includes(elm[dataType])
            );
        };
    }
    openDateFilterPopUp(content) {
        this.modalRef = this.modalService.open(content, {
            windowClass: 'datePickerPopup',
            centered: true,
            size: 'lg',
        });
        this.modalRef.result.then((result) => {
            if (result === 'success') {
            }
        }, (filterDates: any) => {
            if (filterDates && filterDates != '') {
                this.fromDate = filterDates.split('-')[0];
                this.toDate = filterDates.split('-')[1];
                this.listData = this.dummyList;
                let list = []
                // this.listData.forEach((obj) => {
                //   if ((new Date(obj.createdDate) >= new Date(this.fromDate)) && (new Date(obj.createdDate) <= new Date(this.toDate))) {
                //     list.push(obj);
                //   }
                // });
                this.listData = list;
                this.getQuotesData();
            }
        })
    }

    showViewQuoteClick(quoteValue) {
        
        this.quotesService.getQuotesDetailData(quoteValue).subscribe((data) => {
            if (data) {
                this.quoteDetailViewData = data;
                localStorage.setItem("deliveryModeName",this.quoteDetailViewData.deliveryModeName)
                this.ref.markForCheck()
                this.openViewQuotes();
            }
        })
    }

    checkboxClick(event){
         event.stopPropagation();
    }

    redirectToCheckout(codeQuote,event) {
        this.commonService.setQuoteValue(codeQuote); 
         event.stopPropagation();
         this.selectedUID = localStorage.getItem('selectedIUID');
        const data = {
         userId: this.selectedUID,
         email: this.emailId,
            };
          
        this.quotesService.getActiveQuotesDetailData(data,codeQuote).subscribe((result) => {
            if (result) {
                // let prodIds = [];
                // let prodNames = [];
                result.entries.forEach(element => {
                    // prodIds.push(element.product.code);
                    // prodNames.push(element.product.name);
                    (<any>window).dataLayer.push({
                        'event':'ATC ClicK',
                        'eventCategory':'Add To Cart',
                        'eventAction': 'action', //Pass the product title
                        'productId': element.product.code,
                        'producName': element.product.name,
                        'sku': element.product.code
                    });
                });
                // (<any>window).dataLayer.push({
                //     'event':'ATC ClicK',
                //     'eventCategory':'Add To Cart',
                //     'eventAction': 'action', //Pass the product title
                //     'productId': prodIds,
                //     'producName': prodNames,
                //     'sku': prodIds
                // });
               this.selectedQuoteCheckoutData = result;
               if(this.selectedQuoteCheckoutData != undefined){
                this.commonService.setQlpFlag('QLP');
                this.commonService.setCheckoutData(this.selectedQuoteCheckoutData);
                this.router.navigate(['/orderCheckoutPage']);
               }
               

                // this.quoteDetailViewData = data;
                // this.checkoutDeatilViewData = data.purchaseOrderNumber;
                // this.commonService.setCheckoutData(this.checkoutDeatilViewData);
                // this.router.navigate(['/orderCheckoutPage']);
                
            }
        })

        


    }

    openViewQuotes() {
        this.showViewQuote = true;
    }

    
    dateRangeEmitter(dateRangeData) {
        this.dateFilter = dateRangeData;
        this.fromDate = dateRangeData.substring(14, 24).split('-').reverse().join('-');
        this.toDate = dateRangeData.substring(48, 58).split('-').reverse().join('-');
        // this.dateFilter = '&createdAfter=' + this.fromDate + 'T00:00:00&createdBefore=' + this.toDate + 'T23:59:59';
        this.getList();
        sessionStorage.setItem("dateFilter",this.dateFilter);

        const nextPageParams = '?fromDate='+ this.fromDate.toString() + '&toDate='+ this.toDate.toString();
        this.router.navigate([]).then(result => {
        window.open('/quotesPage' + nextPageParams, '_blank',) ;
        });
        if(this.router.url.includes('?')){
            let fromDate = ''
            let toDate = ''
            
            this.route.queryParams.pipe(first()).subscribe((params) => {
              fromDate = params.fromDate;
              toDate = params.toDate;
            });
            const currentQueryParam = '?fromDate='+ fromDate + '&toDate='+ toDate;
            setTimeout(() => {
              window.location.href = window.location.pathname+currentQueryParam;
            }, 5);
          } else {
            setTimeout(() => {
              window.location.reload();
            }, 5);
          }

        // window.open('/quotesPage', "_blank");
        
    }


    datesUpdated(event) {
   console.log("datesUpdated",event);
   if(event.startDate && event.endDate){
           // @ts-ignore
      //  this.startDateRange = moment(this.selected?.startDate?._d).format('DD-MM-YYYY');
           // @ts-ignore
        // this.endDateRange = moment(this.selected?.endDate?._d).format('DD-MM-YYYY');
        // this.fromDate =  this.startDateRange;
        // this.toDate = this.endDateRange;
       
        console.log("this.selected?.startDate?._d",this.selected?.startDate?._d);
        this.fromDate =moment(this.selected?.startDate?._d).format('DD-MM-YYYY');
        this.toDate =moment(this.selected?.endDate?._d).format('DD-MM-YYYY');
       console.log(" this.fromDate",  this.fromDate);
       console.log(" this.toDate",  this.toDate);
       this.getList();
      }
    }
   


    openFilterPopup(content) {

        this.modalRef = this.modalService.open(content, {
            windowClass: 'filterPopupQuotes',
            centered: true,
            size: 'md',
        });
    }

    viewMoreClick() {
        if (!this.isMobFilter) {

            this.pageSize = '&pageSize=' + this.testPaginator.pageSize;
            let newPageIndex = this.currentPageIndex++;
            let currentPage = '&currentPage=' + newPageIndex;    
            let initialDate = '&createdAfter=' + this.fromDate + 'T00:00:00&createdBefore=' + this.toDate + 'T23:59:59';
            
            this.quotesService.getQuotes(initialDate, this.pageSize, currentPage).subscribe((data) => {
                if (data) {
                    for(var i=0; i < data.quotes.length; i++) {
                        this.viewMoreItems.push(data.quotes[i]);
                    }
                    this.viewMoreVisible = data.pagination.totalResults > 12 ? true : false;
                    this.ref.markForCheck();
                } else {
                    this.listData = [];
                    this.viewMoreItems = [];
                }
            }, (error) => {
                this.listData = [];
                this.viewMoreItems = [];
            });
        } else {
            this.viewMoreItems = this.dataAfterFilter.slice(0, this.currentValueMob);
            if (this.dataAfterFilter.length > 12 && this.viewMoreItems.length != this.dataAfterFilter.length) {
                this.viewMoreVisible = true;
            }
            else {
                this.viewMoreVisible = false;
            }
            this.currentValueMob += 12;
        }
    }

    mobFilter(filterParams: any) {
        this.paramsFromFilter.status = filterParams.status;
        this.viewMoreItems = this.dummyList;
        var statusFilters = this.viewMoreItems;
        this.dataAfterFilter = this.viewMoreItems;
        this.isMobFilter = true;

        if (filterParams.status !== 'ALL') {
            if (filterParams.status.length > 0) {
                statusFilters = statusFilters.filter((item: any) => {
                    for (var i = 0; i < filterParams.status.length; i++) {
                        if (filterParams.status[i] == item['state']) {
                            return item;
                        }
                    }
                })

                this.viewMoreItems = statusFilters;
                this.dataAfterFilter = statusFilters
                if (this.dataAfterFilter.length > 12) {
                    this.viewMoreVisible = true;
                } else {
                    this.viewMoreVisible = false;
                }
            }
        }
        this.viewMoreItems = this.dataAfterFilter.slice(0, 12);
        if (this.dataAfterFilter.length > 12 && this.viewMoreItems.length != this.dataAfterFilter.length) {
            this.viewMoreVisible = true;
        }
        else {
            this.viewMoreVisible = false;
        }
    }

    downloadCSV(quoteNo, event){
        event.stopPropagation();
        this.commonService.show();
        this.tempInvoiceNo = [quoteNo];
        this.service.getQuoteDownloadInvoiceCSV(quoteNo).subscribe(
            (resp: any) => {
                for(var i =0; i< resp.csvQuoteContent.entry.length; i++){
                    var myBlob = new Blob([resp.csvQuoteContent.entry[i].value]);
                    this.downloadFile(myBlob, 'QUOTE_' + resp.csvQuoteContent.entry[i].key + '.csv');
                    this.commonService.hide();
                }
            },
            (error) => {
              this.downloadFile(error.body, 'QUOTE_' + this.tempInvoiceNo);
              this.commonService.hide();
            }
          )
    }

    downloadPDF(quoteNo, event){
        event.stopPropagation();
        this.commonService.show();
        this.tempInvoiceNo = quoteNo;
        this.service.getQuoteDownloadPDF([quoteNo]).subscribe(
        (resp: HttpResponse<Blob>) => {
            this.downloadPdfFile(resp, 'Quote_' + this.tempInvoiceNo);
            this.commonService.hide();
        },
        (error) => {
            //Error callback
            this.downloadPdfFile(error.body, 'Quote_' + this.tempInvoiceNo);
            this.commonService.hide();
        }
        );
    }
    downloadPdfFile(data: any, fileName: string) {
        const apiEndpointURL = environment.siteUrl
        const a = document.createElement('a');
        const url = apiEndpointURL + data.downloadUrl;
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }

    downloadFile(data: any, fileName: string) {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(data);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }

      clearFilterData() {
        let searchKey = (this.searchKeyValue.nativeElement.value = '');
        this.doFilter(searchKey);
        this.dataSource.data = this.dummyData;
        this.selection.clear();
      }

      multipleDownloadCSV(val){
        this.commonService.show();
        for(var k = 0; k<val.length; k++){
        var quoteNo = val[k].code;
        this.tempInvoiceNo = [quoteNo];
        this.service.getQuoteDownloadInvoiceCSV(quoteNo).subscribe(
            (resp: any) => {
                for(var i =0; i< resp.csvQuoteContent.entry.length; i++){
                    var myBlob = new Blob([resp.csvQuoteContent.entry[i].value]);
                    this.downloadFile(myBlob, 'QUOTE_' + resp.csvQuoteContent.entry[i].key + '.csv');
                    this.commonService.hide();
                }
            },
            (error) => {
              this.downloadFile(error.body, 'QUOTE_' + this.tempInvoiceNo);
              this.commonService.hide();
            }
          )
        }
      }
}

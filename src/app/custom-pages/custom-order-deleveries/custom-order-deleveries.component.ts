
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { ActiveCartService, MultiCartService } from '@spartacus/core';
import { SharedMethodsService } from 'src/app/shared-components/shared-methods.service';
import { AccountService } from 'src/app/core/service/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { first } from 'rxjs/operators';
import moment from 'moment';
import { Dayjs } from 'dayjs/esm';
const ELEMENT_DATA: PeriodicElement[] = [];

export interface PeriodicElement {
  creditLimit: string;
  inviteStatus: string;
  invitedBy: string;
  invitedByName: string;
  invitedOn: string;
  mobileNumber: string;
  listName: string;
  permissionList: [];

  selectedTradeAccount: string;
  temporaryAccess: boolean;
  type: string;
  productCount: string;
}

@Component({
  selector: 'app-custom-order-deleveries',
  templateUrl: './custom-order-deleveries.component.html',
  styleUrls: ['./custom-order-deleveries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@HostListener('document:mousedown', ['$event'])

export class CustomOrderDeleveriesComponent implements OnInit, OnDestroy {
  modalRef: any;
  hasData: boolean = false;
  activeBtn: string = 'All';
  editMode: boolean = false;
  selectedMyListData: any;
  isDetailTemplate: boolean = false;
  response: any;
  fromDate: any;
  toDate: any;
  selected :any = {};
  dateFilter: string = '';
  displayedColumns: string[] = [
    'code',
    'purchaseOrderNumber',
    'orderdate',
    'reqdate',
    'type',
    'branch',
    'address',
    'status',
  ];

  dummyData: any = [];
  guid: number;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filterDropdown', { static: false }) filterDropdown: ElementRef;
  testPaginator = {
    length: 100,
    pageSize: 12,
    pageIndex: 0,
  };
  currentItem: any = {};
  emailId: any;
  selectedUID: string;
  dataSource: any;
  infoMessage: string = '';
  successInd: boolean = false;
  errorInd: boolean = false;
  showloader: boolean;
  noDataMsg = 'No Orders Found';
  isCreateInviteGroupPermissions: boolean;
  showPOD: boolean = false;
  isMobile: boolean = false;
  mobData: any;
  searchText: string = '';
  viewMoreItems: any = [];
  viewMoreVisible: boolean = false;
  currentValue = 24;
  currentValueMob = 24;
  pageSize: any;
  paramsFromFilter: any = {};
  dataAfterFilter: any;
  getdataSource:any;
  isMobFilter: boolean = false;
  isStatusFilterClick: boolean = false;
  orderStatus: string = '';
  orderType: string = '';
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
  mobileSearchSubscription: Subscription;
  constructor(
    private modalService: NgbModal,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public commonService: CommonService,
    public myListService: MyListService,
    public activeCartService: ActiveCartService,
    public multiCartService: MultiCartService,
    public sharedMethodsService: SharedMethodsService,
    public accountService: AccountService,
    public router: Router,
    private route: ActivatedRoute,
    public ref: ChangeDetectorRef,
    public shareEvents: ShareEvents,
    public datePipe: DatePipe,
    private _eref: ElementRef) {
    this.isMobile = CommonUtils.isMobile();
            let now = new Date();
           // now.setMonth(now.getMonth() - 1);
            this.toDate = moment().subtract(1, 'month').format('DD-MM-YYYY');
            this.fromDate = moment().format('DD-MM-YYYY');
            this.selected = {startDate:this.toDate, endDate:this.fromDate};
            console.log(this.fromDate);
            console.log(this.toDate);
            console.log(this.selected);
            this.dateFilter = '&createdAfter=' + this.toDate + 'T00:00:00&createdBefore=' + this.fromDate + 'T23:59:59';
           // this.datesUpdated(this.selected);
            this.getList();

    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.getList();
      }
    });
  }
  allData(value: string) {
    if (value == 'All') {
      this.dataSource = new MatTableDataSource<PeriodicElement>(
      );
    } else if (value == 'Current Orders') {
      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.dummyData.filter((x) => x.category === 'Current Orders')
      );
    } else if (value == 'Past Orders') {
      this.dataSource = new MatTableDataSource<PeriodicElement>(
        this.dummyData.filter((x) => x.category === 'Past Orders')
      );
    }
  }
  
  ngOnInit(): void {
         this.getList();
        sessionStorage.removeItem("dateFilter");

    this.mobileSearchSubscription = this.shareEvents.mobileSearchSubject.subscribe((val) => {
      if (val != undefined) {
        this.getList();
      }
    })
    this.commonService.show();
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.dummyData);
    
   
  }

  ngOnDestroy(): void {
    if (this.mobileSearchSubscription) {
      this.mobileSearchSubscription.unsubscribe()
    }
  }


 

  getList() {
    const data = this.dateFilter;
    let searchText;
    if (!this.isMobile) {
      this.pageSize = '&pageSize=' + this.testPaginator.pageSize;
      searchText = '&searchText=' + this.searchText;
    } else {
      this.pageSize = undefined;
      if (this.shareEvents.mobileSearchPage == 'orderDelivery') {
        searchText = '&searchText=' + this.shareEvents.mobileSearchVal;
      } else {
        searchText = '&searchText=' + this.searchText;
      }
    }
    const statuses = '&statuses=' + this.orderStatus ;
    const orderType ='&orderType=' + this.orderType;
    const currentPage = '&currentPage=' + this.testPaginator.pageIndex;
    this.commonService.show();
    this.accountService.getOrderList(data, this.pageSize, currentPage, searchText, statuses , orderType).subscribe((res) => {
      if (res && res.orders && res.orders.length > 0) {
        this.hasData = true;
        this.dummyData.length = 0;
        this.dummyData = res.orders;
        let pagination = res.pagination;
        this.dummyData.forEach(element => {
          element.orderdate = element.orderDate;
          element.reqdatetime = element.orderDate;
          if (element.requestedDeliveryDate != undefined) {
            const date = element.requestedDeliveryDate.split(' ');
            element.requestedDeliveryDate = date[0] + 'T' + date[1];
          }
          element.address = element.deliveryAddress?.formattedAddress;
          element.type = element.orderType == 'Delivery' ? 'Delivery' : 'Click & Collect';
          element.branch = element.region?.name;
          element.unit = {};
        });
        this.testPaginator.length = pagination.totalResults;
        this.dataSource.data = this.dummyData;
        this.mobData = this.dummyData;
        this.viewMoreItems = this.dummyData.slice(0, 12);
        if (this.dummyData.length > 12 && this.viewMoreItems.length != this.dummyData.length) {
          this.viewMoreVisible = true;
        }
        else {
          this.viewMoreVisible = false;
        }
        this.ref.markForCheck();
        // setTimeout(() => {
        //   if (this.sort) {
        //     this.sort.sort(<MatSortable>({ id: 'purchaseOrderNumber', start: 'desc' }));
        //     this.sort.sort(<MatSortable>({ id: 'orderjobref', start: 'desc' }));
        //     this.sort.sort(<MatSortable>({ id: 'orderdate', start: 'desc' }));
        //     this.sort.sort(<MatSortable>({ id: 'reqdate', start: 'desc' }));
        //     this.sort.sort(<MatSortable>({ id: 'code', start: 'desc' }));
        //     this.dataSource.sort = this.sort;
        //   }
        //   this.dataSource.data = this.dataSource.data;
        //   this.ref.markForCheck();
        // });
        // this.ref.detectChanges();
        this.commonService.hide();
      } else {
        this.dataSource.data = [];
        this.viewMoreItems = [];
        this.commonService.hide();
        this.ref.markForCheck();
      }
    }, (error) => {
      this.hasData = false;
      this.viewMoreItems = [];
      this.commonService.hide();
      this.ref.markForCheck();
    })
  }

  viewMoreClick() {
    if (!this.isMobFilter) {
      this.viewMoreItems = this.dummyData.slice(0, this.currentValue);
      if (this.dummyData.length > 12 && this.viewMoreItems.length != this.dummyData.length) {
        this.viewMoreVisible = true;
      }
      else {
        this.viewMoreVisible = false;
      }
      this.currentValue += 12;
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
        this.getList();
      }
    })
  }
  public colum_click(args: any): void {
    this.guid = args;
    this.isDetailTemplate = true;
  }

  public doFilter = (value: string) => {
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.code.toLowerCase().includes(filter);
    };
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  public doFilterPurchase = (value: string) => {
    this.searchText = value.trim().toLocaleLowerCase();
    this.commonService.show();
    this.getList();
    // this.dataSource.filterPredicate = function (data, filter: string): boolean {
    //   return data.purchaseOrderNumber.toLowerCase().includes(filter);
    // };
    // this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  status(status) {
    let value = '';
    if (status == 'DISPATCHED') value = 'on_way';
    else if (status == 'AWAITING_DISPATCH') value = 'await_dispatch';
    else if (status == 'READY TO COLLECT') value = 'ready_collect';
    else if (status == 'RECEIVED') value = 'received';
    else if (status == 'PARTLY_DISPATCHED') value = 'await_dispatch';
    else if (status == 'PARTLY_COMPLETED') value = 'part_order_complete';
    else if (status == 'COMPLETED') value = 'Complete';
    else if (status == 'BACK_ORDERED') value = 'back_order';
    else if (status == 'PENDING') value = 'received';
    else if (status == 'ORDER_RECEIVED') value = 'received';
    else if (status == 'ORDER_PROCESSING')
      value = 'part_await_dispatch';
    else value = '';
    return value;
  }
  announceSortChange(sortState: Sort) {

    if (!sortState.active || sortState.direction === '') {
      this.dataSource.data = this.dataSource.data.reverse();
      return;
    }
      this.dataSource.data = this.dataSource.data.sort((a, b) => {
        // return a.pinned - b.pinned;
        const isAsc = sortState.direction === 'asc';
        switch (sortState.active) {
          case 'code':
            return this.compare(a.code, b.code, isAsc);
          case 'purchaseOrderNumber':
            return this.compare(a.purchaseOrderNumber, b.purchaseOrderNumber, isAsc);
          case 'orderdate':
            return this.compare(a.orderdate, b.orderdate, isAsc);
          case 'reqdate':
            return this.compare(a.reqdate, b.reqdate, isAsc);
          default:
            return 0;
        }
  
  
      });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public doFilterSelect = (event, value: string, type: any) => {
    if (event.currentTarget.checked == true) {
      this.orderStatus = this.orderStatus != '' ? this.orderStatus + ',' + value : value;
      this.getList();
    } else {
      let statuses: any = this.orderStatus.split(',');
      const index = statuses.findIndex((element: string) => element == value);
      if (index > -1) {
        statuses.splice(index, 1);
        this.orderStatus = statuses;
      }
      this.orderStatus = statuses.toString();
      this.getList();
    }
    this.isStatusFilterClick = false;

  };
  doStatusFilterSelect = (event, value: string, type: any) => {
    value = decodeURIComponent(value);
    if (event.currentTarget.checked == true) {
      this.orderType = this.orderType != '' ? this.orderType + ',' + value : value;
      this.getList();
    } else {
      let statuses: any = this.orderType.split(',');
      const index = statuses.findIndex((element: string) => element == value);
      if (index > -1) {
        statuses.splice(index, 1);
        this.orderType = statuses;
      }
      this.orderType = statuses.toString();
      this.getList();
    }
    this.isStatusFilterClick = false;
    // this.filterData(type);
    // const existingParams = (this.dataSource.filter || '').split(',');
    // const param = value.trim();
    // const newParams = event.target.checked
    //   ? [...existingParams, param]
    //   : existingParams.filter((v) => param !== v);
    // this.dataSource.filter = newParams.join(',');
  }
  openFilterPopup(content) {

    this.modalRef = this.modalService.open(content, {
      windowClass: 'orderDeliveriesFilterPopup',
      centered: true,
      size: 'md',
    });
  }
  mobFilter(filterParams: any) {
    this.paramsFromFilter.type = filterParams.type;
    this.paramsFromFilter.status = filterParams.status;
    this.viewMoreItems = this.mobData;
    var typeFilters = this.viewMoreItems;
    this.dataAfterFilter = this.viewMoreItems;
    this.isMobFilter = true;
    var statusarr = [];

    if (filterParams.status !== 'ALL') {

      if (filterParams.status.length > 0) {
        let searchText;
        this.pageSize = undefined;
        const statuses = '&statuses=' + filterParams.status.join();
        const orderType ='&orderType=' + this.orderType;
        this.accountService.getOrderList(this.dateFilter, this.pageSize, '&currentPage=', '&searchText=', statuses, orderType).subscribe((res) => {
          if (res && res.orders && res.orders.length > 0) {
            this.ordersAfterFilter(res.orders);

          } else {
            this.viewMoreItems = res.orders;
            this.dataAfterFilter = [];
          }
          this.viewMoreItemVisible();
          this.ref.markForCheck();
        }, (error) => {
        })
        if (this.dataAfterFilter.length > 12) {
          this.viewMoreVisible = true;
        } else {
          this.viewMoreVisible = false;
        }
        this.ref.markForCheck();
      }

      if (filterParams.type.length > 0) {

        let searchText;
        this.pageSize = undefined;
        const statuses = '&statuses=';
        const orderType ='&orderType=' + filterParams.type.join();
        this.accountService.getOrderList(this.dateFilter, this.pageSize, '&currentPage=', '&searchText=', statuses, orderType).subscribe((res) => {
          if (res && res.orders && res.orders.length > 0) {
            this.ordersAfterFilter(res.orders);

          } else {
            this.viewMoreItems = res.orders;
            this.dataAfterFilter = [];
          }
          this.viewMoreItemVisible();
          this.ref.markForCheck();
        }, (error) => {
        })
        if (this.dataAfterFilter.length > 12) {
          this.viewMoreVisible = true;
        } else {
          this.viewMoreVisible = false;
        }
        this.ref.markForCheck();
      }

    }
    this.viewMoreItemVisible();
    this.ref.markForCheck();
  }

  ordersAfterFilter(orders){
    this.viewMoreItems = orders;
    this.viewMoreItems.forEach(element => {
      element.orderdate = element.orderDate;
      element.reqdatetime = element.orderDate;
      if (element.requestedDeliveryDate != undefined) {
        const date = element.requestedDeliveryDate.split(' ');
        element.requestedDeliveryDate = date[0] + 'T' + date[1];
      }
      element.address = element.deliveryAddress?.formattedAddress;
      element.type = element.orderType == 'Delivery' ? 'Delivery' : 'Click & Collect';
      element.branch = element.region?.name;
      element.unit = {};
    });
    this.dataAfterFilter = this.viewMoreItems;
  }
  viewMoreItemVisible() {
    this.viewMoreItems = this.dataAfterFilter.slice(0, 12);
    if (this.dataAfterFilter.length > 12 && this.viewMoreItems.length != this.dataAfterFilter.length) {
      this.viewMoreVisible = true;
    }
    else {
      this.viewMoreVisible = false;
    }
  }
  filterData(dataType) {
    this.dataSource.filterPredicate = (elm, filter) => {
      return (
        filter.split(',').includes('ALL') ||
        filter.split(',').includes(elm[dataType])
      );
    };
  }

  pageEvent($event) {
    this.commonService.show();
    this.testPaginator.pageIndex = $event.pageIndex;
    this.testPaginator.pageSize = $event.pageSize;
    this.getList();

  }
  placeOrder() {
    const data = {
      orderCode: '00041000',
      userId: this.emailId,
      fields: 'DEFAULT'
    }
  }
  setDateRange(event) {
    this.fromDate = event.start;
    this.toDate = event.end;
    this.getList();
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
         this.dateFilter = '&createdAfter=' + this.fromDate + 'T00:00:00&createdBefore=' + this.toDate + 'T23:59:59';
       this.getList();
       }
     }

  dateRangeEmitter(dateRangeData) {
    this.dateFilter = dateRangeData;
   // console.log("Date Range Selection:",dateRangeData);
    this.fromDate = dateRangeData.substring(14, 24).split('-').reverse().join('-');
    this.toDate = dateRangeData.substring(48, 58).split('-').reverse().join('-');
    // this.dateFilter = '&createdAfter=' + this.fromDate + 'T00:00:00&createdBefore=' + this.toDate + 'T23:59:59';
    // console.log("Date Filter:", this.dateFilter)
    this.getList();
    sessionStorage.setItem("dateFilter",this.dateFilter);

    const nextPageParams = '?fromDate='+ this.fromDate.toString() + '&toDate='+ this.toDate.toString();
    this.router.navigate([]).then(result => {
    window.open('/my-orders-deliveries' + nextPageParams, '_blank',) ;
    });
    if(this.router.url.includes('?')){
      let fromDate = ''
      let toDate = ''
      
      this.route.queryParams.pipe(first()).subscribe((params) => {
        fromDate = params.fromDate;
        toDate = params.toDate;
      });
      const currentQueryParam = '?fromDate='+ fromDate + '&toDate='+ toDate;
      console.log("currentQueryParam",currentQueryParam);
      setTimeout(() => {
        window.location.href = window.location.pathname+currentQueryParam;
      }, 5);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 5);
    }
  }
  created(event) {
    this.showPOD = event;
  }
  statusDropdown() {
    this.isStatusFilterClick = !this.isStatusFilterClick;
  }
  typeDropdown() {
    this.isStatusFilterClick = false;
  }
  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (this.filterDropdown) {
      if (event.target.contains(this.filterDropdown.nativeElement)) {
        this.isStatusFilterClick = false;
      }
    }
  }
}

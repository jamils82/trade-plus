import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { invoiceAdjustmentService } from 'src/app/core/service/invoice_adjustments.service';
import { StatementEmailDialogComponent } from '../statements/statements.component';
import { HttpResponse } from '@angular/common/http';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { elementAt, first } from 'rxjs/operators';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DownloadFormatPopupComponent } from './download-format-popup/download-format-popup.component';
import moment from 'moment';
import { Dayjs } from 'dayjs/esm';
import { MultidownloadFormatComponent } from './multidownload-format/multidownload-format.component';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-invoices-and-adjustments',
  templateUrl: './invoices-and-adjustments.component.html',
  styleUrls: ['./invoices-and-adjustments.component.scss'],
})
export class InvoicesAndAdjustmentsComponent implements OnInit {
  isSearchFilterDropdownExpand: boolean = false;
  searchInputFilter = new FormControl('Search By');
  searchTerms= ['Item Code', 'Order/Job Ref.', 'Invoice/Credit No.', 'Sales Order No.', 'Brand'];
  searchInput = new FormControl('');
  selectedActiveItem = 'All';
  fromDate: any;
  toDate: any;
  userActivity:any;
  modalRef: any;
  istartDate:any;
  priceDownload:boolean = false;
  iendDate:any;
  listData: any = [];
  individualListData: any = [];
  invoiceDetailData: any;
  dataSource: any;
  individualDataSource: Data;
  docType: string = 'ALL';
  status: string = 'ALL';
  displayedColumns: string[] = [
    'select',
    'date',
    'type',
    'invoiceNo',
    'orderJobRef',
    'salesOrderNo',
    'branch',
    'total',
    'outstanding',
    'status',
    'Actions',
  ];
  individualInvoiceDisplayedColumns: string[] = [
    'itemCode',
    'deliveryRef',
    'itemDesc',
    'uom',
    'quantity',
    'unitPriceEXCL',
    'unitPriceINCL',
    'extPrice',
    'Actions',
  ];
  dummyData: any;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchKeyValue') searchKeyValue;
  testPaginator = {
    length: 100,
    pageSize: 100,
    pageIndex: 0,
  };
  isParticularInvoice = true;
  blob: Blob;
  queryParams: Params = { invoice: 'yes' };
  isPagination: boolean = false;
  isMobile: boolean = false;
  mobData: any = [];
  mobData1: any = [];
  viewMoreItems: any = [];
  viewMoreItems1: any = [];
  viewMoreVisible: boolean = false;
  viewMoreVisible1: boolean = false;
  currentValue = 24;
  currentValue1 = 24;
  startDateRange :any;
  endDateRange :any;
  paramsFromFilter: any = {};
  dataAfterFilter: any;
  isMobFilter: boolean = false;
  currentValueMob = 24;
  getdataSource:any;
  getdataDateSource:any;
  public tempInvoiceNo;
  public isStatusAll: boolean = false;
  public isOpen: boolean = false;
  public isPaid: boolean = false;
  public isTypeAll: boolean = false;
  public isInv: boolean = false;
  public isCrd: boolean = false;
  searchFilter: string;
  selected :any = {};
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
  searchBoxDisable: boolean = true;
  itemSelected: any;
  pageSize: any;
  sortInvoiceOrder:boolean = true;
  sortBy: any;
  filteredData: any[];
  dummyList: unknown[];
  invoiceList:any;
  invoicesNotFound: boolean;
  dummyPaginatorList: unknown[];
  isTextAreaDisabled: boolean = true;
  searchKey: string;
  sortType: any;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public ref: ChangeDetectorRef,
    public commonService: CommonService,
    public service: invoiceAdjustmentService,
    public shareEvents: ShareEvents,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {
   // this.alwaysShowCalendars = true;
    this.toDate = moment().format('YYYY-MM-DD');
    this.fromDate = moment().subtract(1, 'month').format('YYYY-MM-DD');
    this.selected = {startDate:moment(this.fromDate).format('DD/MM/YYYY'), endDate:moment(this.toDate).format('DD/MM/YYYY')};
    this.refreshData(
      this.fromDate,
      this.toDate,
      this.testPaginator.pageSize,
      this.testPaginator.pageIndex + 1,
      this.docType,
      this.status
      );
    }
   
  

  dateFormateService(getdate){
    const splitArr = getdate?.split('-')
    return splitArr[2] + '/' + splitArr[1] + '/' + splitArr[0];

  }

  refreshData(
    startDate,
    EndDate,
    pageSize,
    pageNumber,
    docType,
    status
  ) {
    this.commonService.show();
      if(this.searchKey){
       this.getInvoiceWithSearch(startDate, EndDate, pageSize, pageNumber,docType, status, this.searchKey)
      }
      else{
        this.getInvoiceList(startDate, EndDate, pageSize, pageNumber,docType, status)
      }
    }

  public obsKeysToString(o: object) {
    if (o === null) {
      return '';
    }
    let k = Object.keys(o);
    let sep = ', ';
    return k
      .map((key) => o[key])
      .filter((v) => v)
      .join(sep);
  }

  ngOnInit(): void {
    // let queryParam = this.router.url.split('invoicePage/');
    // this.isMobile = CommonUtils.isMobile();
    // this.shareEvents.mobileSearchSubject.subscribe((val) => {
    // });
    

    // this.invoiceList.paginator = this.paginator;
    // this.dataSource.filterPredicate = (data, filter) => {
    //   const filterFormatValue = filter.trim().toLowerCase();
    //   const nestedObjFilter = (obj: any): any => {
    //     let returnVal = '';
    //     obj.jobRef = obj.customerContext.customerPOReference;
    //     obj.salesNum = obj.order.orderId;
    //     Object.keys(obj).forEach((key: any) => {
    //       if (key === 'docNumber' || key == 'jobRef'|| key == 'salesNum') {
    //         returnVal = returnVal + ' ' + obj[key];
    //       }
    //     });
    //     return returnVal.trim().toLowerCase();
    //   };

    //   return nestedObjFilter(data).includes(filterFormatValue);
    // };

    this.invoiceList = new MatTableDataSource(this.filteredData);
    this.invoiceList.paginator = this.paginator;
    this.dataSource = new MatTableDataSource(this.dummyList);
    this.individualDataSource = new MatTableDataSource(this.individualListData);
    
    console.log("Datasouce length:", this.dataSource.filteredData.length)

  }

  getInvoiceList(startDate, EndDate, pageSize, pageNumber,docType, status){
    this.service
      .getInvoiceList(startDate, EndDate, pageSize, pageNumber, docType, status)
      .subscribe((data) => {
        if(data.invoices.length > 0) {
          this.commonService.hide();
          this.invoiceList = data.invoices;
          this.filteredData = data.invoices;
          this.dummyList = data.invoices;
          this.invoicesNotFound = false;
          this.dummyPaginatorList = this.dummyList;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
          return data.code.toLowerCase().includes(filter);
          };
          this.testPaginator.length = data.additionalProperties[0].value;
          setTimeout(() => {
          this.testPaginator.length = data.additionalProperties[0].value;
          this.ref.markForCheck();
          })
          this.testPaginator.length = data.totalResults;
          console.log("Test paginator length:", this.testPaginator.length)
          this.dataSource.data = this.dummyList;
          this.viewMoreVisible = this.dummyList.length > 12 ? true : false;
        }
        else{
          this.invoiceList = [];
          this.invoicesNotFound = true;
        }
        this.commonService.hide();
      });
      
  }

getInvoiceWithSearch(startDate, EndDate, pageSize, pageNumber,docType, status, searchKey){
  this.service
      .getInvoiceSearch(startDate, EndDate, pageSize, pageNumber, searchKey, this.itemSelected, docType, status)
      .subscribe((data) => {
        if(data.invoices){
          if(data.invoices.length > 0) {
            this.commonService.hide();
            this.invoiceList = data.invoices;
            this.filteredData = data.invoices;
            this.dummyList = data.invoices;
            this.invoicesNotFound = false;
            this.dummyPaginatorList = this.dummyList;
            this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return data.code.toLowerCase().includes(filter);
            };
            this.testPaginator.length = data.additionalProperties[0].value;
            setTimeout(() => {
            this.testPaginator.length = data.additionalProperties[0].value;
            this.ref.markForCheck();
            })
            this.testPaginator.length = data.totalResults;
            console.log("Test paginator length:", this.testPaginator.length)
            this.dataSource.data = this.dummyList;
            this.viewMoreVisible = this.dummyList.length > 12 ? true : false;
          }
          else{
            this.invoiceList = [];
            this.invoicesNotFound = true;
            this.commonService.hide();
          }
        }
        else{
          this.invoiceList = [];
          this.invoicesNotFound = true;
          this.commonService.hide();
        }
        
      });
}

choosedDate(event){
event.preventDefault();
event.stopPropagation();
// console.log("event",event);
}


  openFilterPopup(content) {
    this.modalRef = this.modalService.open(content, {
      windowClass: 'filterinvoices',
      centered: true,
      size: 'md',
    });
  }
  viewMoreOnLoad(data) {
    if (this.shareEvents.mobileSearchPage == 'invoice') {
      this.mobData = data.filter((data) =>
        data.docNumber.toLowerCase().includes(this.shareEvents.mobileSearchVal)
      );
    } else {
      this.mobData = data.slice(0, 12);
    }
    if (data.length > 12 && this.mobData.length != data.length) {
      this.viewMoreVisible = this.mobData.length > 11 ? true : false;
    } else {
      this.viewMoreVisible = false;
    }
    this.ref.markForCheck();
  }
  viewMoreClick() {
    if (!this.isMobFilter) {
      this.mobData = this.dummyData.slice(0, this.currentValue);
      if (
        this.dummyData.length > 12 &&
        this.mobData.length != this.dummyData.length
      ) {
        this.viewMoreVisible = true;
      } else {
        this.viewMoreVisible = false;
      }
      this.currentValue += 12;
    } else {
      this.mobData = this.dataAfterFilter.slice(0, this.currentValueMob);
      if (
        this.dataAfterFilter.length > 12 &&
        this.mobData.length != this.dataAfterFilter.length
      ) {
        this.viewMoreVisible = true;
      } else {
        this.viewMoreVisible = false;
      }
      this.currentValueMob += 12;
    }
  }
  pageEvent($event: any) {
    console.log("EVENTTT",$event)
    this.testPaginator.pageIndex = $event.pageIndex;
    this.testPaginator.pageSize = $event.pageSize;
    this.invoiceList.paginator = this.paginator;
    
    this.refreshData(
      this.fromDate,
      this.toDate,
      this.paginator.pageSize,
      $event.pageIndex + 1,
      this.docType,
      this.status
    );
  }
  sortData(sortType) {
    this.sortType = sortType
    this.commonService.show();
    this.sortInvoiceOrder = !this.sortInvoiceOrder;
    if(sortType.active == 'date'){
      this.sortBy = 'invoice_date';
    }
    else if(sortType.active == 'invoiceNo'){
      this.sortBy = 'invoice_number';
    }
    else if(sortType.active == 'orderJobRef'){
      this.sortBy = 'customer_order_ref';
    }
    else if(sortType.active == 'salesOrderNo'){
      this.sortBy = 'sales_order_number';
    }
    else if(sortType.active == 'branch'){
      this.sortBy = 'branch_name';
    }
    if(this.searchKey){
      // this.itemSelected
      this.pageSize = this.testPaginator.pageSize;
      const currentPage = this.testPaginator.pageIndex +1;
      this.service.sortInvoiceWithText(this.sortInvoiceOrder, currentPage, this.pageSize,this.sortBy, this.fromDate, this.toDate, this.docType, this.status, this.searchKey, this.itemSelected).subscribe((res)=> {
        this.invoiceList = [];
        this.invoiceList = res.invoices;
        this.commonService.hide();
      })
    }
    else {
      this.pageSize = this.testPaginator.pageSize;
    const currentPage = this.testPaginator.pageIndex + 1;
    this.service.sortInvoice(this.sortInvoiceOrder, currentPage, this.pageSize,this.sortBy, this.fromDate, this.toDate, this.docType, this.status).subscribe((res)=> {
      this.invoiceList = [];
      this.invoiceList = res.invoices;
      this.commonService.hide();
    })
    }
  }
  compare(a: any, b: any, isAsc: boolean, isDate?: boolean): any {
    if (!isDate) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    } else {
      return isAsc
        ? new Date(b).getTime() - new Date(a).getTime()
        : new Date(a).getTime() - new Date(b).getTime();
    }
  }

  public doFilterSelect = (event, value: string, type: any) => {
    document.getElementsByTagName('div')[0].click();
    this.filterData(type);
    if (type === 'docType') {
      if (value === 'ALL') {
        this.isInv = this.isCrd = event.target.checked;
        this.docType = 'ALL';
      } else if (this.isInv && this.isCrd) {
        this.isTypeAll = true;
        this.docType = 'ALL';
      } else {
        this.isTypeAll = false;
        this.docType = this.isInv ? 'INV' : this.isCrd ? 'CRD' : 'ALL';
      }
    }
    if (type === 'status') {
      if (value === 'ALL') {
        this.isPaid = this.isOpen = event.target.checked;
        this.status = 'ALL';
      } else if (this.isPaid && this.isOpen) {
        this.isStatusAll = true;
        this.status = 'ALL';
      } else {
        this.isStatusAll = false;
        this.status = this.isPaid ? 'PAID' : this.isOpen ? 'OPEN' : 'ALL';
      }
    }
    const existingParams = (this.dataSource.filter || '').split(',');
    const param = value.trim();
    const newParams = event.target.checked
      ? [...existingParams, param]
      : existingParams.filter((v) => param !== v);
    this.dataSource.filter = newParams.join(',');
    this.refreshData(
      this.fromDate,
      this.toDate,
      this.paginator?.pageSize || 50,
      (this.paginator?.pageIndex || 0) + 1,
      this.docType,
      this.status
    );
  };

  

  mobFilter(filterParams: any) {
    // console.log('param' + filterParams);
    this.paramsFromFilter.type = filterParams.type;
    this.paramsFromFilter.status = filterParams.status;
    this.mobData = this.dummyData;
    this.viewMoreItems = this.mobData;
    var typeFilters = this.mobData;
    this.dataAfterFilter = this.mobData;
    this.isMobFilter = true;
    var statusarr = [];

    if (filterParams.status !== 'ALL') {
      if (filterParams.type.length > 0) {
        typeFilters = typeFilters.filter((item: any) => {
          for (var i = 0; i < filterParams.type.length; i++) {
            if (filterParams.type[i] == item['docType']) {
              return item;
            }
          }
        });

        this.mobData = typeFilters;
        this.dataAfterFilter = typeFilters;
        if (this.dataAfterFilter.length > 12) {
          this.viewMoreVisible = true;
        } else {
          this.viewMoreVisible = false;
        }
      }
      if (filterParams.status.length > 0) {
        statusarr = typeFilters.filter((item: any) => {
          for (var i = 0; i < filterParams.status.length; i++) {
            if (filterParams.status[i] == item['status']) {
              return item;
            }
          }
          // return filterParams.status.every(o => item['status'].includes(o));
        });
        this.mobData = statusarr;
        this.dataAfterFilter = statusarr;
        if (this.dataAfterFilter.length > 12) {
          this.viewMoreVisible = true;
        } else {
          this.viewMoreVisible = false;
        }
      }
    }
    this.viewMoreItems = this.dataAfterFilter.slice(0, 12);
    if (
      this.dataAfterFilter.length > 12 &&
      this.viewMoreItems.length != this.dataAfterFilter.length
    ) {
      this.viewMoreVisible = true;
    } else {
      this.viewMoreVisible = false;
    }
  }
 
  datesUpdated(event) {
    const currentPage =  this.testPaginator.pageIndex + 1;
    const pageSize = this.testPaginator.pageSize;
   console.log("datesUpdated",event);
   this.searchBoxDisable = true;
   this.searchInputFilter.setValue('Search By')
    this.searchKeyValue.nativeElement.value = '';
    this.searchKey = '';
    this.itemSelected = ''
    if(event.startDate && event.endDate){
    this.fromDate =moment(this.selected?.startDate?._d).format('YYYY-MM-DD');
    this.toDate =moment(this.selected?.endDate?._d).format('YYYY-MM-DD');
    this.refreshData(
      this.fromDate,
      this.toDate,
      pageSize,
      currentPage,
      this.docType,
      this.status
    );
  }
  
  }

  filterData(dataType) {
    this.dataSource.filterPredicate = (elm, filter) => {
      return (
        filter.split(',').includes(this.docType) ||
        filter.split(',').includes(this.status) ||
        filter.split(',').includes(elm[dataType])
      );
    };
  }

  webView() {
    localStorage.removeItem('InvoiceNumbers');
    var invoiceDocNumbers = [];
    this.selection.selected.map((el) => {
      invoiceDocNumbers.push(el.docNumber);
    });
    if (invoiceDocNumbers.length > 0) {
      this.router.navigate([]).then((result) => {
        window.open('/web-view', '_blank');
      });
      localStorage.setItem('InvoiceNumbers', JSON.stringify(invoiceDocNumbers));
    }
  }
  downloadOption(){

    this.priceDownload = !this.priceDownload;
  }

  webViewIndividual(args) {
    localStorage.removeItem('InvoiceNumbers');
    var invoiceDocNumbers = [];
    invoiceDocNumbers.push(args);
    if (invoiceDocNumbers.length > 0) {
      this.router.navigate([]).then((result) => {
        window.open('/web-view', '_blank');
      });
      localStorage.setItem('InvoiceNumbers', JSON.stringify(invoiceDocNumbers));
    }
  }

  listView() {
    localStorage.removeItem('InvoiceDocsForList');
    var invoiceDocs = [];
    this.selection.selected.map((el) => {
      invoiceDocs.push(el);
    });
    if (invoiceDocs.length > 0) {
      this.router.navigate([]).then((result) => {
        window.open('/print-list', '_blank');
      });
      localStorage.setItem('InvoiceDocsForList', JSON.stringify(invoiceDocs));
    }
  }

  listViewIndividual(args) {
    localStorage.removeItem('InvoiceDocsForList');
    var invoiceDocs = [];
    invoiceDocs.push(args);
    if (invoiceDocs.length > 0) {
      this.router.navigate([]).then((result) => {
        window.open('/print-list', '_blank');
      });
      localStorage.setItem('InvoiceDocsForList', JSON.stringify(invoiceDocs));
    }
  }

 

  updatePrefRoute() {
    this.router.navigate(['/preferencesPage'], {
      queryParams: this.queryParams,
      queryParamsHandling: 'merge',
    });
  }

  downloadDialogOpen(): void {
    const dialogRef = this.dialog.open(InvoiceDownloadDialogComponent, {
      width: '53.625rem',
      height: '27.75rem',
      panelClass: 'download-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  negativeConverter(value) {
    let val: any = parseFloat(value).toFixed(2);
    if (/\-/g.test(val)) {
      let isMinus = val.split('-')[1];
      let valReturn =
        '-$' +
        parseFloat(isMinus).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        });
      return valReturn;
    } else {
      let valReturn =
        '$' +
        parseFloat(value).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        });
      return valReturn;
    }
  }
  

  emailDialogOpen(args, isTrue?: boolean): void {
    const dialogRef = this.dialog.open(StatementEmailDialogComponent, {
      width: '53.625rem',
      height: '40rem',
      panelClass: 'statement-dialog',
      data: {
        docType: 'INVOICE',
        documentNumber: !isTrue ? [args.docNumber] : [args],
        subject: 'Invoice/Credit Note',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  emailMultiDialogOpen(args) {
    var docTypes = [];
    var docNumbers = [];
    args.map((el) => {
      docTypes.push(el.docType);
      docNumbers.push(el.docNumber);
    });
    const dialogRef = this.dialog.open(StatementEmailDialogComponent, {
      width: '53.625rem',
      height: '40rem',
      panelClass: 'statement-dialog',
      data: {
        docType: 'INVOICE',
        documentNumber: docNumbers,
        subject: 'Invoice/Credit Note',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // console.log(this.dataSource);
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    
  }

  IndividualInvoice(invoiceNo) {
    this.commonService.show();
    this.service.getInvoiceDetail(invoiceNo).subscribe((data) => {
      if (data) {
        this.invoiceDetailData = data.invoice || [];
        this.individualDataSource = data.invoice || [];
        if (this.isMobile) {
          this.viewMoreOnLoadDetailPage(data.invoice.invoiceDetails);
        }
        this.ref.markForCheck();
        this.isParticularInvoice = false;
        this.commonService.hide();
      }
    });
  }

  viewMoreOnLoadDetailPage(data) {
    this.mobData1 = data.slice(0, 12);
    if (data.length > 12 && this.mobData1.length != data.length) {
      this.viewMoreVisible1 = true;
    } else {
      this.viewMoreVisible1 = false;
    }
  }
  viewMoreClickDetailPage() {
    this.mobData1 = this.invoiceDetailData.slice(0, this.currentValue1);
    if (
      this.invoiceDetailData.length > 12 &&
      this.mobData1.length != this.invoiceDetailData.length
    ) {
      this.viewMoreVisible1 = true;
    } else {
      this.viewMoreVisible1 = false;
    }
    this.currentValue1 += 12;
  }

  downloadCSV(MultiinvoiceNo, invoiceNo) {  
   
    if(MultiinvoiceNo.length>0){
      this.tempInvoiceNo = [MultiinvoiceNo];
      // console.log("MultiinvoiceNo",this.tempInvoiceNo);
    }
    else{
      const arr = [];
      arr.push(invoiceNo)
      this.tempInvoiceNo = [arr];
      // console.log("invoiceNo",this.tempInvoiceNo);
    }
    
      var modalRef = this.modalService.open(DownloadFormatPopupComponent, {
        windowClass: 'downloadFormat',
        centered: true,
        size: 'lg',
      });
      modalRef.componentInstance.fieldName = this.tempInvoiceNo;
      modalRef.componentInstance.passEntry.subscribe((rs) => {
        // console.log(rs);
       
        this.modalService.dismissAll(); 
       });
  }

  downloadMultiCSV(invoiceNo) {  
    console.log("invoiceNo",invoiceNo);
    // this.tempInvoiceNo = [invoiceNo];
      var modalRef = this.modalService.open(MultidownloadFormatComponent, {
        windowClass: 'downloadFormat',
        centered: true,
        size: 'lg',
      });
      modalRef.componentInstance.fieldName = invoiceNo;
      modalRef.componentInstance.passEntry.subscribe((rs) => {
        // console.log(rs);
       
        this.modalService.dismissAll(); 
       });
  }

  // downloadCSV(invoiceNo) {
  //   this.commonService.show();
  //   this.tempInvoiceNo = [invoiceNo];
  //   this.service.getDownloadInvoiceCSV(this.tempInvoiceNo).subscribe(
  //     (resp: HttpResponse<Blob>) => {
  //       this.downloadFile(resp.body, 'INVOICE_' + this.tempInvoiceNo + '.csv');
  //       this.commonService.hide();
  //     },
  //     (error) => {
  //       //Error callback
  //       this.downloadFile(error.body, 'INVOICE_' + this.tempInvoiceNo);
  //       this.commonService.hide();
  //     }
  //   );
  // }
  
 async singledownload(invoiceNo) {
    console.log(invoiceNo);
    this.commonService.show();
    this.tempInvoiceNo = invoiceNo;
    for(var i=0; i<this.tempInvoiceNo.length; i++){
           let arr =[];
          arr.push( this.tempInvoiceNo[i].docNumber);
     await this.service.getDownloadInvoicePDF([this.tempInvoiceNo[i].docNumber]).subscribe(
      
        (resp: HttpResponse<Blob>) => {
          arr.forEach(element =>{
            this.downloadFile(resp.body, 'INVOICE_' + element);
          });
          
         // 

          this.commonService.hide();
        },
        (error) => {
          //Error callback
         this.downloadFile(error.body, 'INVOICE_' + arr);
          this.commonService.hide();
        }
      );
    }
    
  }


  downloadPDF(invoiceNo) {
    this.commonService.show();
    this.tempInvoiceNo = invoiceNo;
    this.service.getDownloadInvoicePDF([invoiceNo]).subscribe(
      (resp: HttpResponse<Blob>) => {
        this.downloadFile(resp.body, 'INVOICE_' + this.tempInvoiceNo);
        this.commonService.hide();
      },
      (error) => {
        //Error callback
        this.downloadFile(error.body, 'INVOICE_' + this.tempInvoiceNo);
        this.commonService.hide();
      }
    );
  }
  

  downloadFile(data: any, fileName: string) {
   //console.log(fileName);
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  multipleDownloadPDF(args) {
    this.commonService.show();
    var invoiceNos = [];
    args.map((el) => {
      invoiceNos.push(el.docNumber);
    });
    this.service
      .getDownloadInvoicePDF(invoiceNos)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.downloadFile(resp.body, 'INVOICE_ALL');
        this.commonService.hide();
      });
  }

  multipleDownloadCSV(args) {
    this.commonService.show();
    var invoiceNos = [];
    args.map((el) => {
      invoiceNos.push(el.docNumber);
    });
    this.service
      .getDownloadInvoiceCSV(invoiceNos)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.downloadFile(resp.body, 'INVOICE.csv');
        this.commonService.hide();
      },
      (error) => {
        //Error callback
        this.downloadFile(error.body, 'INVOICE');
        this.commonService.hide();
      }
    );
  }

  back() {
   this.isParticularInvoice = true;
   this.searchBoxDisable = true;
   this.itemSelected = 'Search by'
   // this.refreshData(this.fromDate, this.toDate, 50, 1);
  //  location.reload();
  }
  /* ------ Start of New enhancement code of Search Invoice --- */

  toggleSearchFilterDropdown() {
    this.isSearchFilterDropdownExpand = !this.isSearchFilterDropdownExpand;
  }

  // call this method on user change the search option (criteria) dropdown
  doSearchFilter(item) {
    this.itemSelected = item;
    this.searchInputFilter.setValue(item);
    if(this.searchInput.value.length>0){
      this.searchBoxDisable = false;
    }
    else{
      this.searchBoxDisable = true;
    }
  }

  searchInvoice(event){
    const searchText = event.target.value;
    if(this.searchInput.value.length>0){
      if((this.itemSelected == 'Item Code' || this.itemSelected == 'Order/Job Ref.' || 
      this.itemSelected == 'Invoice/Credit No.' || this.itemSelected == 'Sales Order No.' || this.itemSelected == 'Brand')){
        this.searchBoxDisable = false;
      }
      
    }
    else{
      if((this.itemSelected == 'Item Code' || this.itemSelected == 'Order/Job Ref.' || 
      this.itemSelected == 'Invoice/Credit No.' || this.itemSelected == 'Sales Order No.' || this.itemSelected == 'Brand')){
        this.searchBoxDisable = true;
        this.commonService.show();
        this.searchInputFilter.setValue('Search By')
        this.searchKeyValue.nativeElement.value = '';
        this.searchKey = '';
        this.itemSelected = ''
        this.getInvoiceList(this.fromDate, this.toDate, this.testPaginator.pageSize, this.testPaginator.pageIndex,this.docType, this.status)
      }
    }

  }
  // call this method on user press the search btn
  doSearch(searchKeyValue){
    this.doFilter(searchKeyValue)
  }

  doFilter(value: string){
    this.searchKey = value;
    this.pageSize = this.testPaginator.pageSize;
    const currentPage =  1; 
    this.commonService.show();
    if(this.sortType){
      console.log("SortType inside", this.sortType)
      if(this.sortType.active == 'date'){
        this.sortBy = 'invoice_date';
      }
      else if(this.sortType.active == 'invoiceNo'){
        this.sortBy = 'invoice_number';
      }
      else if(this.sortType.active == 'orderJobRef'){
        this.sortBy = 'customer_order_ref';
      }
      else if(this.sortType.active == 'salesOrderNo'){
        this.sortBy = 'sales_order_number';
      }
      else if(this.sortType.active == 'branch'){
        this.sortBy = 'branch_name';
      }
      this.service.sortInvoiceWithText(this.sortInvoiceOrder, currentPage, this.pageSize,this.sortBy, this.fromDate, this.toDate, this.docType, this.status, this.searchKey, this.itemSelected).subscribe((res)=> {
        this.invoiceList = [];
        this.invoiceList = res.invoices;
        this.commonService.hide();
      })
    }
    else{
    this.service
      .getInvoiceSearch(this.fromDate, this.toDate, this.pageSize, currentPage, this.searchKey, this.itemSelected, this.docType, this.status)
      .subscribe((data) => {
        if(data.invoices){
          if(data.invoices.length > 0) {
            this.commonService.hide();
            this.invoiceList = data.invoices;
            this.filteredData = data.invoices;
            this.dummyList = data.invoices;
            this.invoicesNotFound = false;
            this.dummyPaginatorList = this.dummyList;
            this.dataSource.filterPredicate = function (data, filter: string): boolean {
            return data.code.toLowerCase().includes(filter);
            };
            this.testPaginator.length = data.additionalProperties[0].value;
            setTimeout(() => {
            this.testPaginator.length = data.additionalProperties[0].value;
            this.ref.markForCheck();
            })
            this.testPaginator.length = data.totalResults;
            console.log("Test paginator length:", this.testPaginator.length)
            this.dataSource.data = this.dummyList;
            this.viewMoreVisible = this.dummyList.length > 12 ? true : false;
          }
          else{
            this.invoiceList = [];
            this.invoicesNotFound = true;
            this.commonService.hide();
          }
        }
        else{
          this.invoiceList = [];
          this.invoicesNotFound = true;
          this.commonService.hide();
        }
        
      });
    }
    
  };

   clearFilterData() {
    // this.toDate = moment().format('YYYY-MM-DD');
    // this.fromDate = moment().subtract(1, 'month').format('YYYY-MM-DD');
    // const currentPage =  this.testPaginator.pageIndex;
    // const pageSize = this.testPaginator.pageSize;
    // this.selected = {startDate:moment(this.fromDate).format('DD/MM/YYYY'), endDate:moment(this.toDate).format('DD/MM/YYYY')};
    // this.docType = 'ALL';
    // this.status = 'ALL';
    // this.searchInputFilter.setValue('Search By')
    // this.searchKeyValue.nativeElement.value = '';
    // this.searchKey = '';
    // this.itemSelected = ''
    // this.selection.clear();
    // this.searchBoxDisable = true;
    // this.commonService.show();
    // this.getInvoiceList(this.fromDate, this.toDate, this.testPaginator.pageSize, this.testPaginator.pageIndex,this.docType, this.status)
    location.reload();
  }

  /* ------ End of New enhancement code of Search Invoice --- */

}

@Component({
  selector: 'invoice-download',
  templateUrl: './invoice-download.component.html',
  styleUrls: ['./invoices-and-adjustments.component.scss'],
})
export class InvoiceDownloadDialogComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  close() {
    this.dialog.closeAll();
  }
}

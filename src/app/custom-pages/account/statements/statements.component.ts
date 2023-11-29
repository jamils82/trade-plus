import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { invoiceAdjustmentService } from 'src/app/core/service/invoice_adjustments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import moment from 'moment';
import { Dayjs } from 'dayjs/esm';
@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss'],
})
export class StatementsComponent implements OnInit, AfterViewInit {
  fromDate: any;
  toDate: any;
  listData: any;
  statementListData: any;
  dataSource: any;
  statementDataSource: any;
  isParticularStatement = true;
  displayedColumns: string[] = [
    'select',
    'date',
    'statementNumber',
    'customerName',
    'branch',
    'total',
    'Actions',
  ];
  statementDisplayedColumns: string[] = [
    'documentNo',
    'date',
    'jobName',
    'type',
    'order ref',
    'amountDue',
    'Actions',
  ];

  selection = new SelectionModel<any>(true, []);

  @ViewChild('searchKey') searchKey;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  testPaginator = {
    length: 100,
    pageSize: 12,
    pageIndex: 0,
  };
  dummyData: any;
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
  userActivity:any;
  getdataSource:any;
  isMobile: boolean = false;
  mobData: any = [];
  mobData1: any = [];
  viewMoreItems: any = [];
  viewMoreItems1: any = [];
  viewMoreVisible: boolean = false;
  viewMoreVisible1: boolean = false;
  currentValue = 24;
  currentValue1 = 24;
  isPagination: boolean;
  constructor(
    public dialog: MatDialog,
    public ref: ChangeDetectorRef,
    public service: invoiceAdjustmentService,
    public commonService: CommonService,
    public shareEvents: ShareEvents,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.makeDate = moment().format('YYYY-MM-DD');
    this.prev = moment().subtract(12, 'month').format('YYYY-MM-DD');
     this.selected = {startDate:moment(this.prev).format('DD/MM/YYYY'), endDate:moment(this.makeDate).format('DD/MM/YYYY')};
   console.log(this.makeDate);
   console.log(this.prev);
     // this.router.navigate([],{relativeTo: this.route, queryParams: { defaultFromDate: moment().format('YYYY-MM-DD'), defaultToDate: moment().format('YYYY-MM-DD') }});
  //  this.selected = moment(this.fromDate).subtract(31, 'days').format('DD/MM/YYYY') + '-' + moment(this.toDate).format('DD/MM/YYYY');
    // console.log("this.selected default ",this.selected );
    // let tempDate: any = new Date();
    // this.fromDate = new Date(tempDate.setDate(tempDate.getDate() - 31))
    //   .toISOString()
    //   .substring(0, 10)
    //   .split('-')
    //   .join('/');
    // this.toDate = new Date()
    //   .toISOString()
    //   .substring(0, 10)
    //   .split('-')
    //   .join('/');
     
    this.refreshData(
      this.prev,
      this.makeDate,
      100,
      1,
    );
  }

  refreshData(startDate, EndDate, pageSize, pageNumber) {
    this.commonService.show();
    this.service
      .getStatementList(startDate, EndDate, pageSize, pageNumber)
      .subscribe((data) => {
        if (data) {
		      data.statements = data.statements ? data.statements : [];
          this.isPagination = data.statements.length != 0 ? true : false;
          this.dataSource.data = data.statements;
          this.dummyData = data.statements;
          if (this.isMobile && this.dummyData.length > 0) {
            this.viewMoreOnLoad(this.dummyData);
          }
          localStorage.setItem(
            'tempPaging',
            JSON.stringify({
              length: data?.additionalProperties[0]?.value,
              index: data?.additionalProperties[2]?.value - 1,
              pageSize: data?.additionalProperties[1]?.value,
            })
          );
          this.commonService.hide();
        } else {
          this.commonService.hide();
        }
      });
  }

  ngOnInit(): void {
   // this.setInterval();
    this.isMobile = CommonUtils.isMobile();
    this.dataSource = new MatTableDataSource(this.listData);
    // console.log("this.fromDate statement",this.fromDate);
    // console.log("this.toDate statement",this.toDate);
    this.shareEvents.mobileSearchSubject.subscribe((val) => {
      if (val != undefined) {
        this.refreshData(this.fromDate, this.toDate, 12, 1);
      }
    });
    this.statementDataSource = new MatTableDataSource(this.statementListData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter) => {
      const filterFormatValue = filter.trim().toLowerCase();
      const nestedObjFilter = (obj: any): string => {
        let returnVal = '';
        Object.keys(obj).forEach((key) => {
          if (key === 'docNumber') {
            returnVal = returnVal + ' ' + obj[key];
          }
        });

        return returnVal.trim().toLowerCase();
      };

      return nestedObjFilter(data).includes(filterFormatValue);
    };
    
  }

  setInterval() {
    this.userActivity = setInterval(() => {
    clearTimeout(this.userActivity);
       // load data on next tab 
       this.getdataSource = sessionStorage.getItem("fromDate");
       if(this.getdataSource != null){
    this.refreshData(
      sessionStorage.getItem('fromDate'),
      sessionStorage.getItem('toDate'),
      36,
      5,
    );
    }
// load data on next tab 
    
    }, 1000);
  }
  ngAfterViewInit() { }
  pageEvent($event: any) {
    this.paginator.pageIndex = $event.pageIndex;
    this.paginator.pageSize = $event.pageSize;
    this.dataSource.paginator = this.paginator;
    this.refreshData(
      this.fromDate,
      this.toDate,
      this.paginator.pageSize,
      this.paginator.pageIndex + 1
    );
  }

  negativeConverter(value) {
    let val: any = parseFloat(value).toFixed(2);
    if (/\-/g.test(val)) {
      let isMinus = val.split('-')[1];
      let valReturn = '-$' + parseFloat(isMinus).toLocaleString(undefined, { minimumFractionDigits: 2 });
      return valReturn;
    } else {
      let valReturn = '$' + parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 });
      return valReturn;
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

  detailStatementDialogOpen(args, isTrue) {
    const dialogRef = this.dialog.open(StatementEmailDialogComponent, {
      width: '53.625rem',
      height: '40rem',
      panelClass: 'statement-dialog',
      data: {
        docType: 'INVOICE',
        documentNumber: !isTrue ? [args.docNumber] : [args],
        subject: 'Statement Note',
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  statementDialogOpen(args, isTrue): void {
    const dialogRef = this.dialog.open(StatementEmailDialogComponent, {
      width: '53.625rem',
      height: '40rem',
      panelClass: 'statement-dialog',
      data: {
        docType: 'STATEMENT',
        documentNumber: !isTrue ? [args.docNumber] : [args],
        subject: 'Statement Note',
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  statementDetails(statementNo: any) {
    this.commonService.show();
    this.service.getStatementDetail(statementNo).subscribe((data) => {
      if (data) {
        this.statementDataSource = data.statement;
        if (this.isMobile) {
          this.viewMoreOnLoadDetailPage(data.statement.statementLines);
        }
        this.ref.markForCheck();
        this.isParticularStatement = false;
        this.commonService.hide();
      }
    });
  }

  viewMoreOnLoadDetailPage(data) {
    this.mobData1 = data.slice(0, 12);
    if (data.length > 12 && this.mobData1.length != data.length) {
      this.viewMoreVisible1 = this.mobData1.length > 11 ? true : false;
    } else {
      this.viewMoreVisible1 = false;
    }
  }
  viewMoreClickDetailPage() {
    this.mobData1 = this.statementDataSource.statementLines.slice(0, this.currentValue1);
    if (
      this.statementDataSource.statementLines.length > 12 &&
      this.mobData1.length != this.statementDataSource.statementLines.length
    ) {
      this.viewMoreVisible1 = true;
    } else {
      this.viewMoreVisible1 = false;
    }
    this.currentValue1 += 12;
  }

  back() {
    this.isParticularStatement = true;
    this.refreshData(this.fromDate, this.toDate, 12, 1);
  }
  viewMoreOnLoad(data) {
    if (this.shareEvents.mobileSearchPage == 'statement') {
      this.mobData = data.filter((data) =>
        data.docNumber.toLowerCase().includes(this.shareEvents.mobileSearchVal)
      );
    } else {
      this.mobData = data.slice(0, 12);
    }
    // this.mobData = data.slice(0, 12);
    if (data.length > 12 && this.mobData.length != data.length) {
      this.viewMoreVisible = true;
    } else {
      this.viewMoreVisible = false;
    }
  }
  viewMoreClick() {
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
  }
  public tempInvoiceNo;
  downloadCSV(invoiceNo) {
    this.commonService.show();
    this.tempInvoiceNo = invoiceNo;
    this.service
      .getDownloadInvoiceCSV(invoiceNo)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.downloadFile(
          resp.body,
          'STATEMENTS_' + this.tempInvoiceNo + '.csv'
        );
        this.commonService.hide();
      });
  }

  downloadPDF(invoiceNo) {
    this.commonService.show();
    this.tempInvoiceNo = invoiceNo;
    this.service
      .getDownloadStatementsPDF([invoiceNo])
      .subscribe((resp: HttpResponse<Blob>) => {
        this.downloadFile(resp.body, 'STATEMENTS_' + this.tempInvoiceNo);
        this.commonService.hide();
      });
  }

  detailDownloadPDF(invoiceNo) {
    this.commonService.show();
    this.tempInvoiceNo = invoiceNo;
    this.service
      .getDownloadInvoicePDF([invoiceNo])
      .subscribe((resp: HttpResponse<Blob>) => {
        this.downloadFile(resp.body, 'INVOICE_' + this.tempInvoiceNo);
        this.commonService.hide();
      });
  }

  multipleDownloadPDF(args) {
    this.commonService.show();
    var statementNos = [];
    args.map((el) => {
      statementNos.push(el.docNumber);
    });
    this.service
      .getDownloadStatementsPDF(statementNos)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.commonService.hide();
        this.downloadFile(resp.body, 'STATEMENTS_ALL');
      });
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

  updatePrefRoute() {
    this.router.navigate(['/preferencesPage']);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date':
          return this.compare(a.docDate, b.docDate, isAsc, true);
        case 'statementNumber':
          return this.compare(a.docNumber, b.docNumber, isAsc, false);
        case 'customerName':
          return this.compare(a.customer.id, b.customer.id, isAsc, false);
        case 'branch':
          return this.compare(a.branch.name, b.branch.name, isAsc, false);
        default:
          return 0;
      }
    });
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

  datesUpdated(event) {
    // this.fromDate = $event.substring(14, 24).split('-').reverse().join('-');
    // this.toDate = $event.substring(48, 58).split('-').reverse().join('-');
    // const urlParameter = {
    //   fromDate: this.fromDate,
    //   toDate: this.toDate,
    //   };
    // const nextPageParams = '?fromDate='+ this.fromDate.toString() + '&toDate='+ this.toDate.toString();
    // this.router.navigate([]).then(result => {
    //   window.open('/statementsPage' + nextPageParams, '_blank',) ;
    // });
    // if(this.router.url.includes('?')){
    //   let fromDate = ''
    //   let toDate = ''
      
    //   this.route.queryParams.pipe(first()).subscribe((params) => {
    //     fromDate = params.fromDate;
    //     toDate = params.toDate;
    //   });
    //   const currentQueryParam = '?fromDate='+ fromDate + '&toDate='+ toDate;
    //   setTimeout(() => {
    //     window.location.href = window.location.pathname+currentQueryParam;
    //   }, 5);
    // } else {
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 5);
    // }


    if(event.startDate && event.endDate){
      // @ts-ignore
 //  this.startDateRange = moment(this.selected?.startDate?._d).format('YYYY-MM-DD');
      // @ts-ignore
   // this.endDateRange = moment(this.selected?.endDate?._d).format('YYYY-MM-DD');
   // this.fromDate =  this.startDateRange;
   // this.toDate = this.endDateRange;
  
   
   this.fromDate =moment(this.selected?.startDate?._d).format('YYYY-MM-DD');
   this.toDate =moment(this.selected?.endDate?._d).format('YYYY-MM-DD');
   this.refreshData(
     this.fromDate,
     this.toDate,
     12,
     1,
    );
 }
  }

  clearFilter() {
    this.makeDate = moment().format('YYYY-MM-DD');
    this.prev = moment().subtract(12, 'month').format('YYYY-MM-DD');
    this.selected = {startDate:moment(this.prev).format('DD/MM/YYYY'), endDate:moment(this.makeDate).format('DD/MM/YYYY')};
    this.refreshData(
      this.prev,
      this.makeDate,
      12,
      1,
    );
    let searchKey = (this.searchKey.nativeElement.value = '');
    this.doFilter(searchKey);
    this.dataSource.data = this.dummyData;
    this.selection.clear();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
}

@Component({
  selector: 'statement-email',
  templateUrl: 'statement-email.component.html',
  styleUrls: ['./statements.component.scss'],
})
export class StatementEmailDialogComponent implements OnInit {
  public to: any = JSON.parse(localStorage.getItem('userInfo')).email;
  public cc: any = '';
  public sub: string;
  public msg: any;
  sendEmailForm: FormGroup;
  submitted = false;
  constructor(
    public dialog: MatDialog,
    public service: invoiceAdjustmentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.sub = data.subject;
  }

  ngOnInit() {
    this.sendEmailForm = this.fb.group({
      msg: [this.msg],
      sub: [this.sub],
      toAddress: [this.to, [Validators.required, this.commaSepEmail]],
      ccAddress: [this.cc, [this.ccEmail]],
    });
  }
  commaSepEmail = (control: AbstractControl): { [key: string]: any } | null => {
    const emails = control.value.split(',');
    const forbidden = emails.some((email) =>
      Validators.email(
        new FormControl(email.trim(), [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ])
      )
    );
    return forbidden ? { toAddress: { value: control.value } } : null;
  };
  ccEmail = (control: AbstractControl): { [key: string]: any } | null => {
    const emails = control.value.split(',');
    const forbidden = emails.some((email) =>
      Validators.email(
        new FormControl(email.trim(), [
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ])
      )
    );
    return forbidden ? { ccAddress: { value: control.value } } : null;
  };
  close() {
    this.dialog.closeAll();
  }
  get formValid() {
    return this.sendEmailForm.controls;
  }
  emailSend() {
    this.submitted = true;
    if (
      this.sendEmailForm.controls['toAddress'].valid &&
      this.sendEmailForm.controls['ccAddress'].valid
    ) {
      let value = {
        cc: this.cc.trim().split(','),
        docType: this.data.docType,
        documentNumber: this.data.documentNumber,
        message: this.msg,
        subject: this.sub,
        to: this.to.trim().split(','),
      };
      this.service.emailService(value).subscribe((data) => {
        if (data) {
          this.cc = '';
          this.msg = '';
          var x = document.getElementById('snackbar');
          x.className = 'show';
          setTimeout(
            function () {
              x.className = x.className.replace('show', '');
              setTimeout(() => {
                this.dialog.closeAll();
              }, 1000);
            }.bind(this),
            5000
          );
        }
      });
    }
  }
}

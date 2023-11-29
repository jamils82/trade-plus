import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewDownloadFormatComponent } from './view-download-format/view-download-format.component';
import { ELEMENT_DATA } from './format-data-attributes'
import { Router } from '@angular/router';
import { downloadFormatService } from 'src/app/core/service/download-format.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-download-updates',
  templateUrl: './download-updates.component.html',
  styleUrls: ['./download-updates.component.scss'],
})
export class DownloadUpdatesComponent implements OnInit {
  fromDate: any;
  toDate: any;
  // listData: any = ELEMENT_DATA;
  listData: any =[];
  dataSource: any;
  statementDataSource: any;
  isParticularStatement = true;
  displayedColumns: string[] = ['Format Title', 'Format', 'Format Type', 'edit', 'delete'];
  selection = new SelectionModel<any>(true, []);
  isMobile: boolean = false;
  mobData: any = [];
  viewMoreItems: any = [];
  viewMoreVisible: boolean = false;
  currentValue = 24;
  @ViewChild('searchKey') searchKey;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  testPaginator = {
    length: 100,
    pageSize: 12,
    pageIndex: 0,
  };
  currentItem: any = {};
  modalRef: any;
  infoMessage: string = '';
  successInd$ = new BehaviorSubject<boolean>(false);
  pageSize: any;
  dummyList: unknown[];
  dummyPaginatorList: unknown[];

  constructor(
    private modalService: NgbModal, 
    public ref: ChangeDetectorRef,
    private router: Router,
    private downloadFormatService: downloadFormatService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.dataSource = new MatTableDataSource(this.dummyList);
    // this.dataSource.paginator = this.paginator;
    this.getDownloadListData();
    // this.viewMoreOnLoad(this.listData);
    // setTimeout(() => {
    //   this.dataSource.paginator = this.paginator;
    //   this.ref.markForCheck();
    // }, 1000);
  }

  getDownloadListData() {
    this.commonService.show();
    this.pageSize = this.testPaginator.pageSize;
    
    this.downloadFormatService.getDownloadFormats(this.testPaginator.pageIndex, this.pageSize).subscribe((listDataVal) => {
     // console.log("List data:", JSON.stringify(listDataVal))
      if(listDataVal) {
       this.listData = listDataVal.results;
       this.dummyList = listDataVal.results;
       this.dummyPaginatorList = this.dummyList;
       this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.code.toLowerCase().includes(filter);
    };
    this.testPaginator.length = listDataVal.pagination.totalResults;
    setTimeout(() => {
      this.testPaginator.length = listDataVal.pagination.totalResults;
      this.ref.markForCheck();
      })
      this.testPaginator.length = listDataVal.pagination.totalResults;
      this.dataSource.data = this.dummyList;
      }
      this.commonService.hide();
    }, (_error) => {
      this.commonService.hide();
    });
  }

  viewMoreOnLoad(data) {
    this.mobData = data.slice(0, 12);
    if (data.length > 12 && this.mobData.length != data.length) {
      this.viewMoreVisible = true;
    }
    else {
      this.viewMoreVisible = false;
    }
  }
  viewMoreClick() {
    this.mobData = this.listData.slice(0, this.currentValue);
    if (this.listData.length > 12 && this.mobData.length != this.listData.length) {
      this.viewMoreVisible = true;
    }
    else {
      this.viewMoreVisible = false;
    }
    this.currentValue += 12;
  }
  pageEvent($event: any) {
    this.testPaginator.pageIndex = $event.pageIndex;
    this.testPaginator.pageSize = $event.pageSize;
    this.listData.paginator = this.paginator;
    this.getDownloadListData();
  }

  sortTable(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Format Title':
          return this.compare(a.Format_Title, b.Format_Title, isAsc);
        case 'Format':
          return this.compare(a.Format, b.Format, isAsc);
        case 'Format Type':
          return this.compare(a.Format_type, b.Format_type, isAsc);
        default:
          return 0;
      }
    });
  }
  compare(a: any, b: any, isAsc: boolean): any {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public doFilter = (value: string) => {

    this.dataSource.filter = value.trim().toLocaleLowerCase();
    this.mobData = this.listData.filter(it => {
      return (it.title.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        it.fileFormat.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        it.fileType.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
    });
  };

  formatRowData(row: any) {
    var modalRef = this.modalService.open(ViewDownloadFormatComponent, {
      windowClass: 'downloadFormat',
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.rowData = row;
    modalRef.componentInstance.rowDataAttributes = row.Attributes;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => { });
  }

  editInvoice(rowData: any) {
    if(rowData.fileType !== 'PRICE') {
      this.downloadFormatService.formData = rowData;
      localStorage.setItem('isEdit', 'Yes');
      localStorage.setItem('editNewFormat',JSON.stringify(this.downloadFormatService.formData));
      this.router.navigate(['downloadFilesPage/edit', rowData.id]);
    }
    else {
      this.formatRowData(rowData)
    }
  }
  deleteElement(content, rowData){
    this.currentItem = {};
    this.currentItem = rowData;
   // this.currentItem.listName = element.listName;
    this.currentItem.page = 'downloadFormat';
    this.modalRef = this.modalService.open(content, {
      windowClass: 'deleteList',
      centered: true,
      size: 'md',
    });
    this.modalRef.result.then((result) => {
        if (result === 'success') {}
      },
      (name: any) => {
        if (name != '') {
          this.infoMessage = rowData.title + ' has been deleted.';
          this.successInd$.next(true);
          this.getDownloadListData();
          setTimeout(() => {
            this.successInd$.next(false);
          }, 10000);
        }
      }
    );
  }

  createNewBtn(){
    this.router.navigate(['downloadFilesPage/create']);
  }
}

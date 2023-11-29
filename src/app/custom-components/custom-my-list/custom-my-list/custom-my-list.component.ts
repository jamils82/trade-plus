import { CommonUtils } from 'src/app/core/utils/utils';
import { filter } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  OnInit,
  ViewChild,
  Injectable,
  HostListener,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { ActiveCartService, MultiCartService } from '@spartacus/core';
import { SharedMethodsService } from 'src/app/shared-components/shared-methods.service';
import { HttpResponse } from '@angular/common/http';
import { Auth0TokenService } from 'src/app/core/service/token.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

const ELEMENT_DATA: PeriodicElement[] = [];

export interface PeriodicElement { }

@Component({
  selector: 'app-custom-my-list',
  templateUrl: './custom-my-list.component.html',
  styleUrls: ['./custom-my-list.component.scss'],
})
@HostListener('document:mousedown', ['$event'])
export class CustomMyListComponent implements OnInit, OnDestroy {
  modalRef: any;
  hasData: boolean = false;
  activeBtn: boolean = true;
  editMode: boolean = false;
  selectedMyListData: any = {};
  displayedColumns: string[] = [
    'listName',
    'type',
    'productCount',
    'status',
    'creationDate',
    'actions',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild('toggleButton') toggleButton: ElementRef;
  // @ViewChild('menu') menu: ElementRef;
  testPaginator = {
    length: 100,
    pageSize: 12,
    pageIndex: 0,
  };
  currentItem: any = {};
  emailId: any;
  selectedName$ = new BehaviorSubject<any>('');
  selectedUID: string;
  dataSource: any;
  infoMessage: string = '';
  successInd$ = new BehaviorSubject<boolean>(false);
  errorInd$ = new BehaviorSubject<boolean>(false);
  showloader: boolean;
  noDataMsg = '';
  isCreateInviteGroupPermissions: boolean;
  list: { name: string; checked: boolean }[];
  hiddenOps: any = {};
  viewMode = 'tab1';
  isElementPinned: boolean;
  tableData: any = [];
  public dummyData: any = [];
  isMobile: boolean = false;
  mobData: any;
  viewMoreItems: any = [];
  viewMoreVisible: boolean = false;
  currentValue = 24;
  currentValueMob = 24;
  filteredTableData: any = [];
  fileToUpload: File | null = null;
  isMobFilter: boolean = false;
  paramsFromFilter: any = {};
  mobileSearchSubscription: Subscription;
  dataAfterFilter: any;
  constructor(
    private modalService: NgbModal,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public commonService: CommonService,
    public myListService: MyListService,
    public activeCartService: ActiveCartService,
    public multiCartService: MultiCartService,
    public sharedMethodsService: SharedMethodsService,
    private auth0TokenService: Auth0TokenService,
    public shareEvents: ShareEvents,
    public ref: ChangeDetectorRef
  ) { }

  allData(val: boolean) {
    // this.dataSource =
    //thi

    if (val) {
      // this.dataSource = new MatTableDataSource<PeriodicElement>(this.dummyData);
      this.activeBtn = true;
      this.mobData = this.dummyData;
      this.viewMoreOnLoad(this.dummyData);
    } else {
      this.tableData = this.tableData.filter((x) => x.pinned == true);
      this.mobData = this.tableData;
      this.activeBtn = false;
      this.viewMoreOnLoad(this.tableData);
      // this.dataSource = new MatTableDataSource<PeriodicElement>(this.tableData);
    }
    this.getMyList();
  }
  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.commonService.show();
        this.getMyList();
      }
    });
    this.mobileSearchSubscription = this.shareEvents.mobileSearchSubject.subscribe((val) => {
      if (val != undefined) {
        this.getMyList();
      }
    })
  }

  ngOnDestroy(): void {
    if (this.mobileSearchSubscription) {
      this.mobileSearchSubscription.unsubscribe()
    }
  }
  fileUpload() {
    document.getElementById('myListFileUpload').click();
  }

  handleFileInput(listName, files: FileList) {
    this.commonService.show();
    this.fileToUpload = files[0];
    let fileCSV = new File([this.fileToUpload], this.fileToUpload.name, {
      type: 'text/csv',
    });
    this.myListService.uploadCSV(listName, fileCSV).subscribe(
      (data) => {
        if (
          data &&
          data.code != '500' &&
          data.code != '400' &&
          data.code != '206'
        ) {
          this.getMyList();
          this.infoMessage = data.message;
          this.successInd$.next(true);
          setTimeout(() => {
            this.successInd$.next(false);
          }, 50000);
        } else if (data.code == '206') {
          this.infoMessage = data.message;
          this.errorInd$.next(true);
          setTimeout(() => {
            this.errorInd$.next(false);
          }, 10000);
          this.commonService.hide();
        } else {
          this.infoMessage = 'Upload Failed.';
          this.errorInd$.next(true);
          setTimeout(() => {
            this.errorInd$.next(false);
          }, 10000);
          this.commonService.hide();
        }
      },
      (error) => {
        this.infoMessage = 'Upload Failed.';
        this.errorInd$.next(true);
        this.commonService.hide();
        setTimeout(() => {
          this.errorInd$.next(false);
        }, 10000);
      }
    );
  }

  public tempListName;
  downloadCSV(listName) {
    this.tempListName = listName;
    this.myListService
      .getDownloadInvoiceCSV(listName)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.downloadFile(resp.body, 'Lists_' + this.tempListName + '.csv');
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

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.listName.toLowerCase().includes(filter);
    };
  };

  announceSortChange(sortState: Sort) {
    this.dataSource.data = this.dataSource.data.sort(function (a, b) {
      return a.pinned - b.pinned;
    });
    if (sortState.direction === 'desc') {
      this.dataSource.data = this.dataSource.data.reverse();
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

  mobFilter(filterParams: any) {
    this.paramsFromFilter.type = filterParams.type;
    this.paramsFromFilter.status = filterParams.status;
    this.mobData = this.dummyData;
    this.viewMoreItems = this.mobData;
    var typeFilters = this.viewMoreItems;
    this.dataAfterFilter = this.viewMoreItems;
    this.isMobFilter = true;
    var statusarr = [];

    if (filterParams.status !== 'ALL') {
      if (filterParams.type.length > 0) {
        typeFilters = typeFilters.filter((item: any) => {
          for (var i = 0; i < filterParams.type.length; i++) {
            if (filterParams.type[i] == item['type']) {
              return item;
            }
          }
        })

        this.mobData = typeFilters;
        this.dataAfterFilter = typeFilters
        if (this.dataAfterFilter.length > 12) {
          this.viewMoreVisible = true;
        } else {
          this.viewMoreVisible = false;
        }
      }
      if (filterParams.status.length > 0) {
        statusarr = typeFilters.filter((item: any) => {
          for (var i = 0; i < filterParams.status.length; i++) {
            if (filterParams.status[i] == item['status'].toString()) {
              return item;
            }
          }
          // return filterParams.status.every(o => item['status'].includes(o));
        })
        this.mobData = statusarr;
        this.dataAfterFilter = statusarr;
        if (this.dataAfterFilter.length > 12) {
          this.viewMoreVisible = true;
        } else {
          this.viewMoreVisible = false;
        }

      }
    }
    this.mobData = this.dataAfterFilter.slice(0, 12);
    if (this.dataAfterFilter.length > 12 && this.mobData.length != this.dataAfterFilter.length) {
      this.viewMoreVisible = true;
    }
    else {
      this.viewMoreVisible = false;
    }
  }

  editList(data, content) {
    this.currentItem = JSON.parse(JSON.stringify(data));
    this.modalRef = this.modalService.open(content, {
      windowClass: 'addList',
      centered: true,
      size: 'md',
    });
    this.modalRef.result.then(
      (result) => {
        if (result === 'success') {
        }
      },
      (name: any) => {
        if (name != '') {
          this.infoMessage = name + ' has been created.';
          this.successInd$.next(true);
          this.getMyList();
          setTimeout(() => {
            this.successInd$.next(false);
            this.dataSource.paginator = this.paginator;
          }, 10000);
        }
      }
    );
  }
  addListPopup(content, element) {
    this.currentItem = null;
    this.modalRef = this.modalService.open(content, {
      windowClass: 'addList',
      centered: true,
      size: 'md',
    });
    this.modalRef.result.then(
      (result) => {
        if (result === 'success') {
        }
      },
      (name: any) => {
        if (name != '') {
          if (name == 'error') {
            this.infoMessage = 'List already exists.';
            this.errorInd$.next(true);
            this.getMyList();
          } else {
            this.infoMessage = name + ' has been created.';
            this.successInd$.next(true);
            this.getMyList();
          }
          setTimeout(() => {
            this.successInd$.next(false);
            this.errorInd$.next(false);
            this.dataSource.paginator = this.paginator;
          }, 10000);
        }
      }
    );
  }

  openFilterPopup(content) {
    this.modalRef = this.modalService.open(content, {
      windowClass: 'filterPopupList',
      centered: true,
      size: 'md',
    });
  }
  deleteMember(content, element) {
    this.currentItem = {};
    this.currentItem.listName = element.listName;
    this.currentItem.page = 'MyList';
    this.currentItem.userID = this.emailId;
    this.modalRef = this.modalService.open(content, {
      windowClass: 'deleteList',
      centered: true,
      size: 'md',
    });
    this.modalRef.result.then(
      (result) => {
        if (result === 'success') {
        }
      },
      (name: any) => {
        if (name != '') {
          this.infoMessage = this.currentItem.listName + ' has been deleted.';
          this.successInd$.next(true);
          this.getMyList();
          setTimeout(() => {
            this.successInd$.next(false);
            this.dataSource.paginator = this.paginator;
          }, 10000);
        }
      }
    );
  }

  archiveClicked(listName, isArchived) {
    //  alert(isPinned+ 'archive');
    this.showDropdown(listName);
    const data = {
      listName: listName,
      userID: this.emailId,
      archive: isArchived,
    };

    this.myListService.archiveMyList(data).subscribe(
      (result) => {
        //Next callback
        // this.repos = response;
      },
      (error) => {
        //Error callback
        console.error('error caught in component');

        //throw error;   //You can also throw the error to a global error handler
      },
      () => {
        this.infoMessage =
          isArchived == true
            ? listName + ' has been archived.'
            : listName + ' has been unarchived.';
        this.successInd$.next(true);
        this.getMyList();
        setTimeout(() => {
          this.successInd$.next(false);
        }, 10000);
      }
    );
  }

  pinned(listName, isPinned) {
    //   alert(listName+ isPinned + 'pinned');
    this.isElementPinned = isPinned == true ? false : true;
    //  alert(listName+ this.isElementPinned + 'pinned');

    const data = {
      listName: listName,
      userID: this.emailId,
      pinned: this.isElementPinned,
    };

    this.myListService.pinnedMyList(data).subscribe(
      (result) => {
        //Next callback
        // this.repos = response;
      },
      (error) => {
        //Error callback

        //throw error;   //You can also throw the error to a global error handler
      },
      () => {
        this.getMyList();
      }
    );
  }

  getMyList() {
    this.selectedUID = localStorage.getItem('selectedIUID');
    const data = {
      userID: this.selectedUID,
      email: this.emailId,
    };
    this.commonService.show();
    this.myListService.getMyList(data).subscribe(
      (result) => {
        if (result && result.myList && result.myList.length > 0) {
          this.hasData = true;
          this.testPaginator.length = 12;
          result.myList.forEach((element) => {
            element.status = element.archived == true ? 'Archived' : 'Active';
          });
          this.ref.markForCheck();
          // let pinnedData = result.myList.filter((x) => x.pinned == true);
          // let unPinnedData = result.myList.filter((x) => x.pinned == false);
          let pinnedData = result.myList.filter((x) => x.pinned == true);

          let unPinnedData = result.myList.filter((x) => x.pinned == false);
          // this.tableData = result.myList;
          this.tableData = [...pinnedData, ...unPinnedData];
          this.dummyData = this.tableData;
          this.tableData = this.activeBtn == false ? [...pinnedData] : [...pinnedData, ...unPinnedData];
            this.dataSource = new MatTableDataSource<PeriodicElement>(
            this.tableData
          );
          // this.mobData = this.tableData;
          this.viewMoreOnLoad(this.tableData);
          this.dataSource.paginator = this.paginator;
          // if (this.activeBtn == false) {
          //   this.allData(false);
          // }
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          });
          this.commonService.hide();
        } else {
          this.testPaginator.length = 12;
          this.noDataMsg = 'No Lists Found';
          this.hasData = false;
          this.commonService.hide();
        }
      },
      (error) => {
        this.testPaginator.length = 12;
        this.noDataMsg = 'No Lists Found';
        this.hasData = false;
        this.commonService.hide();
      }
    );
  }

  viewMoreOnLoad(data) {
    if (this.shareEvents.mobileSearchPage == 'mylist') {
      this.mobData = data.filter(data => data.listName.toLowerCase().includes(this.shareEvents.mobileSearchVal));
    } else {
      this.mobData = data.slice(0, 12);
    }
    if (data.length > 12 && this.mobData.length != data.length) {
      this.viewMoreVisible = this.mobData.length > 11 ? true : false;
    } else {
      this.viewMoreVisible = false;
    }
  }
  viewMoreClick() {
    if (!this.isMobFilter) {
      if (this.activeBtn) {
        this.mobData = this.dummyData.slice(0, this.currentValue);
        if (this.dummyData.length > 12 && this.mobData.length != this.dummyData.length) {
          this.viewMoreVisible = true;
        }
        else {
          this.viewMoreVisible = false;
        }
        this.currentValue += 12;
      } else {
        this.mobData = this.tableData.slice(0, this.currentValue);
        if (this.tableData.length > 12 && this.mobData.length != this.tableData.length) {
          this.viewMoreVisible = true;
        }
        else {
          this.viewMoreVisible = false;
        }
        this.currentValue += 12;
      }
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

  filterData(dataType) {
    this.dataSource.filterPredicate = (elm, filter) => {
      return (
        filter.split(',').includes('ALL') ||
        filter.split(',').includes(elm[dataType])
      );
    };
  }
  pageEvent($event) {
    this.paginator.pageIndex = $event.pageIndex;
    this.paginator.pageSize = $event.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  showDropdown(listName?: string) {
    this.hiddenOps = { [listName]: !this.hiddenOps[listName] };
  }

  editClickHandler(data) {
    this.successInd$.next(false);
    this.commonService.show();
    const dataforDetail = {
      listName: data.listName,
      userID: data.userID
    }
    this.myListService.getMyListData(dataforDetail).subscribe(
      result => {
        result?.entriesList?.forEach((element) => {
          element.product.quantity = 1;
        });
        this.selectedMyListData = result;
        
        this.editMode = true;
        this.commonService.hide();
      } 
    );   
  }

  backToMyListHandler(value) {
    this.editMode = false;
    this.commonService.show();
    this.getMyList();
  }
  addToCartProducts(element) {
    if (element.entriesList && element.entriesList.length > 0) {
      this.sharedMethodsService.addAllProductsToCArt(element.entriesList);
      this.successInd$.next(true);
      this.infoMessage = 'Successfully added to the cart';
      setTimeout(() => {
        this.successInd$.next(false);
      }, 10000);
    }
  }
  closeSuccessMsg() {
    this.successInd$.next(false);
    this.errorInd$.next(false);
  }

  statusSelected(data) {
    if (data.length == 2) {
      this.mobData = this.dummyData;
    } else if (data.length > 0) {
      data.forEach((element) => {
        if (element == 'Active') {
          this.tableData = this.dummyData.filter((x) => x.archived == false);
          this.filteredTableData = this.tableData;
        }
        if (element == 'Archived') {
          this.tableData = this.dummyData.filter((x) => x.archived == true);
          this.filteredTableData = this.tableData;
        }
      });
      this.mobData = this.filteredTableData;
    } else {
      this.mobData = this.tableData;
    }
    this.viewMoreOnLoad(this.mobData);
  }

  typeSelected(data) {
    if (data.length == 2) {
      this.mobData = this.dummyData;
    } else if (data.length > 0) {
      data.forEach((element) => {
        if (element == 'MYLIST') {
          this.tableData = this.dummyData.filter((x) => x.type == element);
          this.filteredTableData = this.tableData;
        }
        if (element == 'TEMPLATE') {
          this.tableData = this.dummyData.filter((x) => x.type == element);
          this.filteredTableData = this.tableData;
        }
      });
      this.mobData = this.filteredTableData;
    } else {
      this.mobData = this.tableData;
    }
    this.viewMoreOnLoad(this.mobData);
  }
}

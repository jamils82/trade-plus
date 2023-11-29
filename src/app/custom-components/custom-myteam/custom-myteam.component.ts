import { CommonService } from './../../core/service/CommonService/common.service';
import { TeamMemberService } from './../../core/service/team-member.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
const ELEMENT_DATA: PeriodicElement[] = []

export interface PeriodicElement {
  creditLimit: string;
  inviteStatus: string;
  invitedBy: string;
  invitedByName: string;
  invitedOn: string;
  mobileNumber: string;
  name: string;
  permissionList: [];
  selectedTradeAccount: string;
  temporaryAccess: boolean;
  userType: string;
}

@Component({
  selector: 'app-custom-myteam',
  templateUrl: './custom-myteam.component.html',
  styleUrls: ['./custom-myteam.component.scss'],
})
export class CustomMyteamComponent implements OnInit, AfterViewInit, OnDestroy {
  modalRef: any;
  hasData: boolean = false;
  displayedColumns: string[] = [
    'firstName',
    'userType',
    'email',
    'mobileNumber',
    'addedOn',
    'addedBy',
    'inviteStatus',
    'actions',
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
  selectedName$ = new BehaviorSubject<any>('');
  selectedUID: string;
  dataSource: any;
  infoMessage: string = '';
  successInd$ = new BehaviorSubject<boolean>(false);
  errorInd: boolean = false;
  showloader: boolean;
  noDataMsg = '';
  isCreateInviteGroupPermissions: boolean;
  isAccountOwnerGroupPermissions: boolean;
  currentUID: string;
  showPermissionError: boolean = false;
  heading: string = 'FORGOT TO ADD PERMISSIONS?';
  isMobile: boolean = false;
  mobData: any;
  viewMoreItems: any = [];
  viewMoreVisible: boolean = false;
  currentValue = 24;
  tableData: any = [];
  mobileSearchSubscription : Subscription;
  constructor(
    private modalService: NgbModal,
    private teamMemberService: TeamMemberService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public commonService: CommonService,
    public shareEvents: ShareEvents,
    public ref: ChangeDetectorRef
  ) {
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.currentUID = localStorage.getItem('selectedIUID');
      }
    });
  }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;

        // this.accountDropDownStateService.setAccountState(data);
        // this.initializeDropdownData(data);
        this.commonService.show();
        this.getInviteeList();

        //   this.userProfileDetailsService.setCheckPermissions();
        this.isCreateInviteGroupPermissions = this.userProfileDetailsService.isCreateInviteGroupPermission();
        this.isAccountOwnerGroupPermissions = this.userProfileDetailsService.isAccountOwnerPermission();
        this.ref.markForCheck()
        if (this.isCreateInviteGroupPermissions || this.isAccountOwnerGroupPermissions) {
          //   alert(this.isCreateInviteGroupPermissions+ 'this.isCreateInviteGroupPermissions' + this.isAccountOwnerGroupPermissions + 'this.isAccountOwnerGroupPermissions');
          this.isCreateInviteGroupPermissions = true;
          // alert(this.isCreateInviteGroupPermissions+ 'this.isCreateInviteGroupPermissions' + this.isAccountOwnerGroupPermissions + 'this.isAccountOwnerGroupPermissions');
        } else {
          this.isCreateInviteGroupPermissions = false;
          // alert(this.isCreateInviteGroupPermissions+ 'this.isCreateInviteGroupPermissions' + this.isAccountOwnerGroupPermissions + 'this.isAccountOwnerGroupPermissions');
        }
        //    alert( this.isCreateInviteGroupPermissions +' this.isCreateInviteGroupPermissions ');
      }
    });
    //  this.teamMemberService.showWaitCursor.subscribe(val => this.showloader = val)

    this.selectedName$.next(localStorage.getItem('selectedAcc'));
    this.mobileSearchSubscription = this.shareEvents.mobileSearchSubject.subscribe((val) => {
      if (val != undefined) {
        this.commonService.show();
        this.getInviteeList();
      }
    })
  }

  ngAfterViewInit() {

    if (this.sort) {
      this.sort?.sort(<MatSortable>({ id: 'firstName', start: 'desc' }));
      this.sort?.sort(<MatSortable>({ id: 'userType', start: 'desc' }));
      this.sort?.sort(<MatSortable>({ id: 'email', start: 'desc' }));
      this.sort?.sort(<MatSortable>({ id: 'mobileNumber', start: 'desc' }));
      this.sort?.sort(<MatSortable>({ id: 'inviteStatus', start: 'desc' }));
      this.sort?.sort(<MatSortable>({ id: 'addedOn', start: 'desc' }));
      this.dataSource.sort = this.sort;

    }

  }
  ngOnDestroy(): void {
      if(this.mobileSearchSubscription) {
        this.mobileSearchSubscription.unsubscribe()
      }
  }
  editMember(content, evt) {
    this.currentItem.type = 'edit';
    this.currentItem.data = evt;
    this.modalRef = this.modalService.open(content, {
      windowClass: 'editmember',
      centered: true,
      size: 'lg',
    });
    this.modalRef.result.then((result) => {
      if (result === 'success') {
      }
    }, (name) => {
      if (name != '') {
        if (name == 'EmptyPermission') {
          this.infoMessage = 'Looks like you are inviting a team member without assigning any permissions. Are you sure about this? If so, they will be able to view the portal but unable to transact in any way.';
          this.showPermissionError = true;
          let modalRef = this.modalService.open(content, {
            windowClass: 'warningMessagePopup',
            centered: true,
            size: 'md',
          });
          modalRef.result.then((result) => {
            if (result === 'success') {
            }
          }, (name: any) => {
            this.showPermissionError = false;
            return;
          })


        } else {
          this.infoMessage = '';
          this.infoMessage = "Your invitation has been successfully updated";
          this.successInd$.next(true);;
          this.getInviteeList();
          setTimeout(() => {
            this.successInd$.next(false);;
            this.dataSource.paginator = this.paginator;
          }, 10000);
        }
      }
    })
    // this.modalRef.componentInstance.data = evt;
  }

  deleteMember(content, evt) {
    this.currentItem.type = 'delete';
    this.currentItem.data = evt;
    this.currentItem.page = 'MyTeam';
    this.modalRef = this.modalService.open(content, {
      windowClass: 'deletemember',
      centered: true,
      size: 'lg',
    });

    this.modalRef.result.then((result) => {
      if (result === 'success') {
      }
    }, (name) => {
      if (name == true) {
        this.infoMessage = '';
        this.infoMessage = "Your invitation has been successfully deleted";
        this.successInd$.next(true);;
        this.getInviteeList();
        setTimeout(() => {
          this.successInd$.next(false);;
          this.dataSource.paginator = this.paginator;
        }, 10000);
      }
    })
  }

  status(status) {

    if (status == 'INVITE_SENT')
      return {
        //  padding: '0 25px',
        background: '#e3e5d7',
        color: '#FF7D39',
        width: '107px',
      };
    else if (status == 'INVITE_ACCEPTED')
      return {
        //  padding: '0 25px',
        background: '#e4f2e7',
        color: '#0B961B',
        width: '107px',
      };
    else if (status == 'INVITE_EXPIRED')
      return {
        //  padding: '0 25px',
        background: '#fcedef',
        color: '#973937',
        width: '107px',
      };
    else return { background: 'grey', color: '#973937' };
  }

  public doFilter = (value: string) => {

    this.dataSource.filter = value
      .trim()
      .toLocaleLowerCase();
  };

  addMemberPopup(content) {
    this.currentItem.type = null;
    this.modalRef = this.modalService.open(content, {
      windowClass: 'addmember',
      centered: true,
      size: 'lg',
    });
    this.modalRef.result.then((result) => {
      if (result === 'success') {
      }
    }, (name: any) => {
      if (name != '') {
        if (name == 'EmptyPermission') {
          this.infoMessage = 'Looks like you are inviting a team member without assigning any permissions. Are you sure about this? If so, they will be able to view the portal but unable to transact in any way.';
          this.showPermissionError = true;
          let modalRef = this.modalService.open(content, {
            windowClass: 'warningMessagePopup',
            centered: true,
            size: 'md',
          });
          modalRef.result.then((result) => {
            if (result === 'success') {
            }
          }, (name: any) => {
            this.showPermissionError = false;
            return;
          })


        } else {
          this.infoMessage = '';
          if (name.split(' ')[0] == 'Profile') {
            this.errorInd = true;
            this.successInd$.next(false);;
          } else {
            this.successInd$.next(true);;
          }
          this.infoMessage = name;
          this.getInviteeList();
          setTimeout(() => {
            this.successInd$.next(false);;
            this.errorInd = false;
            this.dataSource.paginator = this.paginator;
          }, 10000);
        }
      }
    })
  }

  getInviteeList() {
    this.selectedUID = localStorage.getItem('selectedIUID');
    const data = {
      uid: this.selectedUID,
      email: this.emailId,
    };

    this.teamMemberService.getInviteeList(data).subscribe((result) => {

      if (result && result.inviteUsers && result.inviteUsers.length > 0) {
        this.commonService.hide();
        this.ref.markForCheck()
        this.hasData = true;
        result.inviteUsers.forEach(element => {
          let mobileNumber = element?.mobileNumber.substring(3,element.mobileNumber.length);
          if(mobileNumber) {
            element.mobileNumber = mobileNumber;
          }
        });
        this.testPaginator.length = result.inviteUsers.length;
        this.dataSource = new MatTableDataSource<PeriodicElement>(result.inviteUsers);
        this.tableData = result.inviteUsers;
        this.viewMoreOnLoad(this.tableData);
        setTimeout(() => {
          this.sort?.sort(<MatSortable>({ id: 'firstName', start: 'desc' }));
          this.sort?.sort(<MatSortable>({ id: 'userType', start: 'desc' }));
          this.sort?.sort(<MatSortable>({ id: 'email', start: 'desc' }));
          this.sort?.sort(<MatSortable>({ id: 'mobileNumber', start: 'desc' }));
          this.sort?.sort(<MatSortable>({ id: 'inviteStatus', start: 'desc' }));
          this.sort?.sort(<MatSortable>({ id: 'addedOn', start: 'desc' }));
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = function (data, filter: string): boolean {
            let filterData = data.firstName + ' ' + data.lastName;
            return filterData.toLowerCase().includes(filter);
          };
        })
        // this.dataSource.sort = this.sort;
      } else {
        // this.dataSource = new MatTableDataSource<PeriodicElement>(null);
        this.testPaginator.length = 10;
        this.noDataMsg = '  There are no Invites';
        this.hasData = false;
        this.commonService.hide();
      }
    },
      (error) => {
        this.testPaginator.length = 10;
        this.noDataMsg = '  There are no Invites';
        this.hasData = false;
        this.commonService.hide();
      });
  }
  viewMoreOnLoad(data) {
    if ( this.shareEvents.mobileSearchPage == 'memberTeam') {
      this.mobData = data.filter(data => data.firstName.toLowerCase().includes(this.shareEvents.mobileSearchVal));
    } else {
      this.mobData = data.slice(0, 12);
    }
    if (data.length > 12 && this.mobData.length != data.length) {
      this.viewMoreVisible = this.mobData.length > 11 ? true : false;;
    }
    else {
      this.viewMoreVisible = false;
    }
  }
  viewMoreClick() {
    this.mobData = this.tableData.slice(0, this.currentValue);
    if (this.tableData.length > 12 && this.mobData.length != this.tableData.length) {
      this.viewMoreVisible = true;
    }
    else {
      this.viewMoreVisible = false;
    }
    this.currentValue += 12;
  }
  pageEvent($event) {
    this.paginator.pageIndex = $event.pageIndex;
    this.paginator.pageSize = $event.pageSize;
    this.dataSource.paginator = this.paginator;
  }
}

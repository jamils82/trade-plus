import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { checkoutService } from 'src/app/core/service/checkout.service';
import { FindStoreService } from 'src/app/core/service/findStore.service';

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogComponent {
  contactList_Template: boolean = false;
  deliveryAddress_Template: boolean = false;
  addBranch_Template: boolean = false;
  mobile: any;
  lastName: any;
  firstName: any;
  dialogData: { [key: string]: Object | null } = {
    address: '',
    contactList: null,
  };
  public branchListData: any;
  public tempBranchListAllData: any;
  public homeBranchData: any = [];

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    public dialog: MatDialog,
    public checkoutService: checkoutService,
    private findStoreService: FindStoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data.contactData?.mobile.substring(0, 4) == '+610'){
      this.mobile = data.contactData?.mobile.substring(4, data.contactData?.mobile.length);
    }else if(data.contactData?.mobile.substring(0, 3) == '+61'){
      this.mobile = data.contactData?.mobile.substring(3, data.contactData?.mobile.length);
    }else{
      this.mobile = data.contactData?.mobile;
    }
    this.firstName = data.contactData?.firstName;
    this.lastName = data.contactData?.lastName;
    // data.allBranchList.shift();
    this.homeBranchData = [];
    this.branchListData = data.allBranchList;
    this.homeBranchData.push(data.allBranchList[0]);
    this.tempBranchListAllData = data.allBranchList.filter(x => x.name != data.allBranchList[0].name);
  }

  contactNumber(number) {
    var h;
    if(number != undefined){
      h = number?.replace(/\s/g, '');
      var val = h.substr(0, 2) + ' ' + h.substr(2, 4) + ' ' + h.substr(6, h.length);
    }
    return val
  }

  getContactData() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      mobile: '+610' + this.mobile,
      is_SMS: true,
    };
  }

  searchBranch(searchKey: string) {
    // this.tempBranchListAllData = this.branchListData.filter((x) => {
    //   if (x.name.toLowerCase().includes(searchKey)) {
    //     return x;
    //   }
    // });
    if(searchKey == '') {
      searchKey = this.homeBranchData[0].name;
    }
    this.findStoreService.getGeoLocationforHybris(searchKey).subscribe(
      geoLocation => {
        const branchData1 = {
          lat: geoLocation.results[0].geometry.location.lat,
          long: geoLocation.results[0].geometry.location.lng
        }
        this.findStoreService.getAllStores(branchData1).subscribe(data => {
          data.stores.forEach(element => {
            if (element.buOpeningSchedule) {
              // element.buOpeningSchedule.find(v => v.code.includes('Trade')).code = 'Trade';
              // element.buOpeningSchedule.find(v => v.code.includes('Showroom')).code = 'Showroom';
              if (element.buOpeningSchedule[0].weekDayOpeningList && element.buOpeningSchedule[0].weekDayOpeningList.length > 1) {
                element.buOpeningSchedule[0].weekDayOpeningList.push(element.buOpeningSchedule[0].weekDayOpeningList.shift());
              }
              if (element.buOpeningSchedule[1].weekDayOpeningList && element.buOpeningSchedule[1].weekDayOpeningList.length > 1) {
                element.buOpeningSchedule[1].weekDayOpeningList.push(element.buOpeningSchedule[1].weekDayOpeningList.shift());
              }
            }
          });
          // this.accordions = data.stores;
          this.tempBranchListAllData = data.stores.filter(x => x.name != this.homeBranchData[0]?.name);
        });
      })
  }

  isDelivery(): boolean {
    return this.data.templateName == 'deliveryAddress_Template' ? true : false;
  }

  isContactList(): boolean {
    if (this.data.templateName == 'contactList_Template') {
      return true;
    }
    return false;
  }

  branchSelectClick(value: any) {
    this.dialogRef.close({ branchData: value });
  }

  onNoClick(isCancel: boolean = false): void {
    this.dialogData.contactList = this.getContactData();
    this.dialogRef.close(isCancel ? this.dialogData : undefined);
  }

  testFormValid(formVal) {
    let ele = document.getElementById('save_button');
    if (!formVal.valid) {
      ele.classList.add('disabled_save_button');
    } else {
      ele.classList.remove('disabled_save_button');
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 43 &&
      charCode !== 32
    ) {
      return false;
    }
    return true;
  }
}

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamMemberService } from 'src/app/core/service/team-member.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-member-pop-up',
  templateUrl: './add-member-pop-up.component.html',
  styleUrls: ['./add-member-pop-up.component.scss'],
  providers: [DatePipe]
})
export class AddMemberPopUpComponent implements OnInit {
  currentPage: any = 'MyTeam';
  isAccess: boolean;
  isAccessDisabled: boolean = true;
  isAccMgmt: boolean;
  isAccMgmtInvoice: boolean;
  isPricing: boolean;
  isViewOrders: boolean;
  isPlaceOrders: boolean;
  accountManagementIcon: boolean = true;
  pricingAccordionIcon: boolean = true;
  placeOrdersAccordionIcon: boolean = true;
  popUpTitle: string;
  isEdit: boolean;
  teamMember: FormGroup;
  @Input() data: any;
  submitted: boolean;
  permissionList: any = [];
  emailId: any;
  isTemproryAccess: boolean = false;
  permanentAccess: boolean = true;;
  endDate: string;
  startDate: string;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private teamMemberService: TeamMemberService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    private datePipe: DatePipe
  ) {

  }

  createTeammemberForm(data) {
    try {
      this.teamMember = new FormGroup({
        fname: new FormControl({ value: data.firstName || '', disabled: false }, [Validators.required, Validators.pattern("[a-zA-Z ]*")]),
        lname: new FormControl({ value: data.lastName || '', disabled: false }, [Validators.required, Validators.pattern("[a-zA-Z ]*")]),
        email: new FormControl({ value: data.email, disabled: false }, [Validators.required, Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]),
        mobile: new FormControl({ value: data.mobileNumber || '', disabled: false }, [Validators.required, Validators.maxLength(9), Validators.pattern('[+()0-9]+')]),
        orderLimit: new FormControl({ value: data.creditLimit || null, disabled: false }, [Validators.maxLength(9)]),
        role: new FormControl(null)
      });
      this.teamMember.controls['role'].setValue(data.userType != undefined ? this.setRole(data.userType) : 2, { onlySelf: true });
      this.negativeConverter();
    } catch (ex) {
    }
  }


  ngOnInit(): void {

    let formData: any = {};
    if (this.data.type == null) {
      this.popUpTitle = 'ADD TEAM MEMBERS';
      this.isEdit = false;
      this.isAccess = false;
      this.isAccMgmt = false;
      this.isPricing = false;
      this.isAccMgmtInvoice = false;
      this.isViewOrders = true;
      this.isPlaceOrders = false;
      this.isTemproryAccess = false;
      this.permissionList.push('viewOrdersGroup');
      this.createTeammemberForm(formData);
      this.onChange(2);
    } else {
      formData = this.data.data;
      if (this.data.data.role == "ADMIN") {
        this.isAccessDisabled = false;
      }
      this.isTemproryAccess = formData.temporaryAccess;

      this.popUpTitle = 'EDIT TEAM MEMBERS';
      this.isEdit = true;
      if (this.data.data.startDate && this.data.data.endDate) {
        this.startDate = this.datePipe.transform(this.data.data.startDate, 'dd/MM/yyyy');
        this.endDate = this.datePipe.transform(this.data.data.endDate, 'dd/MM/yyyy');
      }
      for (let entry of this.data.data.permissionList) {
        if (entry.uid == "accountManagementGroup") {
          this.isAccMgmt = true;
        }
        if (entry.uid == "accountManagementGroupInvoice") {
          this.isAccMgmtInvoice = true;
        }
        if (entry.uid == "tradelinkPricingGroup") {
          this.isPricing = true;
        }
        if (entry.uid == "viewOrdersGroup") {
          this.isViewOrders = true;
        }
        if (entry.uid == "placeOrdersGroup") {
          this.isPlaceOrders = true;
        }
        if (entry.uid == "createInviteGroup") {
          this.isAccess = true;
        }
        this.permissionList.push(entry.uid);

      }
      this.createTeammemberForm(formData);
      //  alert(this.isEdit);
      // this.teamMember.controls['name'].reset({ disabled: true });
    }
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;

        // this.accountDropDownStateService.setAccountState(data);
        // this.initializeDropdownData(data);
      }
    });
    // this.checkValue();

  }
  // closePopUp() {
  //   this.modalService.dismissAll()
  // }
  get f() { return this.teamMember.controls; }

  managePermissionList(permissionData: any) {
    // console.log("data:", permissionData)
    permissionData.permission ? this.permissionList.push(permissionData.permissionName) : this.filter(permissionData);

  }

  managePermissionListInvoice(permissionData: any) {
    // console.log("data:", permissionData)
    permissionData.permission ? this.permissionList.push(permissionData.permissionName) : this.filter(permissionData);
    // permissionData = !permissionData;
  }

  filter(data) {
    this.permissionList = this.permissionList.length ? this.permissionList.filter(x => x !== data.permissionName) : []
  }



  getRole(role) {
    role = this.teamMember.controls['role'].value;
    let roleValue;
    switch (role) {
      case 0: roleValue = 'TEAMMEMBER';
        break;
      case 1: roleValue = 'TEAMSUPERVISOR';
        break;
      case 2: roleValue = 'ADMIN';
        break;
      case 3: roleValue = 'EXTERNALTRADIE';
        break;
    }

    return roleValue;
  }

  setRole(role) {
    let roleValue;
    switch (role) {
      case 'TEAMMEMBER': roleValue = 0;
        break;
      case 'TEAMSUPERVISOR': roleValue = 1;
        break;
      case 'ADMIN': roleValue = 2;
        break;
      case 'EXTERNALTRADIE': roleValue = 3;
        break;
    }
    return roleValue;
  }

  sendInvite() {
    this.submitted = true;
    if (this.teamMember.invalid) {
      return;
    }
    if (this.teamMember.valid) {
      let temporaryAccess: any = this.isTemproryAccess;
      let orderLimit = this.teamMember.get("orderLimit").value;
      if (orderLimit != null && orderLimit != '') {
        orderLimit = (orderLimit.split('$')[1].split('.')[0]).replace(/,/g, '');
      }
      let invitee: any = {
        "creditLimit": this.teamMember.get("orderLimit") != undefined ? orderLimit != '' ? orderLimit : null : null,
        "email": this.teamMember.get('email').value,
        "inviteStatus": "INVITE_SENT",
        "invitedBy": this.emailId,
        "mobileNumber": '+61' + this.teamMember.get('mobile').value,
        "firstName": this.teamMember.get('fname').value,
        "lastName": this.teamMember.get('lname').value,
        "permissionList": this.permissionList,
        "role": this.getRole(this.teamMember.get('role').value),
        "selectedTradeAccount": localStorage.getItem('selectedIUID'),
        "temporaryAccess": temporaryAccess,
      }

      if (temporaryAccess) {
        let now = new Date();
        now.setMonth(now.getMonth() + 1);
        invitee.startDate = this.startDate == undefined ? (this.datePipe.transform(new Date(), 'dd/MM/yyyy')) : this.startDate;
        invitee.endDate = this.endDate == undefined ? (this.datePipe.transform(now, 'dd/MM/yyyy')) : this.endDate;
      }
      if (this.permissionList.length == 0) {
        this.modalService.dismissAll('EmptyPermission');
        return;
      }
      this.teamMemberService.createInviteeList(invitee)
        .subscribe(
          result => {
            this.close(result.message == 'CREATED' ? 'CREATED' : result.message);
          }
        )
    }


  }

  saveInvite() {
    let temporaryAccess: any = this.isTemproryAccess;
    let orderLimit = this.teamMember.get("orderLimit").value;
    if (orderLimit != null && orderLimit != '') {
      orderLimit = (orderLimit.split('$')[1].split('.')[0]).replace(/,/g, '');
    }
    if (this.permissionList.length != 0) {
      let invitee: any = {
        "creditLimit": this.teamMember.get("orderLimit") != undefined ? orderLimit != '' ? orderLimit : null : null,
        "email": this.teamMember.get('email').value,
        "inviteStatus": this.data.data.inviteStatus,
        "invitedBy": this.emailId,
        "mobileNumber": '+61' + this.teamMember.get('mobile').value,
        "firstName": this.teamMember.get('fname').value,
        "lastName": this.teamMember.get('lname').value,
        "permissionList": this.permissionList,
        "role": this.getRole(this.teamMember.get('role').value),
        "selectedTradeAccount": localStorage.getItem('selectedIUID'),
        "temporaryAccess": temporaryAccess
      }
      if (temporaryAccess) {
        let now = new Date();
        now.setMonth(now.getMonth() + 1);
        invitee.startDate = this.startDate == undefined ? (this.datePipe.transform(new Date(), 'dd/MM/yyyy')) : this.startDate;
        invitee.endDate = this.endDate == undefined ? (this.datePipe.transform(now, 'dd/MM/yyyy')) : this.endDate;
      }
      this.teamMemberService.updateInviteeList(invitee)
        .subscribe(
          result => {
            this.close('CREATED');
          }
        )
    } else {
      this.modalService.dismissAll('EmptyPermission');
      return;
    }
  }

  close(result: string) {
    if (result != 'CREATED') {
      this.modalService.dismissAll(result);
    } else {
      this.modalService.dismissAll("Your invitation has been sent to " + this.teamMember.get('fname').value);
    }
  }
  closePopup() {
    this.modalService.dismissAll('');
  }
  onChange(value) {
    // console.log("Value:", value)
    value = this.teamMember.controls['role'].value;
    this.permissionList = [];
    if (value == 0) {

      this.isAccess = false;
      this.isAccessDisabled = true;
      this.isAccMgmt = false;
      this.isAccMgmtInvoice = false;
      this.isPricing = false;
      this.isViewOrders = true;
      this.isPlaceOrders = false;
      this.permissionList.push('viewOrdersGroup');
    } else if (value == 1) {
      this.isAccess = false;
      this.isAccessDisabled = true;
      this.isAccMgmt = false;
      this.isAccMgmtInvoice = false;
      this.isPricing = true;
      this.isViewOrders = true;
      this.isPlaceOrders = true;
      this.permissionList.push('viewOrdersGroup');
      this.permissionList.push('tradelinkPricingGroup');
      this.permissionList.push('placeOrdersGroup');
    } else if (value == 2) {
      this.isAccess = false;
      this.isAccessDisabled = false;
      this.isAccMgmt = true;
      this.isPricing = true;
      this.isAccMgmtInvoice = true;
      this.isViewOrders = true;
      this.isPlaceOrders = true;
      this.permissionList.push('viewOrdersGroup');
      this.permissionList.push('tradelinkPricingGroup');
      this.permissionList.push('placeOrdersGroup');
      this.permissionList.push('accountManagementGroup');
      this.permissionList.push('accountManagementGroupInvoice');
    } else if (value == 3) {
      this.isAccess = false;
      this.isAccessDisabled = true;
      this.isAccMgmt = false;
      this.isAccMgmtInvoice = false;
      this.isPricing = false;
      this.isViewOrders = true;
      this.isPlaceOrders = false;
      this.permissionList.push('viewOrdersGroup');
    }
  }

  checkValue(event: Event) {
    const ctrl = this.teamMember.get('name');
    if (this.data == null) {
      ctrl.enable();
    } else {
      ctrl.disable();
    }
  }

  setDateRange(range) {
    this.startDate = range.start;
    this.endDate = range.end;
  }
  accountManagementClick() {
    this.accountManagementIcon = !this.accountManagementIcon;
  }

  pricingAccordionClick() {
    this.pricingAccordionIcon = !this.pricingAccordionIcon;
  }

  placeOrdersAccordionClick() {
    this.placeOrdersAccordionIcon = !this.placeOrdersAccordionIcon;
  }

  tabClicked(id) {
  }
  permanentAccessClicked() {
    this.isTemproryAccess = !this.isTemproryAccess;
  }
  reFormatValue() {
    let orderLimit = this.teamMember.get("orderLimit").value;
    if (orderLimit != null && orderLimit != '') {
      orderLimit = orderLimit.split('$')[1].split('.')[0];
      this.teamMember.get('orderLimit').setValue(orderLimit);
    }
  }
  negativeConverter() {
    let value = this.teamMember.get('orderLimit').value;
    if (value != '') {
      let isDollar = value.split('$').length > 1 ? true : false;
      if (isDollar) {
        // let val: any = parseFloat(value).toFixed(2);
        // if (/\$/g.test(val)) {
        // let isMinus = val.split('-')[1];
        // let valReturn = '-$' + parseFloat(isMinus).toLocaleString(undefined, { minimumFractionDigits: 2 });
        this.teamMember.get('orderLimit').setValue(value);
      } else {
        let valReturn = '$' + parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 });
        this.teamMember.get('orderLimit').setValue(valReturn);
      }
    }
  }
}

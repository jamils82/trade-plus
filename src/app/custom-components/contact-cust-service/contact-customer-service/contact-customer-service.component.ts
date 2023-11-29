import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { createAccountFormConstants } from 'src/app/core/constants/general';
import { SendNoteService } from 'src/app/core/service/sendNoteSevice.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { AccountDropDownStateService } from 'src/app/shared/services/accountsDropdownState.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
@Component({
  selector: 'app-contact-customer-service',
  templateUrl: './contact-customer-service.component.html',
  styleUrls: ['./contact-customer-service.component.scss']
})
export class ContactCustomerServiceComponent implements OnInit, OnDestroy {

  responseOpen: boolean = true;
  responseSuccess: boolean = false;
  createAccountFormConstants = createAccountFormConstants;
  numpattern = '[0-9]*$';
  emailCheck: boolean = false;
  nameCheck: boolean = false;
  companyNameCheck: boolean = false;
  accountNumberCheck: boolean = false;

  formDefaultData = {
    email: '',
    name: '',
    phoneNumber: '0418329728',
    accountNumber: '0009638985',
    accountName: 'Insulgreen Solutions'
  }

  private subscription = new Subscription();
  private user$: Observable<User | undefined>

  contactCSRForm: FormGroup;
  @ViewChild('contactCustomerServiceModal', { static: true }) contactCustomerServiceModal;

  phoneCheck: boolean = false;
  accountNoCheck: boolean = false;
  selectedAccount: any;

  constructor(private modalService: NgbModal,
    private fb: FormBuilder,
    private shareEvents: ShareEvents,
    private sendNoteService: SendNoteService,
    private fiUserAccountDetailsService: FIUserAccountDetailsService,
    private accountDropDownStateService: AccountDropDownStateService) {
    this.user$ = this.fiUserAccountDetailsService.getUserAccount();
  }

  ngOnInit() {
    this.initializeForm();

    //Receive Event for Contact Customer Service Popup Event
    this.subscription.add(this.shareEvents.contactCustomerServicePopupReceiveEvent().subscribe(() => {
      this.openPopup();
    }));

    this.subscription.add(this.accountDropDownStateService._getSelectedAccountState$.subscribe((selAccount) => {
      this.selectedAccount = selAccount.selectedAccount;
    }));
  }

  populateFieldsData() {
    this.formDefaultData.name = this.accountDropDownStateService.userdisplayName;
    this.formDefaultData.accountName = this.selectedAccount.name
    this.formDefaultData.email = this.accountDropDownStateService.getAccountEmailId;
    this.formDefaultData.accountNumber = this.selectedAccount.uid;
  }

  openPopup() {
    this.populateFieldsData();
    this.contactCSRForm.patchValue(this.formDefaultData);
    this.modalService
      .open(this.contactCustomerServiceModal, { centered: true, windowClass: 'contactCSRForm', size: 'lg' })
      .result.then(
        (result) => {
          this.resetAndCloseForm();
        },
        (reason) => {
          //  document.querySelector('body').classList.remove('popupStyle');
          this.resetAndCloseForm();
        }
      );
  }

  initializeForm() {
    this.contactCSRForm = this.fb.group(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        name: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.pattern(this.numpattern), Validators.minLength(9), Validators.maxLength(10)]),
        accountNumber: new FormControl('', [Validators.required, Validators.pattern(this.numpattern)]),
        accountName: new FormControl('', [Validators.required]),
        comments: new FormControl('')
      }
    );
  }

  formValidationCheck() {
    if (this.getCommonFieldsValidation() || this.isNullOrEmpty(this.contactCSRForm.value.accountNumber || this.isNullOrEmpty(this.contactCSRForm.value.accountName))
    ) {
      return true;
    } else {
      return false;
    }
  }

  isNullOrEmpty(valueToCheck: string) {
    return (valueToCheck == null || valueToCheck == '') ? true : false;
  }

  getCommonFieldsValidation() {
    return (this.isNullOrEmpty(this.contactCSRForm.value.email) || this.isNullOrEmpty(this.contactCSRForm.value.name))
  }


  submit($event) {
    var isFormDataInvalid = false;

    if (this.isNullOrEmpty(this.contactCSRForm.value.email)) {
      this.emailCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.contactCSRForm.value.name)) {
      this.nameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.contactCSRForm.value.accountName)) {
      this.companyNameCheck = true;
      isFormDataInvalid = true;
    }
    if (this.isNullOrEmpty(this.contactCSRForm.value.accountNumber)) {
      this.accountNumberCheck = true;
      isFormDataInvalid = true;
    }
    if (!isFormDataInvalid) {
      // document.querySelector('body').classList.remove('popupStyle');
      this.thankYouPopUp();
    }
  }

  resetAndCloseForm() {
    this.responseOpen = true;
    this.contactCSRForm.reset();
    this.modalService.dismissAll();
    this.emailInputVal();
    this.nameInputVal();
    this.companyNameInputVal();
    this.accountNumberCheckInputVal();
  }

  thankYouPopUp() {
    this.subscription.add(this.sendNoteService.sendNote(JSON.stringify(this.contactCSRForm.value)).subscribe(responseData => {
      if (responseData === "Success") {
        this.responseSuccess = true;
      } else {
        this.responseSuccess = false;
      }
      this.responseOpen = false;
    }, error => {
      this.responseSuccess = false;
      this.responseOpen = false;
    }));
  }

  emailInputVal() {
    this.emailCheck = false;
  }

  nameInputVal() {
    this.nameCheck = false;
  }

  companyNameInputVal() {
    this.companyNameCheck = false;
  }

  accountNumberCheckInputVal() {
    this.accountNumberCheck = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  validatePhoneNum() {
    return (!this.contactCSRForm.get('phoneNumber').valid && this.contactCSRForm.get('phoneNumber').touched);
  }

}

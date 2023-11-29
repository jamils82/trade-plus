import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { companyProfile, quoteConstants } from 'src/app/core/constants/general';
import { CustomCancelPopupComponent } from 'src/app/custom-components/custom-customerQuotes/custom-cancel-popup/custom-cancel-popup.component';
import { QuotesService } from 'src/app/core/service/quotes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-details-popup',
  templateUrl: './company-details-popup.component.html',
  styleUrls: ['./company-details-popup.component.scss']
})
export class CompanyDetailsPopupComponent implements OnInit {
  modalRef: any;
  quoteConstants = quoteConstants;
  companyProfileConstants = companyProfile;
  adrressEditmode = false;
  jobadrressError = false;
  jobAddressLine1: any;
  jobAddressLine2: any;
  jobAddressPostalCode: any;
  jobAddressTown: any;
  disbaledBtn = false;
  setEditAddress: any;
  placeholderCustom: any;
  fileName: any;
  file: any;
  @Input() form: FormGroup;
  uploadForm: FormGroup;
  fileErrorMsg = false;
  fileUplpoadError = false;
  noLogo = false;
  @ViewChild('uploader', { static: false })
  InputVar: ElementRef;
  private subscription = new Subscription();
  @Input() companyProfileData;
  @Input() noCompanyData;
  @Output() companySettingsSubmit = new EventEmitter();
  isDisabled = true;

  constructor(
    private quotesService: QuotesService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {

  }
  ngOnInit(): void {
    if (this.noCompanyData == "no-result") {
      this.isDisabled = true;
    }
    this.placeholderCustom = this.companyProfileConstants.companyAddressPlaceholder;
    this.form.get('companyAddress')?.get('companyName')?.setValue(this.companyProfileData?.companyAddress?.companyName);
    const phone1 = this.companyProfileData?.companyAddress?.phone?.replace(/\s/g, "");
    this.form.get('companyAddress')?.get('phone')?.setValue(phone1);
    this.form.get('companyAddress')?.get('email')?.setValue(this.companyProfileData?.companyAddress?.email);
    this.form.get('paymentTerms')?.setValue(this.companyProfileData?.paymentTerms);
    this.form.get('termsAndConditions')?.setValue(this.companyProfileData?.termsAndConditions && this.companyProfileData?.termsAndConditions != '' ? this.companyProfileData.termsAndConditions : this.quoteConstants.companySetupTC);
    this.fileName = this.companyProfileData?.companyLogo?.code;
    this.companyProfileData?.companyLogo ? this.fileUplpoadError = true : this.fileUplpoadError = false;
    this.companyProfileData?.companyLogo ? this.noLogo = true : this.noLogo = false;
    const address1 = this.companyProfileData?.companyAddress?.formattedAddress ? this.companyProfileData?.companyAddress?.formattedAddress.trim() : '';
    // this.form.get('formattedAddress').setValue(address1);
    this.form.get('companyAddress')?.get('address')?.setValue(address1);
  }
  inputFieldJobaddress(event) {
    this.adrressEditmode = false;
    this.jobadrressError = true;
  }
  getAdressName(event) {
    if (event.target.value.includes(',')) {
      var address: string[] = event.target.value.split(",").map((value: string) => value.trim());
      this.adrressEditmode = true;
      this.jobAddressLine1 = address[0];
      this.jobAddressLine2 = address[1];
      this.jobAddressTown = address[2];
      this.jobAddressPostalCode = address[3];
      this.jobadrressError = false;
      this.isDisabled = false;
    } else {
      var address: string[] = event.target.value;
      //  if (addressName == 'jobAddress') {
      this.jobAddressLine1 = address;
      this.jobAddressLine2 = '';
      this.jobAddressTown = '';
      this.jobAddressPostalCode = '';
      this.disbaledBtn = false;
      this.jobadrressError = false;
      //  }
    }

  }
  clearSearchField() {
    this.adrressEditmode = false;
    this.jobAddressLine1 = '';
    this.jobAddressLine2 = '';
    this.jobAddressPostalCode = '';
    this.jobAddressTown = '';
    this.jobadrressError = false;
    this.setEditAddress = '';
    this.formEmptyCheck();
  }
  uploadFile($event) {
    this.fileErrorMsg = false;
    this.fileUplpoadError = false;
    if (($event.target.files.length > 0) && ($event.target.files[0].name).match((/\.png|\.jpg$/i)) && $event.target.files[0].size <= 102400) {
      this.fileName = $event.target.files[0].name;
      let file = $event.target.files[0];
      this.form.patchValue({
        fileSource: file
      });
      this.fileUplpoadError = true;
      this.noLogo = false;
      this.isDisabled = false;
    }
    else {
      this.fileUplpoadError = false;
      if ($event.target.files.length > 0) {
        this.fileErrorMsg = true;
      }
    }
  }
  clearUploadFile() {
    (document.querySelector(".createQuotePopup") as HTMLElement).style.visibility = 'hidden';
    this.modalRef = this.modalService.open(CustomCancelPopupComponent, {
      centered: true, keyboard: false,
      backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
    });
    this.modalRef.componentInstance.cancelPopupTitle = this.companyProfileConstants.removeLogo;
    this.modalRef.componentInstance.cancelfileuploadMessage = this.companyProfileConstants.removeLogoInfo;
    this.modalRef.componentInstance.clearFileUpload.subscribe((result) => {
      if (result == 'confirm') {
        this.form.get('fileSource').setValue('');
        this.fileName = '';
        this.fileUplpoadError = false;
        this.InputVar.nativeElement.value = "";
        this.formEmptyCheck();
      }
    });
  }
  formEmptyCheck() {
    if (
      (
        this.form.controls['companyAddress'].value.companyName == undefined || 
        this.form.controls['companyAddress'].value.companyName == '') &&
      (
        this.form.controls['companyAddress'].value.email == undefined || 
        this.form.controls['companyAddress'].value.email == '') &&
      (
        this.form.controls['companyAddress'].value.phone == undefined || 
        this.form.controls['companyAddress'].value.phone == '') &&
      (
        this.form.get('termsAndConditions').value == undefined || 
        this.form.get('termsAndConditions').value == '') &&
      (
        this.form.get('paymentTerms').value == undefined || 
        this.form.get('paymentTerms').value == '') &&
      (
        this.fileName == '' || this.fileName == undefined) &&
      (
        this.jobAddressLine1 == undefined || this.jobAddressLine1 == ''
      )
    ) {
      this.isDisabled = true;
    }
    else {
      this.isDisabled = false;
    }
  }
  changeEvent(event) {
    this.isDisabled = false;
    this.formEmptyCheck();
  }
  submitUploadForm() {
    // if (this.setEditAddress != undefined && this.setEditAddress != '') {
      var address = this.form.get('companyAddress').value.address.split(",").map((value: string) => value.trim());
      this.jobAddressLine1 = address[0] != '' ? address[0] : '';
      this.jobAddressLine2 = address[1] != '' ? address[1] : '';
      this.jobAddressTown = address[2] != '' ? address[2] : '';
      this.jobAddressPostalCode = address[3] != '' ? address[3] : '';
    // }
    let formData = new FormData();

    if (this.fileUplpoadError == false) {
      formData.append('companyLogo', new Blob(['']));
    } else if (this.fileUplpoadError == true && this.form.get('fileSource').value != '' && this.form.get('fileSource').value != null) {
      formData.append('companyLogo', this.form.get('fileSource').value);
    }
    let termsAndConditionsValue = this.form.get('termsAndConditions').value;
    formData.append('profile', new Blob([JSON.stringify({
      companyAddress: {
        email: this.form.controls['companyAddress'].value.email,
        phone: this.form.controls['companyAddress'].value.phone,
        companyName: this.form.controls['companyAddress'].value.companyName,
        country: { isocode: "AU" },
        line1: this.jobAddressLine1,
        line2: this.jobAddressLine2,
        postalCode: this.jobAddressPostalCode,
        town: this.jobAddressTown
      },
      termsAndConditions: termsAndConditionsValue == '' ? this.quoteConstants.companySetupTC : termsAndConditionsValue,
      paymentTerms: this.form.get('paymentTerms').value,
    }
    )], {
      type: "application/json"
    }));
    this.quotesService.addCompanyProfileService(formData).subscribe(res => {
      this.modalService.dismissAll();
      this.form.reset();
      this.companySettingsSubmit.emit();
    });
  }

  cancelModalPopup() {
    if (this.form.pristine == false || this.adrressEditmode || (this.fileUplpoadError && this.noLogo == false)) {
      (document.querySelector(".createQuotePopup") as HTMLElement).style.visibility = 'hidden';
      this.modalRef = this.modalService.open(CustomCancelPopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
      });
      this.modalRef.componentInstance.cancelPopupTitle = 'Cancel Company set up';
      this.modalRef.componentInstance.clearCompanyProfileForm.subscribe((result) => {
        if (result == 'confirm') {
          this.form.reset();
          this.fileUplpoadError = false;
        }
      });

    }
    else {
      this.modalService.dismissAll();
    }
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}




import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
import { CustomCancelPopupComponent } from '../../../custom-components/custom-customerQuotes/custom-cancel-popup/custom-cancel-popup.component';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { jobDetailConstants, quoteConstants } from 'src/app/core/constants/general';
import { Subscription } from 'rxjs';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { filter } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { RoutingService } from '@spartacus/core';
@Component({
  selector: 'app-create-new-quotes-popup',
  templateUrl: './create-new-quotes-popup.component.html',
  styleUrls: ['./create-new-quotes-popup.component.scss'],
})
export class CreateNewQuotesPopupComponent implements OnInit, OnDestroy {
  modalRef: any;
  quoteConstants = quoteConstants;
  //  phpattern = /^[+]?(64|0)2\d{1} ?\d{3,4} ?\d{3,4}$/; -- DO NOT REMOVE
  phpattern = /^[0-9]*$/;
  emailpattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  Quotes: any;
  createQuoteForm: FormGroup;
  quoteDetails: any;
  data: any;
  quoteDetailData: any;
  editMode = false;
  updateMode= false;
  jobAddressLine1: any;
  jobAddressLine2: any;
  jobAddressPostalCode: any;
  jobAddressTown: any;
  customerAddressLine1: any;
  customerAddressLine2: any;
  customerAddressPostalCode: any;
  customerAddressTown: any;
  setEditAddress: any;
  setEditCustomerAddress: any;
  disbaledBtn = true;
  adrressEditmode = false;
  jobadrressError = false;
  customeradrressError = false;
  scopeOfWorkVal: string = '';
  placeholderCustom: any;
  clicked: boolean = false;
  private subscription = new Subscription();
  labelData = jobDetailConstants;
  MaterialsLabel = jobDetailConstants;
  quoteHeaderCode: any;
  currentUrl: string;
  previousUrl: any;
  jobDetails: any;
  totalPrice: any;
  dataService: any;
  isLoading$: any;
  formDataNew: any;
  page: any;
  myFormVal: any;
  flagVal: boolean = false;
  prev: string;
  quoteCode: any;
  totalQuotePrice: any;
  constructor(
    private modalService: NgbModal,
    private jobDetailService: JobDetailsService,
    private QuotesService: QuotesService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private shareEvents: ShareEvents,
    private router: Router,
    public common: CommonService,
    public datepipe: DatePipe,
    private routingService: RoutingService,
    // public quotesService: QuotesService,
  ) {
    this.createQuoteForm = this.fb.group({
      jobAddress: this.fb.group({
        firstName: new FormControl('', Validators.required),
        jobLocation: new FormControl('', Validators.required),
      }),
      consumerAddress: this.fb.group({
        firstName: new FormControl(''),
        phone: new FormControl('', [Validators.pattern(this.phpattern)]),
        email: new FormControl('', [Validators.pattern(this.emailpattern)]),
        jobLocation: new FormControl(''),
      }),

      notes: new FormControl(),
      scopeOfWork: new FormControl(),
    });
  }

  ngOnInit(): void {
    sessionStorage.setItem("update", 'update')
    this.prev = localStorage.getItem("prev");
    this.currentUrl = this.router.url;
    this.previousUrl = null;
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
      // console.log("prev create new: ", this.previousUrl)
      localStorage.setItem("prev", this.previousUrl)
      // console.log("curr create new: ", this.currentUrl)
        })  
      this.page = this.common.getPage();
      // alert(this.page);
      // alert(this.common.getDta())
      // alert(this.prev)  
    if(this.prev.includes('quoteMaterials') || this.prev.includes('quoteCosts') ){
      // console.log("Formdata before If condition::", JSON.stringify(this.common.getFormData()));
      console.log("Event name:", localStorage.getItem('event'))
      this.placeholderCustom = this.quoteConstants.addressPlaceholder;
      this.subscription.add(
        this.QuotesService.checkOpenModalFrom.subscribe((res) => {
          if (res === 'edit' && (localStorage.getItem('event') == 'edit' || localStorage.getItem('event') == null)) {

            this.disbaledBtn = false;
            this.editMode = true;
            this.updateMode = true;
            var formDataVal =  this.common.getFormData();
      this.myFormVal = this.common.getFormData();
      console.log("Formdata:::::::::::", JSON.stringify(formDataVal));
      this.createQuoteForm
      .get('jobAddress')
      .get('firstName')
      .setValue(formDataVal?.jobAddress?.firstName);
      if(formDataVal?.jobAddress?.jobLocation){
        this.createQuoteForm
        .get('jobAddress')
        .get('jobLocation')
        .setValue(formDataVal?.jobAddress?.jobLocation);
      }
      else{
        this.createQuoteForm
        .get('jobAddress')
        .get('jobLocation')
        .setValue(formDataVal?.jobAddress?.formattedAddress);
      }
      this.createQuoteForm
      .get('notes')
      .setValue(formDataVal?.notes);
      this.createQuoteForm
        .get('consumerAddress')
        .get('firstName')
        .setValue(formDataVal?.consumerAddress?.firstName);
      this.createQuoteForm
      .get('consumerAddress')
      .get('phone')
      .setValue(formDataVal?.consumerAddress?.phone);
      this.createQuoteForm
      .get('consumerAddress')
      .get('email')
      .setValue(formDataVal?.consumerAddress?.email);
      if(formDataVal?.consumerAddress?.jobLocation){
        this.createQuoteForm
        .get('consumerAddress')
        .get('jobLocation')
        .setValue(formDataVal?.consumerAddress?.jobLocation);
      }
      else{
        this.createQuoteForm
        .get('consumerAddress')
        .get('jobLocation')
        .setValue(formDataVal?.consumerAddress?.formattedAddress);
      }
      // this.createQuoteForm
      // .get('scopeOfWork')
      // .setValue(this.formData?.scopeOfWork);
      
      this.scopeOfWorkVal = formDataVal?.scopeOfWork;
      this.quoteCode = formDataVal.code;
      this.subscription.add(this.jobDetailService.getJobDetials(this.quoteCode).subscribe (res => {
        console.log("Price console:", JSON.stringify(res));
        this.totalQuotePrice = res?.totalPrice?.formattedValue;
      }))
          }
          
          else{
            // alert('Megha')
            var formDataVal =  this.common.getFormData();
      this.myFormVal = this.common.getFormData();
      // console.log("Formdata valueee:", JSON.stringify(formDataVal));
      this.createQuoteForm
      .get('jobAddress')
      .get('firstName')
      .setValue(formDataVal?.jobAddress?.firstName);
      this.createQuoteForm
        .get('jobAddress')
        .get('jobLocation')
        .setValue(formDataVal?.jobAddress?.jobLocation);
      this.createQuoteForm
      .get('notes')
      .setValue(formDataVal?.notes);
      this.createQuoteForm
        .get('consumerAddress')
        .get('firstName')
        .setValue(formDataVal?.consumerAddress?.firstName);
      this.createQuoteForm
      .get('consumerAddress')
      .get('phone')
      .setValue(formDataVal?.consumerAddress?.phone);
      this.createQuoteForm
      .get('consumerAddress')
      .get('email')
      .setValue(formDataVal?.consumerAddress?.email);
      this.createQuoteForm
      .get('consumerAddress')
      .get('jobLocation')
      .setValue(formDataVal?.consumerAddress?.jobLocation);
      // this.createQuoteForm
      // .get('scopeOfWork')
      // .setValue(this.formData?.scopeOfWork);
      
      this.scopeOfWorkVal = formDataVal?.scopeOfWork;
      // console.log("Create:",this.createQuoteForm)
          }
        })
      );
    }
    else if (this.prev.includes('customerQuotes')){
      this.createQuoteForm.reset();
    }
    
   else if(this.prev.includes('quoteDetails') || this.prev.includes('quoteReview')){
    // alert(this.page)
    this.placeholderCustom = this.quoteConstants.addressPlaceholder;
      this.subscription.add(
        this.QuotesService.checkOpenModalFrom.subscribe((res) => {
          if (res === 'edit') {
            // alert("Hello")
            this.disbaledBtn = false;
            this.subscription.add(
              this.jobDetailService.getDetails.subscribe((res) => {
                this.quoteDetailData = res;
                this.editMode = true;
                this.updateMode = true;
                if (this.quoteDetailData) {
                  this.setEditAddress =
                    this.quoteDetailData?.jobAddress?.formattedAddress?.trim();
                  this.setEditCustomerAddress =
                    this.quoteDetailData?.consumerAddress?.formattedAddress?.trim();
                  this.createQuoteForm
                  .get('jobAddress')
                  .get('jobLocation')
                  .setValue(this.quoteDetailData?.jobAddress?.formattedAddress);
                  this.createQuoteForm
                    .get('jobAddress')
                    .get('firstName')
                    .setValue(this.quoteDetailData?.jobAddress?.firstName);
                  this.createQuoteForm
                    .get('consumerAddress')
                    .get('firstName')
                    .setValue(this.quoteDetailData?.consumerAddress?.firstName);
                  this.createQuoteForm
                    .get('consumerAddress')
                    .get('phone')
                    .setValue(this.quoteDetailData?.consumerAddress?.phone);
                  this.createQuoteForm
                    .get('consumerAddress')
                    .get('email')
                    .setValue(this.quoteDetailData?.consumerAddress?.email);
                  this.createQuoteForm
                  .get('consumerAddress')
                  .get('jobLocation')
                  .setValue(this.quoteDetailData?.consumerAddress?.formattedAddress);
                  this.createQuoteForm
                    .get('notes')
                    .setValue(this.quoteDetailData?.notes);
                  this.scopeOfWorkVal = this.quoteDetailData?.scopeOfWork
                    ? this.quoteDetailData.scopeOfWork
                    : '';
                  
                }
              })
            );
          }
          else{
          var formDataVal =  this.common.getFormData();
      this.myFormVal = this.common.getFormData();
      // console.log("Formdata:", JSON.stringify(formDataVal));
      this.createQuoteForm
      .get('jobAddress')
      .get('firstName')
      .setValue(formDataVal?.jobAddress?.firstName);
      this.createQuoteForm
        .get('jobAddress')
        .get('jobLocation')
        .setValue(formDataVal?.jobAddress?.jobLocation);
      this.createQuoteForm
      .get('notes')
      .setValue(formDataVal?.notes);
      this.createQuoteForm
        .get('consumerAddress')
        .get('firstName')
        .setValue(formDataVal?.consumerAddress?.firstName);
      this.createQuoteForm
      .get('consumerAddress')
      .get('phone')
      .setValue(formDataVal?.consumerAddress?.phone);
      this.createQuoteForm
      .get('consumerAddress')
      .get('email')
      .setValue(formDataVal?.consumerAddress?.email);
      this.createQuoteForm
      .get('consumerAddress')
      .get('jobLocation')
      .setValue(formDataVal?.consumerAddress?.jobLocation);
      // this.createQuoteForm
      // .get('scopeOfWork')
      // .setValue(this.formData?.scopeOfWork);
      
      this.scopeOfWorkVal = formDataVal?.scopeOfWork;
      // console.log("Create:",this.createQuoteForm)
          }
        })
      );
    // }
   }
   else{
    // alert(this.page)
    this.createQuoteForm.reset();
   }
  
  }
  inputFieldJobaddress(event, address) {
    this.adrressEditmode = false;
    if (address == 'jobAddress') {
      this.jobadrressError = true;
    }
    if (address == 'customerAddress' && event.length != '') {
      this.customeradrressError = true;
    }
  }
  getAdressName(event, addressName) {
    this.adrressEditmode = true;
    if (event.target.value.includes(',')) {
      var address: string[] = event.target.value
        .split(',')
        .map((value: string) => value.trim());
      if (addressName == 'jobAddress') {
        this.jobAddressLine1 = address[0] ? address[0] : '';
        this.jobAddressLine2 = address[1] ? address[1] : '';
        this.jobAddressTown = address[2] ? address[2] : '';
        this.jobAddressPostalCode = address[3] ? address[3] : '';
        this.disbaledBtn = false;
        this.jobadrressError = false;
      }
      if (addressName == 'customerAddress') {
        this.customeradrressError = false;
        this.customerAddressLine1 = address[0] ? address[0] : '';
        this.customerAddressLine2 = address[1] ? address[1] : '';
        this.customerAddressTown = address[2] ? address[2] : '';
        this.customerAddressPostalCode = address[3] ? address[3] : '';
      }
    } else {
      var address: string[] = event.target.value;
      if (addressName == 'jobAddress') {
        this.jobAddressLine1 = address;
        this.jobAddressLine2 = '';
        this.jobAddressTown = '';
        this.jobAddressPostalCode = '';
        this.disbaledBtn = false;
        this.jobadrressError = false;
      }
      if (addressName == 'customerAddress') {
        this.customeradrressError = false;
        this.customerAddressLine1 = address;
        this.customerAddressLine2 = '';
        this.customerAddressTown = '';
        this.customerAddressPostalCode = '';
      }
    }
  }

  clearSearchField(addressName) {
    this.adrressEditmode = false;
    if (addressName == 'jobAddress') {
      this.disbaledBtn = true;
      this.jobAddressLine1 = '';
      this.jobAddressLine2 = '';
      this.jobAddressPostalCode = '';
      this.jobAddressTown = '';
      this.jobadrressError = true;
    }
    if (addressName == 'customerAddress') {
      this.customerAddressLine1 = '';
      this.customerAddressLine2 = '';
      this.customerAddressPostalCode = '';
      this.customerAddressTown = '';
      this.customeradrressError = false;
      this.adrressEditmode = true;
    }
  }

  openModalCancelPopup() {
    this.jobDetailService.setDetailApiData.next(false);
    this.router.navigate(['/customerQuotes'])
  }
  getUpdateQuotes(eventName, jobName) {
    if (eventName === 'edit') {
      this.shareEvents.notificationInfo('Changes have been saved');
      (
        document.querySelector('cx-global-message') as HTMLElement
      ).style.display = 'block';
      this.jobDetailService.setDetailApiData.next(true);
    } else {
      (
        document.querySelector('cx-global-message') as HTMLElement
      ).style.display = 'block';
      this.shareEvents.notificationInfo(
        'Quote for' + ' ' + "'" + jobName + "'" + ' ' + 'quote has been created'
      );
      this.QuotesService.getLatestQuotes.next(true);
    }
    setTimeout(() => {
      (
        document.querySelector('cx-global-message') as HTMLElement
      ).style.display = 'none';
    }, 3000);
  }

  onSubmit(eventName) {
    // alert(eventName)
    this.quoteHeaderCode = localStorage.getItem("quoteHeaderCode");
    localStorage.setItem("event", eventName);
    // console.log("Create:", this.quoteHeaderCode)
    if (eventName == 'edit') {
      var setEditAddress: string[] = this.setEditAddress?.split(',')?.map((value: string) => value.trim());
      var setEditCustomerAddress: string[] = this.setEditCustomerAddress?.split(',')?.map((value: string) => value.trim());
      var jobAddressName =
        this.setEditAddress != undefined ? setEditAddress : '';
      var customerAddressName =
        this.setEditCustomerAddress != undefined ? setEditCustomerAddress : '';
    } 
    else if (
      this.customerAddressLine1 === undefined &&
      this.customerAddressLine2 === undefined &&
      customerAddressName === undefined
    ) {
      this.customerAddressLine1 = '';
      this.customerAddressLine2 = '';
      this.customerAddressPostalCode = '';
      this.customerAddressTown = '';
    }
      if(this.prev.includes('quoteMaterials') || this.prev.includes('quoteCosts') ){
        this.createQuoteForm
      .get('jobAddress')
      .get('firstName').value;
      this.createQuoteForm
        .get('jobAddress')
        .get('jobLocation').value;
      this.createQuoteForm
      .get('notes').value
      this.createQuoteForm
        .get('consumerAddress')
        .get('firstName').value;
      this.createQuoteForm
      .get('consumerAddress')
      .get('phone').value;
      this.createQuoteForm
      .get('consumerAddress')
      .get('email').value
      this.createQuoteForm
      .get('consumerAddress')
      .get('jobLocation').value
      var formData = this.createQuoteForm.getRawValue();
      
        formData.jobAddress.line1 = this.myFormVal.jobAddress.line1;
        formData.jobAddress.line2 = this.myFormVal.jobAddress.line2;
        formData.jobAddress.town = this.myFormVal.jobAddress.town;
        formData.jobAddress.postalCode = this.myFormVal.jobAddress.postalCode;
        formData.consumerAddress.line1 =
        this.customerAddressLine1 != undefined
          ? this.customerAddressLine1
          : customerAddressName[0];
      formData.consumerAddress.line2 =
        this.customerAddressLine2 != undefined
          ? this.customerAddressLine2
          : customerAddressName[1];
      formData.consumerAddress.town =
        this.customerAddressTown != undefined
          ? this.customerAddressTown
          : customerAddressName[2];
      formData.consumerAddress.postalCode =
        this.customerAddressPostalCode != undefined
          ? this.customerAddressPostalCode
          : customerAddressName[3];
        formData.estimateFlag = this.myFormVal.estimateFlag;
        formData.channel = this.myFormVal.channel;
        formData.termsAndConditions = this.myFormVal.termsAndConditions;
        formData.scopeOfWork = this.scopeOfWorkVal;
        

        // console.log("Form Data Material:", JSON.stringify(formData))
      }
      else{
        var formData = this.createQuoteForm.getRawValue();
        formData.jobAddress.line1 =
      this.jobAddressLine1 != undefined
        ? this.jobAddressLine1
        : jobAddressName[0];
    formData.jobAddress.line2 =
      this.jobAddressLine2 != undefined
        ? this.jobAddressLine2
        : jobAddressName[1];
    formData.jobAddress.town =
      this.jobAddressTown != undefined
        ? this.jobAddressTown
        : jobAddressName[2];
    formData.jobAddress.postalCode =
      this.jobAddressPostalCode != undefined
        ? this.jobAddressPostalCode
        : jobAddressName[3];
    formData.consumerAddress.line1 =
      this.customerAddressLine1 != undefined
        ? this.customerAddressLine1
        : customerAddressName[0];
    formData.consumerAddress.line2 =
      this.customerAddressLine2 != undefined
        ? this.customerAddressLine2
        : customerAddressName[1];
    formData.consumerAddress.town =
      this.customerAddressTown != undefined
        ? this.customerAddressTown
        : customerAddressName[2];
    formData.consumerAddress.postalCode =
      this.customerAddressPostalCode != undefined
        ? this.customerAddressPostalCode
        : customerAddressName[3];
    formData.estimateFlag = 'false';
    formData.channel = 'Trade Portal';
    formData.termsAndConditions = '';
    formData.scopeOfWork = this.scopeOfWorkVal;
      }
      
    if (eventName === 'create') {
      // alert("event create")
      formData.code = this.quoteHeaderCode;
      formData.event = 'create'
      localStorage.setItem("breadEvent", formData.event)
      this.disbaledBtn = true;
      if (this.jobAddressLine1 != '') {       
        this.disbaledBtn = false;
        this.common.setFormData(formData)
        //  console.log(" create formdata",JSON.stringify(formData));
        sessionStorage.setItem('jobName',formData.jobAddress.firstName);
        sessionStorage.setItem('jobCode',this.quoteHeaderCode);
        this.common.setPage('Create-customer-Quote');
        this.router.navigate(['/quoteMaterials', this.quoteHeaderCode ])
      }
    } 
    else if (eventName === 'edit') {
      if(this.quoteDetailData){
        formData.code = this.quoteDetailData.code;
      }
      else{
        formData.code = this.quoteCode;
      }
      formData.event = 'edit';
      localStorage.setItem("breadEvent", formData.event)
      if (
        this.createQuoteForm.pristine == false ||
        (this.adrressEditmode && this.customeradrressError == false)
      ) {
        if (
          this.jobAddressLine1 != '') {
            this.disbaledBtn = false;
          this.common.setFormData(formData)
          // console.log("formData editttt::",JSON.stringify(formData));
          this.subscription.add(
            this.QuotesService.updateQuoteService(formData).subscribe(
              (responseData) => {
                this.getUpdateQuotes('edit', formData.jobAddress.firstName);
              this.common.setPage('Edit-customer-Quote');
              this.router.navigate(['/quoteDetails', formData.code ])

              },
              (error) => {}
            )
          );
        }
      } else {
        this.common.setFormData(formData)
        this.subscription.add(
          this.QuotesService.updateQuoteService(formData).subscribe(
            (responseData) => {
              this.getUpdateQuotes('edit', formData.jobAddress.firstName);
            this.common.setPage('Edit-customer-Quote');
            this.router.navigate(['/quoteDetails', formData.code ])

            },
            (error) => {}
          )
        );
      }
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}


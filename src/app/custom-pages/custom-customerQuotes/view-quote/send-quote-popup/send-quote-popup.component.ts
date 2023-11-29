import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { companyProfile, quoteConstants, sendToQuote } from 'src/app/core/constants/general';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';
import { RoutingService } from '@spartacus/core';
import { QuotesService } from 'src/app/core/service/quotes.service';
import { GtmService } from 'src/app/core/service/customerQuotes/gtm.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-send-quote-popup',
  templateUrl: './send-quote-popup.component.html',
  styleUrls: ['./send-quote-popup.component.scss']
})
export class SendQuotePopupComponent implements OnInit {
  @ViewChild('chipList') chipList: MatChipList;
  @ViewChild('chipListCCAddress') chipListCCAddress: MatChipList;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  quoteConstants = quoteConstants;
  sendToquoteConstants = sendToQuote;
  companyProfileConstants = companyProfile;
  quoteData: any;
  @Input() public jobDetails;
  @Input() public customerMailAddress;
  emailpattern=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  loader=true;
  loaderErrorState=true;
  niceJobDivShow=false;
  quoteId:any;
  jobName:string;
  showCcField=false;
  public sendQuoteFrom: FormGroup;
  invalidEmail=false;
  invalidCCEmail=false;
  fileList: any;
  private subscription = new Subscription();
  constructor(
    private modalService: NgbModal,
    private jobDetailService: JobDetailsService,
    public dataService:DataService,
    private fb: FormBuilder,
    private routingService: RoutingService,
    private quoteService: QuotesService,
    private gtmService: GtmService
  ) { 
    
  }
  ngOnInit(): void {
    if(this.customerMailAddress!=undefined && this.customerMailAddress!=''){
      this.data.toAddress.push(this.customerMailAddress);
    }
    this.sendQuoteFrom = this.fb.group({
      toAddress: this.fb.array(this.data.toAddress,[Validators.required]),
      ccAddress: this.fb.array(this.data.ccAddress),
      subject: new FormControl('Estimate/Quote '+ this.jobDetails.jobName,[Validators.required]),
      body:new FormControl(''),
    });
    this.quoteId=this.jobDetails.quoteId;
    this.jobName=this.jobDetails.jobName;
    this.generatePdfReport(this.quoteId);
    this.getPhotosFiles(this.quoteId);
  }

  showCC (){
    this.showCcField=true;
  }
  generatePdfReport(quoteId){
    this.loaderErrorState=true;
    this.loader=true;
    this.subscription.add(this.jobDetailService.generatePdf(quoteId).subscribe(() => {
      this.loaderErrorState=true;
      this.loader=false;
    },
     () => {
          this.loaderErrorState=false;
      }));
  }
  data = {
    toAddress: [],
    ccAddress:[]
  }
  initName(name: string): FormControl {
    return this.fb.control(name);
  }
  add(event: MatChipInputEvent, form: FormGroup,eventName): void {
    let value = event.value;
    const control = <FormArray>form.get('toAddress');
    const controlCcAdd = <FormArray>form.get('ccAddress');
    if (value) {
      let emailpattern=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if(!emailpattern.test(value) || value == null || value == '') {     
        if(eventName=="toAddress"){
          this.sendQuoteFrom.get('toAddress').setValidators([Validators.required,Validators.pattern(this.emailpattern)]);
          this.chipList.errorState = true;
          event.chipInput.inputElement.classList.add("check-email-invalid");
          this.invalidEmail=true;
        }
        else if(eventName=="ccAddress"){
          this.sendQuoteFrom.get('ccAddress').setValidators([Validators.pattern(this.emailpattern)]);
          this.chipListCCAddress.errorState = true;
          event.chipInput.inputElement.classList.add("check-email-invalid");
          this.invalidCCEmail=true;        
        }
      }
    else {
      eventName=="toAddress"?this.sendQuoteFrom.controls['toAddress'].clearValidators():this.sendQuoteFrom.controls['ccAddress'].clearValidators();
      event.chipInput.inputElement.classList.remove("check-email-invalid");
    }
    eventName=="toAddress"?control.push(this.initName(value.trim())):controlCcAdd.push(this.initName(value.trim()));
    
    }
    // Clear the input value
    event.chipInput!.clear();
  } 
  remove(form, index,last,eventName) {
    if(eventName=="toAddress"){
      form.get('toAddress').removeAt(index);
      if(index == 0){
        this.invalidEmail=false;   
        if(form.get('toAddress').value.length == 0){
          this.sendQuoteFrom.get('toAddress').setErrors({'incorrect': true});
          this.chipList.errorState=true;
        }   
      }
      else if(document.querySelector(".toEmailAddress .check-email-invalid") && last){
        this.sendQuoteFrom.controls['toAddress'].clearValidators();
        this.sendQuoteFrom.get('toAddress').setErrors(null);
        this.chipList.errorState=false;      
        this.invalidEmail=false;
        document.querySelector(".toEmailAddress .mat-input-element").classList.remove("check-email-invalid");
      }
    }
    else if(eventName=="ccAddress") {
      form.get('ccAddress').removeAt(index);
      if(document.querySelector(".ccEmailAddress .check-email-invalid") && last){
        this.sendQuoteFrom.controls['ccAddress'].clearValidators();
        this.sendQuoteFrom.get('ccAddress').setErrors(null);
        this.chipListCCAddress.errorState=false;      
        this.invalidCCEmail=false;
        document.querySelector(".ccEmailAddress .mat-input-element").classList.remove("check-email-invalid");
      }
    }
  }  
  getPhotosFiles(quoteId) {
    // this.subscription.add(this.quoteService.getUploadedFileToQuote(quoteId).subscribe((res:any)=>{
    //  if(res.quoteMedia != undefined) {
    //    this.fileList = res.quoteMedia;
    //  }
    // }));
  }
  onSubmit(){
    let imageCount = 0;
    let docsCount = 0;
    let data = {
      "toAddress":this.sendQuoteFrom.value.toAddress.toString().replace(/,/g, ';'),
      "ccAddress":this.sendQuoteFrom.value.ccAddress.toString().replace(/,/g, ';'),
      "subject":this.sendQuoteFrom.value.subject,
      "body":this.sendQuoteFrom.value.body
    }
    if(this.fileList != undefined) {
    this.fileList.forEach(ele => {
      if(ele.mediaSelected == 'true'){
        if(ele.mime.startsWith('image/')) {
          imageCount += 1;
        } else {
          docsCount += 1;
        }
      }
    })
  }
    this.quoteData.docsCount = docsCount;
    this.quoteData.imageCount = imageCount;
    this.subscription.add(this.jobDetailService.generateEmail(this.quoteId,data).subscribe(() => {
    this.gtmService.trackSendToCustomer(this.quoteData, 2);
    this.niceJobDivShow=true;
    }));
  }
  cancelModalPopup(){
    this.modalService.dismissAll();
  }
  cancelSuccessPopup(){
    this.modalService.dismissAll();
//    this.routingService.go('/customerQuotes');
  }

  redirectToQuotePage() {
    //this.quoteService.currentTab = 'NOTSENT';
    this.modalService.dismissAll();
    this.routingService.go('/customerQuotes');
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

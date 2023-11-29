import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { LabourCostsService } from 'src/app/core/service/customerQuotes/labourCosts.service';
import { environment } from "src/environments/environment";
import { quoteConstants, viewQuote } from 'src/app/core/constants/general'
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
import { QuoteDisplayOption } from '../../../core/model/display-option.model';
import { IncludeMediaInfoPopupComponent } from './include-mediaInfo-popup/include-mediaInfo-popup.component';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { GlobalMessageType } from '@spartacus/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject } from 'rxjs';
import { SendQuotePopupComponent } from './send-quote-popup/send-quote-popup.component';
import { CommonUtils } from 'src/app/core/utils/utils';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
@Component({
  selector: 'app-view-quote',
  templateUrl: './view-quote.component.html',
  styleUrls: ['./view-quote.component.scss']
})
export class ViewQuoteComponent implements OnInit, OnDestroy {
  getQuotedId: any;
  isMobile: boolean = false;
  quoteData: any;
  companyData: any;
  totalPrice: any;
  costData = [];
  labourData = [];
  materialData: any;
  productType = 'view';
  environment = environment;
  viewQuote = viewQuote;
  private subscription = new Subscription();
  editCompanyProfilebtn = true;
  companyProfileData: any;
  quoteDisplayOption: QuoteDisplayOption;
  totalRetailPrice = 0;
  retailPrice = {
    'totalRetailPrice': 0,
    sobTotalRetailPrice: []
  };
  isLoading$ = new BehaviorSubject<boolean>(false);

  @ViewChild('contentModel', { static: false }) private content;
  form: FormGroup;
  emailpattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  modalRef: any;
  noCompanyData: any;
  customerMailAddress: string;
  quoteStatus: string;
  quoteConstants = quoteConstants;
  totalMaterialCount = 0;
  imageCount = 0;
  fileCount = 0;
  attachmentList = [];
  jobDetails: any;
  quoteHeaderCode: any;
  otherPrice: any = 0;
  labourPrice: any = 0;
  totalWithoutGST: any;
  isDataLoad: boolean = false;
  constructor(
    private ac: ActivatedRoute,
    private jobDetailService: JobDetailsService,
    public dataService: DataService,
    private labourCostService: LabourCostsService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public quotesService: QuotesService,
    private shareEvents: ShareEvents,
    public router: Router,
    public datepipe: DatePipe,
    public commonService: CommonService
  ) { }

  openModal() {
    this.jobDetailService.getCreateNewQuote().subscribe(res => {
      // console.log("ssssssss")
      this.quoteHeaderCode = res;
      // console.log("Quotes:", this.quoteHeaderCode)
      localStorage.setItem('quoteHeaderCode', this.quoteHeaderCode);
    })
    this.router.navigate(['/create-new-quotes-popup'])
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.form = this.fb.group({
      fileSource: new FormControl(''),
      companyAddress: this.fb.group({
        phone: new FormControl(''),
        email: new FormControl('', [Validators.pattern(this.emailpattern)]),
        address: new FormControl(''),
        companyName: new FormControl(''),
        country: {
          isocode: "NZ"
        },
      }),
      termsAndConditions: new FormControl(''),
      paymentTerms: new FormControl(''),
    });
    this.getQuotedId = this.ac.snapshot.params['id'];
    this.getJobDetail(this.getQuotedId);
    this.getCompanyDetails(this.getQuotedId);
    this.retrieveProducts(this.getQuotedId);
    this.getOtherCost();
    this.getLabourCost();
    this.jobDetailService.setTotalValue.next(null);
    //this.uploadMediaCheck();
    this.displayOptions(this.getQuotedId);
  }
  companySettingsSubmit() {
    this.getCompanyDetails(this.getQuotedId);
  }
  getCompanyDetails(quoteId) {
    this.subscription.add(this.jobDetailService.getCompanyDetails(quoteId).subscribe((data: any) => {
      if (data != null) {
        this.companyData = data;
      }
    }));
  }
  validateCompanyPhone(c: FormControl) {
    let phpattern = /^[+]?(64|0)2\d{1} ?\d{3,4} ?\d{3,4}$/;
    let localphpattern = /^(03|04|06|07|09) ?\d{3} ?\d{4}$/;
    let only11PhoneNumber = /^1?(\d{11})/;

    return (phpattern.test(c.value) || localphpattern.test(c.value) || only11PhoneNumber.test(c.value) || c.value == null || c.value == '') ? null : {
      validateInput: {
        valid: false
      }
    };
  }
  
  openCompanyDetailsModal(contentModel) {
    // this.commonService.show();
    this.isDataLoad = true;
    this.subscription.add(this.jobDetailService.getCompanyDetails(this.getQuotedId).subscribe(res => {
      if (res != '' && res != undefined) {
        this.editCompanyProfilebtn = false;
        this.companyProfileData = res;
        // if ((res.companyAddress.companyName == undefined || res.companyAddress.companyName == '') ||
        //   (res.companyAddress.email == undefined || res.companyAddress.email == '') ||
        //   (res.companyAddress.phone == undefined || res.companyAddress.phone == '') ||
        //   (res.companyAddress.formattedAddress == undefined || res.companyAddress.formattedAddress == '') ||
        //   (res.termsAndConditions == undefined || res.termsAndConditions == '') ||
        //   (res.paymentTerms == undefined || res.paymentTerms == '') ||
        //   (res['companyLogo'] == '' || res['companyLogo'] == undefined)
        // ) {
        //   this.noCompanyData = "no-result";
        //   this.modalRef = this.modalService.open(contentModel, {
        //     centered: true, keyboard: false,
        //     backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
        //   });
          
        // }
       
        this.modalRef = this.modalService.open(contentModel, {
          centered: true, keyboard: false,
          backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
        });
        this.isDataLoad = false;
      }
      
    },
      error => {
        if (error.status == 400) {
          this.editCompanyProfilebtn = true;
          this.noCompanyData = "no-result";
          this.modalRef = this.modalService.open(contentModel, {
            centered: true, keyboard: false,
            backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
          });
          this.isDataLoad = false;
        }
      }));
  }
  getJobDetail(quoteId) {
    this.subscription.add(this.jobDetailService.getJobDetials(quoteId).subscribe((data: any) => {
      if (data != null && data.jobAddress) {
        this.isLoading$.next(true);
        this.dataService.changeJobname({ quoteId: data.code, jobName: data.jobAddress.firstName })

        this.totalPrice = data.totalPriceWithTax;
        this.quoteData = data;
        console.log("Quote data:", JSON.stringify(this.quoteData))
        this.quoteData.creationTime = this.datepipe.transform(this.quoteData.creationTime, 'dd/MM/YYYY');
        console.log("Date:::", this.quoteData.creationTime)
        this.customerMailAddress = data.consumerAddress.email;
        this.quotesService.quoteStatus = data.status;

      }
    }));
  }

  getOtherCost() {
    this.subscription.add(this.labourCostService.fetchLabourOtherCosts(this.getQuotedId, 'OtherCosts').subscribe(res => {
      console.log("Other cost:", JSON.stringify(res))
      // console.log("cost type:",JSON.stringify(res.otherCostList.costType) )
     for(var i =0; i< res.otherCostList.length; i++){
      console.log("cost type:",JSON.stringify(res.otherCostList[i].costType) )
      if(res.otherCostList[i].costType == 'OtherCosts'){
        for(var j=0; j<res.otherCostList[i].entries.length; j++){
          var price = res.otherCostList[i].entries[j].price;
          this.otherPrice = this.otherPrice + price;
        }
        
        // console.log(this.otherPrice)
        // console.log("Dtaa::", res.otherCostList[i].costType + '--->' + JSON.stringify(res.otherCostList[i].entries))
      }
     }
    
      return this.costData = res;
    }));
  }

  getLabourCost() {
    this.subscription.add(this.labourCostService.fetchLabourOtherCosts(this.getQuotedId, 'Labour').subscribe(res => {
      console.log("Labour cost:", JSON.stringify(res))
      // console.log("cost type:",JSON.stringify(res.otherCostList.costType) )
     for(var i =0; i< res.otherCostList.length; i++){
      // console.log("cost type:",JSON.stringify(res.otherCostList[i].costType) )
      if(res.otherCostList[i].costType == 'Labour'){
        for(var j=0; j<res.otherCostList[i].entries.length; j++){
          var price = res.otherCostList[i].entries[j].price;
          this.labourPrice = this.labourPrice + price;
        }
        
        console.log(this.labourPrice)
        // console.log("Dtaa::", res.otherCostList[i].costType + '--->' + JSON.stringify(res.otherCostList[i].entries))
      }
     }
    
      return this.labourData = res;
    }));
  }

  retrieveProducts(quoteId) {
    this.subscription.add(this.jobDetailService.getProductsForReviewPage(quoteId).subscribe(response => {
      if (response == undefined || Object.keys(response).length === 0) {
        this.materialData = 0;
      }
      if (response != null && response && response.pmQuoteSobList != undefined) {
        this.materialData = response.pmQuoteSobList;
        this.materialData.forEach(element => {
          let sobRetailPrice = 0;
          element.entries.forEach(data => {
            sobRetailPrice += (Number(data.retailPrice.value) * (data.product.timberProductFlag=='true' &&
              data.product.sellOrderMultiple >
              0?data.totalSize:data.decimalQty));
            this.retailPrice['totalRetailPrice']+= (Number(data.retailPrice.value) * (data.product.timberProductFlag=='true' &&
              data.product.sellOrderMultiple >
              0?data.totalSize:data.decimalQty));
          });
          let sobObj = {
            'name': element.name,
            'retailPrice': sobRetailPrice
          }
          this.retailPrice.sobTotalRetailPrice.push(sobObj);
        });
      }
    }));
  }

  displayOptions(quoteId) {
    this.subscription.add(this.quotesService.getDisplayOptions(quoteId).subscribe(response => {
      this.quoteDisplayOption = response;
    }));
  }
  uploadMediaCheck() {
    this.attachmentList = [];
    this.subscription.add(this.quotesService.getUploadedFileToQuote(this.getQuotedId).subscribe((res: any) => {
      if (res.quoteMedia != undefined && res.quoteMedia.length == 0) {
        this.imageCount = 0;
        this.fileCount = 0;
      }
      else {
        res.quoteMedia.forEach(media => {
          if(media.mediaSelected.includes(true)){
          this.attachmentList.push(media);
            if (media.mime.match(/image/g)) {
              this.imageCount = 1;
            }
            else {
              this.fileCount = 1;
            }
          }
        });
      }
    }));
  }
  updateDisplayApi(){
    this.subscription.add(this.quotesService.updateDisplayOptions(this.getQuotedId, this.quoteDisplayOption).subscribe(_response => {
      // do nothing
    }, () => {
      document.querySelector("cx-global-message").setAttribute('style','display:block');
      this.shareEvents.warningInfo(this.viewQuote.displayOptionsError);
      setTimeout(() => {
        document.querySelector("cx-global-message").setAttribute('style','display:none');
        this.shareEvents.clearMessage(GlobalMessageType.MSG_TYPE_WARNING);
      }, 3000);
    }));
  }
  updateDisplayEvent(toggleCheck,mediaType) {
    if (mediaType == 'images' || mediaType == 'files') {
      if (this.imageCount == 0 && this.fileCount == 0) {
        if(toggleCheck.checked===true){
        this.modalRef = this.modalService.open(IncludeMediaInfoPopupComponent, {
          centered: true, keyboard: false,
          backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
        });
        this.modalRef.componentInstance.quoteId = this.getQuotedId;
        this.modalRef.componentInstance.title = mediaType;
        this.modalRef.componentInstance.resetToggle.subscribe((result) => {
          if(result=='cancel'){
            toggleCheck.source.toggle();
          }
        });
        }
        else {
          this.updateDisplayApi();
        }
      }
      else if ((mediaType == 'images' && this.imageCount == 1) || (mediaType == 'files' && this.fileCount == 1)) {
        this.updateDisplayApi();
      }
      else {
        if(toggleCheck.checked===true){
        this.modalRef = this.modalService.open(IncludeMediaInfoPopupComponent, {
          centered: true, keyboard: false,
          backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
        });
        this.modalRef.componentInstance.quoteId = this.getQuotedId;
        this.modalRef.componentInstance.title = mediaType;
        this.modalRef.componentInstance.resetToggle.subscribe((result) => {
          if(result=='cancel'){
            toggleCheck.source.toggle();
          }
        });
        }
        else{
          this.updateDisplayApi();
        }
      }
    }
    else {
      this.subscription.add(this.quotesService.updateDisplayOptions(this.getQuotedId, this.quoteDisplayOption).subscribe(_response => {
        // do nothing
      }, () => {
        document.querySelector("cx-global-message").setAttribute('style','display:block');
        this.shareEvents.warningInfo(this.viewQuote.displayOptionsError);
        setTimeout(() => {
          document.querySelector("cx-global-message").setAttribute('style','display:none');
          this.shareEvents.clearMessage(GlobalMessageType.MSG_TYPE_WARNING);
        }, 3000);
      }));
    }
  }
  updateDisplayOption(event: MatSlideToggleChange,mediaType) {
    let toggleEvent=event;
    if (this.quotesService.quoteStatus == "PENDING") {
      this.subscription.add(this.jobDetailService.updateQuoteStatus(this.getQuotedId, 'notsent').subscribe(() => {
        this.quotesService.quoteStatus = "NOTSENT";
        this.updateDisplayEvent(toggleEvent,mediaType);
      }));
    }
    else {
      this.updateDisplayEvent(toggleEvent,mediaType);
    }
  }

  parseFloat(num) {
    return parseFloat(num);
  }
  sendtQuoteModal() {
    this.subscription.add(this.dataService.updateJobName.subscribe(response => {
      if (response != undefined && response != null) {
        this.jobDetails = response;
      }
    }));
 //   this.gtmService.trackSendToCustomer(this.quoteData, 1);
    this.modalRef = this.modalService.open(SendQuotePopupComponent, {
      centered: true, keyboard: false,
      backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
    });
    this.modalRef.componentInstance.jobDetails = this.jobDetails;
    this.modalRef.componentInstance.customerMailAddress = this.customerMailAddress;
    this.modalRef.componentInstance.quoteData = this.quoteData;
  }
}

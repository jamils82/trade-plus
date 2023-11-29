import { filter } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Subscription } from 'rxjs';
import { quoteConstants } from 'src/app/core/constants/general';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
import { CreateNewQuotesPopupComponent } from './create-new-quotes-popup/create-new-quotes-popup.component';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { ProductDeletePopupComponent } from './materials/custom-product-list-item/product-delete-popup/product-delete-popup.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPopupComponent } from 'src/app/custom-pages/custom-customerQuotes/confirmation-popup/confirmation-popup.component';
import { GtmService } from 'src/app/core/service/customerQuotes/gtm.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { CommonUtils } from 'src/app/core/utils/utils';
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  items: any = [];
  modalRef: any;
  quoteConstants = quoteConstants;
  Quote: any;
  QuoteListLatest: any;
  private subscription = new Subscription();
  topBannerLabel = quoteConstants.topstripeLabel;
  responseResult = false;
  editCompanyProfilebtn = true;
  companyProfileData: any;
  pageSize: number = 12;
  @ViewChild('contentModel', { static: false }) private content;
  form: FormGroup;
  // phpattern = /^((03|04|06|07|09) ?\d{3} ?\d{4})|([+]?(64|0)2\d{1} ?\d{3,4} ?\d{3,4})$/;
  emailpattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  noCompanyData: any;
  isDataLoad: boolean = true;
  paginationModel = {
    currentPage: 0,
    pageSize: this.pageSize,
    sort: '',
    totalPages: 5,
    totalResults: 10,
  };
  currentPage: number = 0;
  itemsListNew = [];
  showPageNum: boolean;
  tabStatus: string;
  quoteHeaderCode: any;
  currentUrl: string;
  previousUrl: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public QuotesService: QuotesService,
    public dataService: DataService,
    private jobDetailService: JobDetailsService,
    private gtmService: GtmService,
    public router: Router,
    public quotesService: QuotesService,
    public common: CommonService
  ) // public activeModal: NgbActiveModal

  {}

  openModal() {
    // this.modalRef = this.modalService.open(CreateNewQuotesPopupComponent, {
    //   centered: true,
    //   keyboard: false,
    //   backdrop: 'static',
    //   windowClass: 'createQuotePopup',
    //   size: 'lg',
    // });
    // this.QuotesService.checkOpenModalFrom.next('create');
    this.jobDetailService.getCreateNewQuote().subscribe(res => {
      // console.log("ssssssss")
      this.quoteHeaderCode = res;
      // console.log("Quotes:", this.quoteHeaderCode)
      localStorage.setItem('quoteHeaderCode', this.quoteHeaderCode);
    })
    this.router.navigate(['/create-new-quotes-popup'])
  }
  ngOnInit(): void {
    localStorage.removeItem('event')
    // this.common.setPage('Customer')
    this.currentUrl = this.router.url;
    this.isMobile = CommonUtils.isMobile();
    this.previousUrl = null;
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;

      localStorage.setItem("prev", this.previousUrl)
      
        })  
    localStorage.removeItem('checkDuplicate');
    this.jobDetailService.enableReview.next(false);
    this.form = this.fb.group({
      fileSource: new FormControl(''),
      companyAddress: this.fb.group({
        phone: new FormControl('', [this.validateCompanyPhone]),
        email: new FormControl('', [Validators.pattern(this.emailpattern)]),
        companyName: new FormControl(''),
        //file: new FormControl(''),
        country: {
          isocode: 'NZ',
        },
      }),
      termsAndConditions: new FormControl(''),
      paymentTerms: new FormControl(''),
    });
   
    this.getQuotesList(this.QuotesService.currentTab);
    this.companyProfile();
    this.subscription.add(
      this.QuotesService.getLatestQuotes.subscribe((res) => {
        // console.log("RESS:", JSON.stringify(res))
        this.responseResult = false;
        if (res) {
          window.scrollTo(0, 0);
          this.getQuotesList('NOTSENT');
          this.companyProfile();
        }
      })
    );
    this.dataService.changeJobname({
      quoteId: '',
      jobName: this.topBannerLabel,
    });
  }

  companyProfile() {
    this.subscription.add(
      this.QuotesService.getCompanyProfileService().subscribe(
        (res) => {
          if (res != '' && res != undefined) {
            this.editCompanyProfilebtn = false;
            this.companyProfileData = res;
            if (
              (res.companyAddress.companyName == undefined ||
                res.companyAddress.companyName == '') &&
              (res.companyAddress.email == undefined ||
                res.companyAddress.email == '') &&
              (res.companyAddress.phone == undefined ||
                res.companyAddress.phone == '') &&
              (res.companyAddress.formattedAddress == undefined ||
                res.companyAddress.formattedAddress == '') &&
              (res.termsAndConditions == undefined ||
                res.termsAndConditions == '') &&
              (res.paymentTerms == undefined || res.paymentTerms == '') &&
              (res['companyLogo'] == '' || res['companyLogo'] == undefined)
            ) {
              this.editCompanyProfilebtn = true;
              this.noCompanyData = 'no-result';
            }
          }
        },
        (error) => {
          if (error.status == 400) {
            this.isDataLoad = false;
            this.editCompanyProfilebtn = true;
            this.noCompanyData = 'no-result';
          }
        }
      )
    );
  }
 
  validateCompanyPhone(c: FormControl) {
    let phpattern = /^[+]?(64|0)2\d{1} ?\d{3,4} ?\d{3,4}$/;
    let localphpattern = /^(03|04|06|07|09) ?\d{3} ?\d{4}$/;

    return phpattern.test(c.value) ||
      localphpattern.test(c.value) ||
      c.value == null ||
      c.value == ''
      ? null
      : {
          validateInput: {
            valid: false,
          },
        };
  }

  getQuotesList(status) {
    
    
   
    this.subscription.add(
      this.QuotesService.getdetails().subscribe((data: any) => {
        // console.log("Quote Data:", data.quotes.length)
        this.responseResult = true;
        if(data.quotes.length > 0){
          this.isDataLoad = true;
          for(var i=0; i<data.quotes.length; i++){
            // console.log("Job name:", data.quotes[i].code + '->' + data.quotes[i].jobName);
            if(data.quotes[i].jobName == undefined){
              this.quotesService.deleteQuoteService(data.quotes[i].code).subscribe(res => {
              //  localStorage.removeItem("quoteHeaderCode")
              })
            }
            else{
              this.Quote = data.quotes;
              this.pageWiseRecord(status);
              this.dataService.showPage = true;
              this.isDataLoad = false;
            }
          }
        }
        else{
          this.Quote = data.quotes;
          this.pageWiseRecord(status);
          this.dataService.showPage = true;
          this.isDataLoad = false;
        }
       
      })
    );
    
  }

  deleteQuote(quoteId, quoteName) {
    this.modalRef = this.modalService.open(ProductDeletePopupComponent, {
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'createQuotePopup',
      size: 'lg',
    });
    this.modalRef.componentInstance.product = '';
    this.modalRef.componentInstance.quoteName = quoteName;
    this.modalRef.componentInstance.quotesId = quoteId;
    this.modalRef.componentInstance.callFrom = 'delete-quote';
  }

  openCompanyDetailsModal(contentModel) {
    this.subscription.add(
      this.QuotesService.getCompanyProfileService().subscribe(
        (res) => {
          if (res != '' && res != undefined) {
            this.editCompanyProfilebtn = false;
            this.companyProfileData = res;
            if (
              (res.companyAddress.companyName == undefined ||
                res.companyAddress.companyName == '') &&
              (res.companyAddress.email == undefined ||
                res.companyAddress.email == '') &&
              (res.companyAddress.phone == undefined ||
                res.companyAddress.phone == '') &&
              (res.companyAddress.formattedAddress == undefined ||
                res.companyAddress.formattedAddress == '') &&
              (res.termsAndConditions == undefined ||
                res.termsAndConditions == '') &&
              (res.paymentTerms == undefined || res.paymentTerms == '') &&
              (res['companyLogo'] == '' || res['companyLogo'] == undefined)
            ) {
              this.noCompanyData = 'no-result';
              this.editCompanyProfilebtn = true;
            }
          }
          this.modalRef = this.modalService.open(contentModel, {
            centered: true,
            keyboard: false,
            backdrop: 'static',
            windowClass: 'createQuotePopup',
            size: 'lg',
          });
        },
        (error) => {
          if (error.status == 400) {
            this.editCompanyProfilebtn = true;
            this.modalRef = this.modalService.open(contentModel, {
              centered: true,
              keyboard: false,
              backdrop: 'static',
              windowClass: 'createQuotePopup',
              size: 'lg',
            });
            this.noCompanyData = 'no-result';
          }
        }
      )
    );
  }
  companySettingsSubmit() {
    this.editCompanyProfilebtn = false;
  }

  getQuoteListCount(status) {
    return this.Quote ? this.Quote.filter((i) => i.status == status).length: null;
  }

  changeQuoteStatus(quoteId, jobName, status) {
    // alert(status)
    let branchName = localStorage.getItem('branchName');
    this.modalRef = this.modalService.open(ConfirmationPopupComponent, {
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'createQuotePopup',
      size: 'lg',
    });
    let wonTitle =
      status == 'won' ? quoteConstants.wonTitle : quoteConstants.lostTitle;
    let description =
      status == 'won'
        ? quoteConstants.wonDescription
        : quoteConstants.lostDescription;
    this.modalRef.componentInstance.popupTitle = wonTitle + ' ' + jobName;
    this.modalRef.componentInstance.containerMessage = {
      description: description,
      branch: branchName,
    };
    this.modalRef.componentInstance.statusValue = status;
    this.modalRef.componentInstance.confirmPopup.subscribe((result) => {
      if (result == 'confirm') {
        this.jobDetailService
          .updateQuoteStatus(quoteId, status)
          .subscribe((res) => {
           this.QuotesService.currentTab = status.toUpperCase();
            this.getQuotesList(status.toUpperCase());
            if(status == 'won') {
              this.gtmService.trackWonStatus(quoteId);
            } else if(status == 'lost') {
              this.gtmService.trackLostQuoteStatus(quoteId);
            }
          });
      }
    });
  }
  editQuoteClick(quoteName, quoteCode) {
    // console.log("Quote Name:", quoteName)
    // console.log("Quote Code:", quoteCode)
    sessionStorage.setItem('jobName',quoteName);
    sessionStorage.setItem('jobCode',quoteCode);
  }

  pageChange(event, status) {
   
    this.currentPage = event;

    this.updatePaginationModel(status);

   //  this.itemsList = this.Quote;

     this.itemsListNew = this.pageWiseRecord(status)

    //  this.scrollTop();
  }

  updatePaginationModel(status?) {
    const totalrec = (this.Quote.filter(x => x.status == status)).length;
    
    this.paginationModel = {
      currentPage: this.currentPage,

      pageSize: this.pageSize,

      sort: '',

      totalPages: Math.ceil(totalrec / this.pageSize),

      totalResults: totalrec,
    };

    if (totalrec <= 10) {
      this.showPageNum = false;
    }
  }

  pageWiseRecord(status?, reset = false) {
    this.tabStatus = status;
    this.itemsListNew = [];
    

    const currentPage = reset ? 0 : this.paginationModel.currentPage;


    const startIndex = currentPage * this.pageSize;

    const endRec = startIndex + this.pageSize;

    const wholeData = this.Quote;

   
    const tabData = wholeData.filter((x) => x.status == status) || [];    
    
    this.paginationModel = {
      ...this.paginationModel, currentPage, totalResults: tabData.length, totalPages: Math.ceil(tabData.length / this.pageSize)
    }

    const endIndex = endRec < tabData.length ? endRec : tabData.length;

    let tempRec = [];
    //  let inProgress = this.Quote ? this.Quote.filter(x => x.status ==status) : 0;
    //  console.log(inProgress, "PRogress");

    if(startIndex < endIndex) {
      for (var i = startIndex; i < endIndex; i++) {
        tempRec.push(tabData[i]);
      }
    } else {
      tempRec = tabData;
    }

    this.itemsListNew = tempRec;

    return tempRec;
  }
  perPageChange(value) {
    this.pageSize = value
    this.currentPage = 0
    this.updatePaginationModel(this.tabStatus);
   this.pageWiseRecord(this.tabStatus, true)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.modalService.dismissAll();
    this.dataService.changeJobname({ quoteId: '', jobName: '' });
  }
}

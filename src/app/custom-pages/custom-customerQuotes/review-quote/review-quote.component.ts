import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/internal/Subscription';
import { jobDetailConstants, quoteConstants } from 'src/app/core/constants/general';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { LabourCostsService } from 'src/app/core/service/customerQuotes/labourCosts.service';
import { MaterialService } from 'src/app/core/service/customerQuotes/material.service';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
import { CreateNewQuotesPopupComponent } from '../create-new-quotes-popup/create-new-quotes-popup.component';
import { AddEditMarkupComponent } from '../materials/add-edit-markup/add-edit-markup.component';
import { QuoteStatusUpdatePopupComponent } from '../quote-status-update-popup/quote-status-update-popup.component';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
@Component({
  selector: 'app-review-quote',
  templateUrl: './review-quote.component.html',
  styleUrls: ['./review-quote.component.scss'],
  providers: [DatePipe]
})
export class ReviewQuoteComponent implements OnInit {
  quoteConstants = quoteConstants;
  labelData = jobDetailConstants;
  modalRef: any;
  jobDetails: any;
  today: number = Date.now();
  totalPrice: any;
  reviewTotalPrice: any = 0;
  productResultData: any;
  productSectionData: any ;
  getEntries: any;
  private subscription = new Subscription();
  rrpValue: any = 0;
  MaterialsLabel = jobDetailConstants;
  productType = 'review';
  productList: any[];
  addedProduct = 0;
  paginationData;
  sharedDatas: any;
  currentJobDetails: any;
  message: string;
  getQuotedId: any;
  labourCostData: any = 0;
  isLoading$ = new BehaviorSubject<boolean>(false);
  GST: number;

  constructor(
    private jobDetailService: JobDetailsService,
    private ac: ActivatedRoute,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    public quotesService: QuotesService,
    public dataService: DataService,
    private router: Router,
    private labourCostService: LabourCostsService,
    private materialService: MaterialService,
    public activeModal: NgbActiveModal,
    public common: CommonService
  ) {

  }

  ngOnInit(): void {
    this.jobDetailService.enableReview.next(false);
    this.getQuotedId = this.ac.snapshot.params['id'];
    this.materialService.loadMoreMaterials.next(0);
    this.retrieveProducts(this.getQuotedId);
    this.getLabourCost();
    this.getJobDetail();
    this.subscription.add(this.jobDetailService.setDetailApiData.subscribe(res => {
      if (res) {
        window.scrollTo(0, 0);
        this.getJobDetail();
      } else {
        window.scrollTo(0, 0);
      }
    }));
    this.jobDetailService.setTotalValue.next(null)
    this.subscription.add(this.jobDetailService.markupAdded.subscribe(res => {
      if (res)
        this.getJobDetail();
    }));
    this.currentJobDetails = this.dataService.currentJobDetails;
    this.jobDetailService.sendQuoteId.next(this.getQuotedId)
    this.dataService.currentQuoteId = this.getQuotedId;
    this.getJobDetail();
  }

  getLabourCost() {
    this.subscription.add(this.labourCostService.retrieveLabourOtherCosts(this.getQuotedId, 'Labour').subscribe(res => {
      res.otherCostList.forEach(element => {
        this.labourCostData += element.total.value;
        this.reviewTotalPrice += element.total.value;
      });
    }));
  }

  openModal() {
    this.getJobDetail();
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          // alert("Hello")
          this.subscription.add(this.jobDetailService.updateQuoteStatus(this.getQuotedId,'notsent').subscribe(() => {
            this.activeModal.close('close');  
            this.quotesService.quoteStatus = "NOTSENT"; 
            document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
            this.jobDetailService.getDetails.next(this.sharedDatas);
            // this.modalRef = this.modalService.open(CreateNewQuotesPopupComponent,{ centered: true,keyboard : false,
            // backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
            this.quotesService.checkOpenModalFrom.next('edit');
            this.router.navigate(['/create-new-quotes-popup']);
          }));
        }
      });
    }
    else {
    this.jobDetailService.getDetails.next(this.sharedDatas);
    // this.modalRef = this.modalService.open(CreateNewQuotesPopupComponent,{ centered: true,keyboard : false,
    // backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
    this.quotesService.checkOpenModalFrom.next('edit');
    this.router.navigate(['/create-new-quotes-popup']);
    }
  }
  getJobDetail() {
    let getQuotedId = this.ac.snapshot.params['id'];
    this.subscription.add(this.jobDetailService.getJobDetials(getQuotedId).subscribe((sharedData: any) => {
      if (sharedData != null && sharedData.jobAddress) {
        this.isLoading$.next(true);
        this.dataService.changeJobname({quoteId:sharedData.code, jobName: sharedData.jobAddress.firstName})
        this.totalPrice = sharedData.totalPriceWithTax;
        this.sharedDatas = sharedData;
        console.log("Share datas:", JSON.stringify(this.sharedDatas))
        this.GST = parseInt(this.sharedDatas?.appliedTaxPercent)
        console.log("GSTTTT:", this.GST)
        this.sharedDatas.creationTime = this.datepipe.transform(this.sharedDatas.creationTime, 'dd/MM/YYYY');
        this.reviewTotalPrice += this.sharedDatas?.markupPrice.value + this.sharedDatas?.materialPrice.value
        this.quotesService.quoteStatus = sharedData.status;
      }
    }));
  }
  retrieveProducts(quoteId) {
    this.productSectionData = [];
    this.productResultData = [];

    this.subscription.add(this.jobDetailService.getProductsForReviewPageEntries(quoteId).subscribe(response => {
      if (response != null && response ) {
        this.productResultData=response.entries;
        this.getEntries = response;
        console.log("Enteries:", JSON.stringify(this.getEntries))
        this.productResultData.forEach(ele => {
          //this.productResultData = this.productResultData.concat(ele.entries);
        });
        this.productResultData.forEach(ele => {
          this.rrpValue += (ele.product?.m2Price?.value * ele.quantity)
          this.reviewTotalPrice += ele.product?.m2Price?.value;
          
        })
       }
    }));
  }

  openMaterial(sobId) {
    // console.log("Share data:", JSON.stringify(this.sharedDatas ))
    if(this.quotesService.quoteStatus == 'PENDING'){
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          // alert("Hello")
          this.subscription.add(this.jobDetailService.updateQuoteStatus(this.getQuotedId,'notsent').subscribe(() => {
            this.activeModal.close('close');  
            this.quotesService.quoteStatus = "NOTSENT"; 
            document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
            this.jobDetailService.getDetails.next(this.sharedDatas);
            this.common.setFormData(this.sharedDatas);
            this.jobDetailService.enableReview.next(false);
            // this.modalRef = this.modalService.open(CreateNewQuotesPopupComponent,{ centered: true,keyboard : false,
            // backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
            this.quotesService.checkOpenModalFrom.next('edit');
            this.router.navigate(['/quoteMaterials/' + this.getQuotedId]);
          }));
        }
      });
    }
    else {
      this.quotesService.checkOpenModalFrom.next('edit');
      this.dataService.currentStageId = sobId;
      // alert(this.quotesService.quoteStatus)
      this.common.setFormData(this.sharedDatas);
      this.jobDetailService.enableReview.next(false);
      this.router.navigate(['/quoteMaterials/' + this.getQuotedId]);
    }
    
  }

  openLabourCost() {
    // alert(this.quotesService.quoteStatus)
    if(this.quotesService.quoteStatus == 'PENDING'){
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          // alert("Hello")
          this.subscription.add(this.jobDetailService.updateQuoteStatus(this.getQuotedId,'notsent').subscribe(() => {
            this.activeModal.close('close');  
            this.quotesService.quoteStatus = "NOTSENT"; 
            document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
            this.jobDetailService.getDetails.next(this.sharedDatas);
            this.common.setFormData(this.sharedDatas);
            this.jobDetailService.enableReview.next(false);
            // this.modalRef = this.modalService.open(CreateNewQuotesPopupComponent,{ centered: true,keyboard : false,
            // backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
            this.quotesService.checkOpenModalFrom.next('edit');
            this.router.navigate(['/quoteCosts/'+ this.getQuotedId]);
          }));
        }
      });
    }
    else{
      this.router.navigate(['/quoteCosts/'+ this.getQuotedId]);
    }
  }

  openMarkup() {
    this.getJobDetail();
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          this.subscription.add(this.jobDetailService.updateQuoteStatus(this.getQuotedId,'notsent').subscribe(() => {
            this.activeModal.close('close');  
            this.quotesService.quoteStatus = "NOTSENT"; 
            document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
            this.jobDetailService.totalMaterialAmount.next(this.sharedDatas);
            this.modalRef = this.modalService.open(AddEditMarkupComponent,{ centered: true,keyboard : false,
            backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
          }));
        }
      });
    }
    else {
    this.jobDetailService.totalMaterialAmount.next(this.sharedDatas);
    this.modalRef = this.modalService.open(AddEditMarkupComponent,{ centered: true,keyboard : false,
    backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
    }
  }

  openViewPage(){
    this.router.navigate(['/quoteView/' + this.getQuotedId]);
  }

  parseFloat(num) {
    return parseFloat(num);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.modalService.dismissAll();
  }  
}

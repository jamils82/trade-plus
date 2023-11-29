import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { labourCost } from 'src/app/core/constants/general';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { LabourCostsService } from 'src/app/core/service/customerQuotes/labourCosts.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditCostsPopupComponent } from './add-edit-costs-popup/add-edit-costs-popup/add-edit-costs-popup.component';
import { ProductDeletePopupComponent } from '../materials/custom-product-list-item/product-delete-popup/product-delete-popup.component';
import { QuoteStatusUpdatePopupComponent } from '../quote-status-update-popup/quote-status-update-popup.component';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
import { jobDetailConstants, quoteConstants } from 'src/app/core/constants/general';
import {RoutingService } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-labour-cost',
  templateUrl: './labour-cost.component.html',
  styleUrls: ['./labour-cost.component.scss']
})
export class LabourCostComponent implements OnInit {
  costConstants = labourCost;
  MaterialsLabel= jobDetailConstants;
  quoteConstants = quoteConstants;
  currentTab = 'Labour';
  quoteId: any;
  private subscription = new Subscription();
  labourCost:any;
  labourCostTotal:any;
  labourOtherCost:any;
  labourOtherCostTotal:any;
  materialcost: any;
  responseResult=false;
  resultEmpty=false;
  totalPrice:any;
  labourFooterLabel:boolean;
  modalRef: any;
  costType:any[];
  jobDetails: any;
  isLoading$ = new BehaviorSubject<boolean>(false);
  formData: any;
  onlyReviewStatus: string;
  quoteCode: any;
  prev: string;
  editVal: any;
  editMode = false;

  constructor(
    private labourCostService: LabourCostsService,
    private ac: ActivatedRoute,
    private jobDetailService: JobDetailsService,
    public dataService: DataService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public quotesService: QuotesService,
    private router: Router,
    public common: CommonService,
    private shareEvents: ShareEvents,
    private QuotesService: QuotesService,
  ) { }

  ngOnInit(): void {
    this.editVal = localStorage.getItem("event");
    // alert(this.editVal)
    this.formData = this.common.getFormData();
    // console.log("FormData on Job Details:", JSON.stringify(this.formData))
    if(this.editVal == 'edit'){
      this.editMode = true;
    }
    else if(this.editVal == 'create'){
      this.editMode = false;
    }
    else{
      this.editMode = true;
    }

    this.common.setPage('Labour');
    this.quoteCode = localStorage.getItem("quoteHeaderCode");
    this.onlyReviewStatus = sessionStorage.getItem("jobCode");
    this.prev = localStorage.getItem("prev");
    this.jobDetailService.enableReview.next(false);
    this.labourFooterLabel=true;
    
    if(this.ac.snapshot){
      this.quoteId = this.ac.snapshot.params['id'];
    }
    else{
      this.quoteId = this.quoteCode;
    }
    this.jobDetailService.getCurrentCostTab.subscribe(res => {
      
      if(res) {
        this.currentTab = res;
        this.getlabourCostDetails(this.quoteId, this.currentTab);
        this.getLabourOtherCostDetails(this.quoteId,'OtherCosts');
      } else {
        this.getlabourCostDetails(this.quoteId, this.currentTab);
        this.getLabourOtherCostDetails(this.quoteId,'OtherCosts');
      }
    })
    this.getJobDetail();
    this.subscription.add(this.labourCostService.setCostData.subscribe(res => {
      if(res) {
        window.scrollTo(0, 0);
        this.getlabourCostDetails(this.quoteId,'Labour');
        this.getLabourOtherCostDetails(this.quoteId,'OtherCosts');
        this.getJobDetail();
      }
    }));
    this.subscription.add(this.jobDetailService.markupAdded.subscribe(res => {
      if(res){
        this.getJobDetail();
      }
    }));
  }
  editQuote(){
    this.subscription.add(
      this.QuotesService.updateQuoteService(this.formData).subscribe(
        (responseData) => {
          this.getUpdateQuotes('edit', this.formData.jobAddress.firstName);
        //  this.modalService.dismissAll();
        this.common.setPage('customer-Quote');
        // this.common.setFlag(true)
        // this.createQuoteForm.reset();
        this.router.navigate(['/customerQuotes']);
        // this.router.navigate(['/quoteMaterials', this.quoteDetailData.code ])
        },
        (error) => {}
      )
    );
  }
  changeCostTab(tab: any) {
    this.currentTab = tab;
    this.getlabourCostDetails(this.quoteId,this.currentTab);
    this.getJobDetail();
    this.resultEmpty=false;
    this.responseResult=false;
  }
  // backToMaterial(){
  //   if(this.jobDetails?.code){
  //     this.router.navigate(['/quoteMaterials', this.jobDetails?.code])
  //   }
  //   else{
  //     this.router.navigate(['/quoteMaterials', this.quoteCode])
  //   }
   
  // }
  navigateToJobDetails(){
    // console.log("Previous page::",this.prev);
    // console.log("FormData:", JSON.stringify(this.formData))
    if (this.prev.includes('quoteMaterials') && (this.formData?.event == 'create')){
      this.router.navigate(['/create-new-quotes-popup'])
    }
    else if (this.prev.includes('quoteDetails')){
      this.router.navigate(['/quoteDetails', this.jobDetails?.code])
    }
    else if (this.prev.includes('quoteReview')){
      this.router.navigate(['/quoteDetails', this.jobDetails?.code])
    }
    else if(this.prev.includes('quoteMaterials') && (this.formData?.event != 'create')){
      this.router.navigate(['/quoteDetails', this.jobDetails?.code])
    }
  }
  backToMaterial(){
    // console.log("Code:", this.quoteCode)
    // console.log("Id:", this.quoteId)
    this.router.navigate(['/quoteMaterials', this.quoteId])
  }
  updateQuote(){
    this.router.navigate(['/quoteReview', this.quoteId ])
  }
  submitQuote(){
    this.formData =  this.common.getFormData()
    console.log("FormData::", JSON.stringify(this.formData))
    sessionStorage.setItem("submitQuote",'submitQuote');
    this.common.setData('Submit');
    if(this.formData != undefined){
      if (window.location.href.includes(this.quoteCode)){
        // alert("Create New")
        this.subscription.add(
          this.quotesService.createQuoteServiceNew(this.formData, this.quoteCode).subscribe(
            (responseData) => {
              this.getUpdateQuotes('create', this.formData.jobAddress.firstName);
              this.router.navigate(['/customerQuotes'])
              .then(() => {
                window.location.reload();
              })
            },
            (error) => {}
          )
        );
      }
      else{
        // alert("Edit existing")
        this.subscription.add(
          this.quotesService.createQuoteService(this.formData, this.quoteCode).subscribe(
            (responseData) => {
              this.getUpdateQuotes('create', this.formData.jobAddress.firstName);
              this.router.navigate(['/customerQuotes'])
              .then(() => {
                window.location.reload();
              })
            },
            (error) => {}
          )
        );
      }
      
    }
    else{
      // alert("Hello")
      this.router.navigate(['/customerQuotes'])
    }
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
      this.quotesService.getLatestQuotes.next(true);
    }
    setTimeout(() => {
      (
        document.querySelector('cx-global-message') as HTMLElement
      ).style.display = 'none';
    }, 3000);
  }
  getlabourCostDetails(quoteId,currentTab){
    this.subscription.add(this.labourCostService.retrieveLabourCosts(quoteId,'Labour').subscribe(res => {
      this.responseResult=true;
      this.labourCost=res.otherCostList;
      this.resultEmpty=false;
      this.costType=[];
      this.labourCost.forEach((value) =>{
        value.costType=="Labour" ? this.costType.push("Labour") : 
        value.costType=="Overheads"?this.costType.push("Overheads"):
        value.costType=="OtherCosts" ? this.costType.push("Other") :this.costType.push("SubContractor");
        value.costType=="Labour" ? this.labourCostTotal=value.total.value : 0;
      });
      if(res.otherCostList.entries.length==0){
        this.resultEmpty=true;
      }
    })
    );
  }

  getLabourOtherCostDetails(quoteId,currenTab) {
    this.subscription.add(this.labourCostService.retrieveLabourOtherCosts(quoteId,'Labour').subscribe(res => {
      this.responseResult=true;
      this.labourOtherCost=res.otherCostList;
      this.resultEmpty=false;
      this.costType=[];
      this.labourOtherCost.forEach((value) =>{
        value.costType=="Labour" ? this.costType.push("Labour") : 
        value.costType=="Overheads"?this.costType.push("Overheads"):
        value.costType=="OtherCosts" ? this.costType.push("Other") :this.costType.push("SubContractor");
        value.costType=="OtherCosts" ? this.labourOtherCostTotal=value.total.value : 0;
      });
      if(res.otherCostList.entries.length==0){
        this.resultEmpty=true;
      }
    })
    );

  }
  getJobDetail() {
    this.subscription.add(this.jobDetailService.getJobDetials(this.quoteId).subscribe((sharedData) =>{  
      // console.log("Ress:", JSON.stringify(sharedData))
      if(sharedData !=null && sharedData.jobAddress){
         this.jobDetails = sharedData;
        // this.jobDetails.creationTime  =this.datepipe.transform(this.jobDetails.creationTime , 'dd/MM/YYYY');
        // this.totalPrice=this.jobDetails.totalPrice;
        // this.dataService.changeJobname({quoteId: res.code, jobName: res.jobName});
        // this.quotesService.quoteStatus = res.status;
        this.isLoading$.next(true);
        this.totalPrice=sharedData.otherCostPrice;
        this.dataService.changeJobname({quoteId:sharedData.code, jobName: sharedData.jobAddress.firstName})
        this.quotesService.quoteStatus = sharedData.status;
      }
    }));
  }

  addEditCostModal(costName,index) {
      if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          let quoteId = this.ac.snapshot.params['id'];
          this.subscription.add(this.jobDetailService.updateQuoteStatus(quoteId,'notsent').subscribe(res => {
            this.activeModal.close('close');  
            (document.querySelector(".quoteStatusUpdate") as HTMLElement).style.visibility = 'hidden';
            this.modalRef = this.modalService.open(AddEditCostsPopupComponent,{ centered: true,keyboard : false,
              backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
              this.modalRef.componentInstance.currentTabTitle = costName;
              this.modalRef.componentInstance.costType = this.costType;
              this.modalRef.componentInstance.quoteId = this.quoteId;
              this.modalRef.componentInstance.currentElement = index;
          }));
        }
      });
    }
    else {
    this.modalRef = this.modalService.open(AddEditCostsPopupComponent,{ centered: true,keyboard : false,
    backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
    this.modalRef.componentInstance.currentTabTitle = costName;
    this.modalRef.componentInstance.costType = this.costType;
    this.modalRef.componentInstance.quoteId = this.quoteId;
    this.modalRef.componentInstance.currentElement = index;
  }

}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteCost(cost) {
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          let quoteId = this.ac.snapshot.params['id'];
          this.subscription.add(this.jobDetailService.updateQuoteStatus(quoteId,'notsent').subscribe(res => {
            this.activeModal.close('close');  
            (document.querySelector(".quoteStatusUpdate") as HTMLElement).style.visibility = 'hidden';
            this.modalRef = this.modalService.open(ProductDeletePopupComponent,{ centered: true,keyboard : false,
              backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
              this.jobDetailService.getCurrentCostTab.next(this.currentTab)
              this.modalRef.componentInstance.product = cost;
              this.modalRef.componentInstance.callFrom = 'labour-cost';
              this.modalRef.componentInstance.quotesId = this.quoteId;
          }));
        }
      });
    }
    else {
    this.modalRef = this.modalService.open(ProductDeletePopupComponent,{ centered: true,keyboard : false,
    backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
    this.jobDetailService.getCurrentCostTab.next(this.currentTab)
    this.modalRef.componentInstance.product = cost;
    this.modalRef.componentInstance.callFrom = 'labour-cost';
    this.modalRef.componentInstance.quotesId = this.quoteId;
    }

  }

}

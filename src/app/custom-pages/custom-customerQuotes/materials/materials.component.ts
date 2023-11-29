import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/internal/Subscription';
import { jobDetailConstants, quoteConstants, stageOfBuild } from 'src/app/core/constants/general';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { AddProductComponent } from './add-product/add-product.component';
import { CustomProductSearchPopupComponent } from 'src/app/custom-pages/custom-customerQuotes/materials/custom-product-search-popup/custom-product-search-popup.component';
import { MaterialService } from 'src/app/core/service/customerQuotes/material.service';
import { QuoteStatusUpdatePopupComponent } from '../quote-status-update-popup/quote-status-update-popup.component';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
//import { AddStageBuildPopupComponent } from '../job-detail/add-stage-build-popup/add-stage-build-popup.component';
import { CustomDeletePopupComponent } from '../custom-delete-popup/custom-delete-popup.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Subject } from 'rxjs';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { AddEditMarkupComponent } from './add-edit-markup/add-edit-markup.component';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-custom-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  MaterialsLabel = jobDetailConstants;
  stageOfBuildConstants = stageOfBuild;
  quoteConstants = quoteConstants;
  private subscription = new Subscription();
  modalRef: any;
  productType = 'materials';
  productList: any[];
  addedProduct = 0;
  totalPrice: any;
  productResultData = [];
  paginationData;
  sharedDatas: any;
  currentJobDetails: any;
  message: string;
  quoteId: any;
  stageList: any;
  currentStageId = "";
  stageTitle: string;
  stagecount: any;
  pageNumber = 0;
  lastStage = '';
  sobListLength:any;
  jobIdParam: any;
  isLoading$ = new BehaviorSubject<boolean>(false);
  @Input() productLength?: any;
  @Input() addEditMarkup?: any;
  clickTab: boolean = true;
  quoteHeaderCode: any;
  qetQuotedId: any;
  onlyReviewStatus: string;
  prev: string;
  currentUrl: string;
  previousUrl: any;
  quoteFormData: any;
  editMode = false;
  editVal: string;

  constructor(
    public jobDetailService: JobDetailsService,
    private ac: ActivatedRoute,
    private modalService: NgbModal,
    public dataService: DataService,
    private materialService: MaterialService,
    public activeModal: NgbActiveModal,
    public quotesService: QuotesService,
    private shareEvents: ShareEvents,
    private router: Router,
    public common: CommonService
  ) { }

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   if (document.getElementById('cost-summary') != null) {
  //     this.alignSummarySection();
  //   }
  // }

  // @HostListener('window:resize', []) 
  // onResize(event: Event) {
  //   if (document.getElementById('cost-summary') != null) {
  //     this.alignSummarySection();
  //   }
  // }

  // ngAfterViewChecked() {
  //   if (document.getElementById('cost-summary') != null) {
  //     this.alignSummarySection();
  //   }
  // }

  ngOnInit(): void {
    this.editVal = localStorage.getItem("event");
    if(this.editVal == 'edit'){
      this.editMode = true;
    }
    else if(this.editVal == 'create'){
      this.editMode = false;
    }
    else{
      this.editMode = true;
    }
    this.quoteFormData = this.common.getFormData();
    console.log("Material form data:", JSON.stringify(this.quoteFormData))
    this.onlyReviewStatus = sessionStorage.getItem("jobCode");
    this.quoteHeaderCode = localStorage.getItem('quoteHeaderCode');
    this.prev = localStorage.getItem("prev");
    // alert(localStorage.getItem("prev"))
    this.jobDetailService.enableReview.next(false);
    this.jobDetailService.getStageList.next(false);

    this.subscription.add(this.jobDetailService.markupAdded.subscribe(res => {
      if (res) {
        this.getJobDetail();
      }
    }));
    this.currentJobDetails = this.dataService.currentJobDetails;
    if (window.location.href.includes(this.quoteHeaderCode)){
      // alert("If")
      this.quoteId = this.quoteHeaderCode
    }
    else{
      // alert("Else")
      this.quoteId = this.ac.snapshot.params['id'];
    }
    this.jobDetailService.sendQuoteId.next(this.quoteId)
    this.dataService.currentQuoteId = this.quoteId;
    this.getJobDetail();
    this.getStages(this.pageNumber);
    this.subscription.add(this.materialService.loadMoreMaterials.subscribe((res) => {
      if (res) {
        this.pageNumber = res;
        this.getStages(res);
        this.jobDetailService.markupAdded.next(true);
      }
    }));
    this.subscription.add(this.materialService.updateRetreiveProduct.subscribe((res) => {
      if (res != null && res == 0) {
        this.isLoading$.next(false);
        this.productResultData = [];
        this.pageNumber = res;
        this.getJobDetail();
        this.getStages(res);
      }
    }));
    this.subscription.add(this.jobDetailService.getStageList.subscribe((res) => {
      if (res != null && res) {
        this.productResultData = [];
        this.getStages(this.pageNumber);
      }
    }))
    this.subscription.add(this.materialService.loaderTriggerReceiveEvent().subscribe((res) => {
      this.isLoading$.next(false);
    }))
  }

  alignSummarySection() {
    document.getElementById('cost-summary').classList.remove('fix-section');
    if ((window.innerHeight + document.documentElement.scrollTop - document.getElementById('sticky-footer-area').getBoundingClientRect().height) > document.getElementById('cost-summary').getBoundingClientRect().top + document.documentElement.scrollTop + document.getElementById('cost-summary').getBoundingClientRect().height) {
      document.getElementById('cost-summary').classList.add('fix-section');
    } else {
      document.getElementById('cost-summary').classList.remove('fix-section');
    }
  }

  getJobDetail() {
    if (window.location.href.includes(this.quoteHeaderCode)){
      // alert("If get job details")
      this.qetQuotedId = this.quoteHeaderCode
    }
    else{
      // alert("Else get job")
      this.qetQuotedId = this.ac.snapshot.params['id'];
    }
   
    this.jobIdParam = this.qetQuotedId;
    this.subscription.add(this.jobDetailService.getJobDetials(this.qetQuotedId).subscribe((sharedData) => {
      // console.log("sharedData tt", JSON.stringify(sharedData))
      if (sharedData != null && sharedData.jobAddress) {
        this.dataService.changeJobname({ quoteId: sharedData.code, jobName: sharedData.jobAddress.firstName })
        this.totalPrice = sharedData.totalPrice;
        this.sharedDatas = sharedData;
        
        if (this.quoteFormData?.event == 'create'){
          // alert("NEW")
          this.quotesService.quoteStatus = 'NEW';
        }
        else{
          // alert("sharedData.status")
          this.quotesService.quoteStatus = sharedData.status;
        }
      }
    }));
  }
  
  getStages(pageNumber) {
    this.subscription.add(this.jobDetailService.getStagesofBuild(this.quoteId).subscribe(res => {
     // if (Object.keys(res).length > 0) {
       // this.stageList = res?.pmQuoteSobList;
       // this.sobListLength=res?.pmQuoteSobList?.length;
        // if (this.dataService.currentStageId == '' || this.dataService.currentStageId == undefined) {
        //   this.dataService.currentStageId = res?.pmQuoteSobList[0]?.id;
        //   this.stageTitle = res?.pmQuoteSobList[0]?.name;
        //   this.lastStage = "";
        // }
        // else if (this.dataService.currentStageId == 'lastStage') {
        //   this.lastStage = "lastStage";
        //   let lastElement = this.stageList[this.stageList?.length - 1];
        //   this.stageTitle = lastElement?.name;
        //   this.dataService.currentStageId = lastElement?.id;
        // }
        // else {
        //   this.lastStage = "";
        //   this.stageTitle = this.stageList.filter(arr => arr.id == this.dataService?.currentStageId)[0]?.name;
        // }

      //   this.stagecount = res?.pmQuoteSobList?.length;
      // }
      this.retrieveProducts(this.quoteId, pageNumber, this.dataService.currentStageId);
    }, error => {
      this.retrieveProducts(this.quoteId, pageNumber, this.dataService.currentStageId);
    }
    ));
  }
  navigateToLabour(){
    
    this.router.navigate(['/quoteCosts', this.jobIdParam])
  }
  reviewQuote() {
    //  this.router.navigate(['/quotes/' + this.routeQuoteId + '/Review']); quoteReview
        this.router.navigate(['/quoteReview/' + this.jobIdParam]); 
    }
  navigateToJobDetails(){
    console.log(this.prev)
    if (this.prev.includes('create-new-quotes-popup') ){
      // this.common.setData('')
      this.router.navigate(['/create-new-quotes-popup'])
    }
    else if (this.prev.includes('quoteDetails')){
      this.router.navigate(['/quoteDetails', this.jobIdParam])
    }
    else if (this.prev.includes('quoteCosts') && this.quoteFormData?.event == 'create'){
      this.router.navigate(['/create-new-quotes-popup'])
    }
    else if (this.prev.includes('quoteCosts') && this.quoteFormData?.event != 'create'){
      this.router.navigate(['/quoteDetails', this.jobIdParam])
    }
    else if (this.prev.includes('quoteReview') ){
      this.router.navigate(['/quoteDetails', this.jobIdParam])
    }
  }
  changeStage(stageId, stageName) {
    this.lastStage = "";
    this.productResultData = [];
    this.dataService.currentStageId = stageId;
    this.stageTitle = stageName;
    this.retrieveProducts(this.quoteId, 0, stageId);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.stageList, event.previousIndex, event.currentIndex);
    let shuffleSobId;
     this.stageList.map((arr,index) =>{
      if(event.currentIndex == index){
        shuffleSobId=arr.id;
        this.lastStage = "";
      }
    });
    this.subscription.add(this.jobDetailService.shuffleSection(this.quoteId, event.currentIndex+1,shuffleSobId).subscribe(() => {
      // do nothing
    },error =>{
      if(error.status==400 && error.error.errors[0].message=='Error in Shuffling/Saving the positions'){
        this.jobDetailService.getStageList.next(true);
      }
      if(error.status==400 && error.error.errors[0].message=='Source Position should not be equal to target'){
        this.jobDetailService.getStageList.next(true);
      }
    }));   
  }
  retrieveProducts(quoteId, page: any, stageId) {
    this.subscription.add(this.materialService.getProducts(quoteId, page, stageId).subscribe(response => {
      if (response == null) {
        this.addedProduct = 0;
      }
      if (response != null && response) {
        this.productResultData.push(response.entries);
        this.productResultData = [].concat.apply([], this.productResultData);
        this.addedProduct = response.pagination.totalResults;
        this.paginationData = response.pagination;
        let isCatalogProductPresent = this.productResultData.filter(function (item) {
          return !item.customProductFlag;
        });
        this.jobDetailService.catalogProducts = isCatalogProductPresent.length ? true : false;
        this.isLoading$.next(true);
      } else {
        this.jobDetailService.catalogProducts = false;
        this.isLoading$.next(true);
      }
    }));
  }
  
  openProductSearchModal() {
   if(this.jobIdParam){
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          this.subscription.add(this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(() => {
            this.quotesService.quoteStatus = "NOTSENT";
            this.activeModal.close('close');
            document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
            this.modalRef = this.modalService.open(CustomProductSearchPopupComponent, {
              centered: true, keyboard: false,
              backdrop: 'static', windowClass: 'productSearchPopup', size: 'lg'
            });
          }));
        }
      });
    }
    else {
      this.modalRef = this.modalService.open(CustomProductSearchPopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'productSearchPopup', size: 'lg'
      });
    }
   }
  }
  openAddModal() {
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          this.subscription.add(this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(() => {
            this.activeModal.close('close');
            this.quotesService.quoteStatus = "NOTSENT";
            document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
            this.modalRef = this.modalService.open(AddProductComponent, {
              centered: true, keyboard: false,
              backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
            });
          }));
        }
      });
    }
    else {
      this.modalRef = this.modalService.open(AddProductComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
      });
    }
  }
  addStageModal() {
  if(this.jobIdParam){
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          this.subscription.add(this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(() => {
            this.activeModal.close('close');
            this.quotesService.quoteStatus = "NOTSENT";
            document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
            // this.modalRef = this.modalService.open(AddStageBuildPopupComponent, {
            //   centered: true, keyboard: false,
            //   backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
            // });
            this.modalRef.componentInstance.quoteId = this.quoteId;
          }));
        }
      });
    }
    else {
      // this.modalRef = this.modalService.open(AddStageBuildPopupComponent, {
      //   centered: true, keyboard: false,
      //   backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
      // });
      this.modalRef.componentInstance.quoteId = this.quoteId;
    }
  }
  }
  deleteStage() {
    if(this.jobIdParam){
      if (this.quotesService.quoteStatus == "PENDING") {
        this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
          centered: true, keyboard: false,
          backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
        });
        this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
          if (result == 'confirm') {
            this.subscription.add(this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(() => {
              this.activeModal.close('close');
              this.quotesService.quoteStatus = "NOTSENT";
              document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
              this.modalRef = this.modalService.open(CustomDeletePopupComponent, {
                centered: true, keyboard: false,
                backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
              });
              this.modalRef.componentInstance.callFrom = "delete-stage";
              this.modalRef.componentInstance.quotesId = this.quoteId;
              this.modalRef.componentInstance.stageId = this.dataService.currentStageId;
              this.modalRef.componentInstance.stageName = this.stageTitle;
  
            }));
          }
        });
      }
      else {
        this.modalRef = this.modalService.open(CustomDeletePopupComponent, {
          centered: true, keyboard: false,
          backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
        });
        this.modalRef.componentInstance.callFrom = "delete-stage";
        this.modalRef.componentInstance.quotesId = this.quoteId;
        this.modalRef.componentInstance.stageId = this.dataService.currentStageId;
        this.modalRef.componentInstance.stageName = this.stageTitle;
      }
    }
  }
  
  markComplete(added) {
    // console.log("Previous page:", this.prev)
    // console.log("status", this.quotesService.quoteStatus)
    //   if(this.jobIdParam){
    //     if (this.quotesService.quoteStatus == "PENDING") {
    //       this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
    //         centered: true, keyboard: false,
    //         backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
    //       });
    //       this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
    //         if (result == 'confirm') {
    //           this.subscription = this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(() => {
    //             this.quotesService.quoteStatus = "NOTSENT";
    //             this.activeModal.close('close');
    //             document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
    //             this.modalService.dismissAll();
    //             this.materialService.allProductAdded(this.quoteId, added);
    //           });
    //         }
    //       });
    //     }
    //     else if (this.quotesService.quoteStatus == "NEW"){
    //       this.router.navigate(['/create-new-quotes-popup'])
    //     }
    //     else{
    //       this.materialService.allProductAdded(this.quoteId, added);
    //     }
    //   }
    this.openAddModal();
    
  }

  repriceQuote(e) {
   if(this.jobIdParam){
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          this.subscription = this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(() => {
            this.quotesService.quoteStatus = "NOTSENT";
            this.activeModal.close('close');
            document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
            this.modalService.dismissAll();
          //  let elem = e.target;
          //  elem.innerHTML = '<div class="customerQuoteloading loading-wrapper "></div>';
          document.querySelector(".reprice-btn span").setAttribute('style','display:none');
          document.querySelector(".reprice-btn p").setAttribute('style','display:none');
          document.querySelector(".reprice-btn .updateLatestPriceLoader").setAttribute('style','display:block');
            this.quoteId = this.ac.snapshot.params['id'];
            this.subscription.add(this.jobDetailService.updatePriceService(this.quoteId).subscribe(() => {
              document.querySelector("cx-global-message").setAttribute('style','display:block');
              this.shareEvents.notificationInfo(quoteConstants.repriceSuccessMessage);
              setTimeout(() => {
                document.querySelector("cx-global-message").setAttribute('style','display:none');
              }, 3000);
              this.router.navigateByUrl('/quoteMaterials', { skipLocationChange: true }).then(() =>
                this.router.navigate(['/quoteMaterials/' + this.quoteId])
              );
             // elem.innerText = quoteConstants.repriceLabel;
              document.querySelector(".reprice-btn .updateLatestPriceLoader").setAttribute('style','display:none');
              document.querySelector(".reprice-btn span").setAttribute('style','display:block');
              document.querySelector(".reprice-btn p").setAttribute('style','display:block');
            },
            () => {
                document.querySelector("cx-global-message").setAttribute('style','display:block');
                this.shareEvents.warningInfo(quoteConstants.repriceWarningMessage);
                setTimeout(() => {
                  document.querySelector("cx-global-message").setAttribute('style','display:none');
                }, 3000);
              //  elem.innerText = quoteConstants.repriceLabel;
                document.querySelector(".reprice-btn .updateLatestPriceLoader").setAttribute('style','display:none');
                document.querySelector(".reprice-btn span").setAttribute('style','display:block');
                document.querySelector(".reprice-btn p").setAttribute('style','display:block');
              }));
          });
        }
      });
    }
    else {
     // let elem = e.target;
      document.querySelector(".reprice-btn span").setAttribute('style','display:none');
      document.querySelector(".reprice-btn p").setAttribute('style','display:none');
      document.querySelector(".reprice-btn .updateLatestPriceLoader").setAttribute('style','display:block');
      // elem.innerHTML = '<div class="customerQuoteloading loading-wrapper "></div>';
      this.quoteId = this.ac.snapshot.params['id'];
      this.subscription.add(this.jobDetailService.updatePriceService(this.quoteId).subscribe(() => {
        document.querySelector("cx-global-message").setAttribute('style','display:block');
        this.shareEvents.notificationInfo(quoteConstants.repriceSuccessMessage);
        setTimeout(() => {
          document.querySelector("cx-global-message").setAttribute('style','display:none');
        }, 3000);
        this.router.navigateByUrl('/quoteMaterials', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/quoteMaterials/' + this.quoteId])
        );
       // elem.innerText = quoteConstants.repriceLabel;
       document.querySelector(".reprice-btn .updateLatestPriceLoader").setAttribute('style','display:none');
       document.querySelector(".reprice-btn span").setAttribute('style','display:block');
       document.querySelector(".reprice-btn p").setAttribute('style','display:block');
      },
      () => {
          document.querySelector("cx-global-message").setAttribute('style','display:block');
          this.shareEvents.warningInfo(quoteConstants.repriceWarningMessage);
          setTimeout(() => {
            document.querySelector("cx-global-message").setAttribute('style','display:none');
          }, 3000);
        //  elem.innerText = quoteConstants.repriceLabel;
        document.querySelector(".reprice-btn .updateLatestPriceLoader").setAttribute('style','display:none');
        document.querySelector(".reprice-btn span").setAttribute('style','display:block');
        document.querySelector(".reprice-btn p").setAttribute('style','display:block');

        }));
    }
   }
  }

  openMarkupAddModal() {
    if(this.jobIdParam){
      if (this.quotesService.quoteStatus == "PENDING") {
        this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
          centered: true, keyboard: false,
          backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
        });
        this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
          if (result == 'confirm') {
            this.subscription.add(this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(() => {
              this.activeModal.close('close');
              this.quotesService.quoteStatus = "NOTSENT";
              document.querySelector(".quoteStatusUpdate").setAttribute('style','visibility:hidden');
              this.jobDetailService.totalMaterialAmount.next(this.sharedDatas);
              this.modalRef = this.modalService.open(AddEditMarkupComponent, {
                centered: true, keyboard: false,
                backdrop: 'static', windowClass: 'createQuotePopup addMarkupSec', size: 'lg'
              });
            }));
          }
        });
      }
      else {
        this.jobDetailService.totalMaterialAmount.next(this.sharedDatas);
        this.modalRef = this.modalService.open(AddEditMarkupComponent, {
          centered: true, keyboard: false,
          backdrop: 'static', windowClass: 'createQuotePopup addMarkupSec', size: 'lg'
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
    this.materialService.updateRetreiveProduct.next(1);
    this.jobDetailService.markupAdded.next(false);
    this.subscription.unsubscribe();
    this.dataService.currentStageId = '';
    this.lastStage = "";
  }
}

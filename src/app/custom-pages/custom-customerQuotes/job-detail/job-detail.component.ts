import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateNewQuotesPopupComponent } from '../../custom-customerQuotes/create-new-quotes-popup/create-new-quotes-popup.component';
import { DatePipe } from '@angular/common'
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
import { jobDetailConstants, quoteConstants } from 'src/app/core/constants/general';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import {RoutingService } from '@spartacus/core';
import { MaterialService } from 'src/app/core/service/customerQuotes/material.service';
import { QuoteStatusUpdatePopupComponent } from '../quote-status-update-popup/quote-status-update-popup.component';
import { filter } from 'rxjs/operators';
import { CommonService } from 'src/app/core/service/CommonService/common.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
  providers: [DatePipe]
})
export class JobDetailComponent implements OnInit {
  labelData = jobDetailConstants;
  MaterialsLabel=jobDetailConstants;
  quotesbuttonLabel=quoteConstants;
  modalRef: any;
  jobDetails: any;
  today: number = Date.now();
  totalPrice:any;
  productResultData: any[];
  private subscription = new Subscription();
  routeQuoteId: any;
  isLoading$ = new BehaviorSubject<boolean>(false);
  currentUrl: string;
  previousUrl: any;
  onlyReviewStatus: any;

  constructor(
     private jobDetailService: JobDetailsService,
     private ac: ActivatedRoute,
     private modalService: NgbModal,
     public datepipe: DatePipe,
     public quotesService: QuotesService,
     public dataService: DataService,
     private routingService: RoutingService,
     private materialService: MaterialService,
     public activeModal: NgbActiveModal,
     private router: Router,
     public common: CommonService
  ) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (document.getElementById('cost-summary') != null) {
      this.alignSummarySection();
    }
  }

  @HostListener('window:resize', []) 
  onResize(event: Event) {
    if (document.getElementById('cost-summary') != null) {
      this.alignSummarySection();
    }
  }

  ngAfterViewChecked() {
    if (document.getElementById('cost-summary') != null) {
      this.alignSummarySection();
    }
  }

  alignSummarySection() {
    document.getElementById('cost-summary').classList.remove('fix-section');
    if ((window.innerHeight+document.documentElement.scrollTop-document.getElementById('sticky-footer-area').getBoundingClientRect().height) > document.getElementById('cost-summary').getBoundingClientRect().top + document.documentElement.scrollTop+document.getElementById('cost-summary').getBoundingClientRect().height) {
      document.getElementById('cost-summary').classList.add('fix-section');
    } else {
      document.getElementById('cost-summary').classList.remove('fix-section');
    }
  }
  
  ngOnInit(): void {
    localStorage.setItem("breadEvent", 'edit')
    this.common.setPage('quoteDetails');
    // this.common.setFlag(true)
    this.currentUrl = this.router.url;
    this.previousUrl = null;
    this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
      console.log("previous job details: ", this.previousUrl)
      localStorage.setItem("prev", this.previousUrl)
      console.log("current job details: ", this.currentUrl)
        })
        // alert(this.previousUrl)  
        // if(this.previousUrl?.includes('quoteDetails')){
        //   this.common.setPage('quoteDetails');
        // }
   this.onlyReviewStatus = sessionStorage.getItem("jobCode");
    this.jobDetailService.enableReview.next(true);
   let qetQuotedId =  this.ac.snapshot.params['id'];
   this.routeQuoteId = this.ac.snapshot.params['id'];
    this.jobDetailService.sendQuoteId.next(qetQuotedId);
   this.materialService.loadMoreMaterials.next(0);
    this.getJobDetail(qetQuotedId)
    this.subscription.add(this.jobDetailService.setDetailApiData.subscribe(res => {
      if(res) {
        window.scrollTo(0, 0);
        this.getJobDetail(qetQuotedId);
      } else {
        window.scrollTo(0, 0);
      }
    }));
    this.jobDetailService.setTotalValue.next(null)
  }

  getJobDetail(quoteId) {
    this.subscription.add(this.jobDetailService.getJobDetials(quoteId).subscribe(res => {
      this.jobDetails = res;
      console.log("this.jobDetails",this.jobDetails);
      this.jobDetails.creationTime  =this.datepipe.transform(this.jobDetails.creationTime , 'dd/MM/YYYY');
      this.totalPrice=this.jobDetails.totalPrice;
      this.dataService.changeJobname({quoteId: res.code, jobName: res.jobName});
      this.quotesService.quoteStatus = res.status;
      this.isLoading$.next(true);
    }
    , error => {
      if(error.status==400){
        this.routingService.go('/customerQuotes');
        this.isLoading$.next(true);
      }
    }));
  }

  openModal() {
    this.quotesService.checkOpenModalFrom.subscribe(res => {
     console.log("1st res:", res)
    })
    this.jobDetailService.getDetails.next(this.jobDetails);
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          let quoteId = this.ac.snapshot.params['id'];
          this.subscription.add(this.jobDetailService.updateQuoteStatus(quoteId,"notsent").subscribe(res => {
              this.activeModal.close();
              this.quotesService.quoteStatus = "NOTSENT"; 
              (document.querySelector(".quoteStatusUpdate") as HTMLElement).style.visibility = 'hidden';
              // this.modalRef = this.modalService.open(CreateNewQuotesPopupComponent, {
              //   centered: true, keyboard: false,
              //   backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
              // });
              
              this.quotesService.checkOpenModalFrom.next('edit');
              this.router.navigate(['/create-new-quotes-popup']);
          }));
        }
      });
    }
    else {
     
      this.quotesService.checkOpenModalFrom.next('edit');
      // this.modalRef = this.modalService.open(CreateNewQuotesPopupComponent, {
      //   centered: true, keyboard: false,
      //   backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
      // });
      this.router.navigate(['/create-new-quotes-popup']);
    }
  }

  reviewQuote() {
  //  this.router.navigate(['/quotes/' + this.routeQuoteId + '/Review']); quoteReview
      this.router.navigate(['/quoteReview/' + this.routeQuoteId]); 
  }
  addProducts(){
    this.router.navigate(['/quoteMaterials', this.jobDetails?.code])
  }
  navigateToLabourCost(){
    localStorage.setItem("event", 'edit')
    this.router.navigate(['/quoteCosts', this.jobDetails?.code])
  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
    this.modalService.dismissAll(); 
    //this.dataService.changeJobname({quoteId:'', jobName:''})
  }

}

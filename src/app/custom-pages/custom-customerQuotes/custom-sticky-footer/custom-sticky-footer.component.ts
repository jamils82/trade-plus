import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { quoteConstants } from 'src/app/core/constants/general';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditMarkupComponent } from 'src/app/custom-pages/custom-customerQuotes/materials/add-edit-markup/add-edit-markup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotesShareEvents } from 'src/app/shared/customerQuotes/QuotesShareEvents.service';
import { SendQuotePopupComponent } from '../view-quote/send-quote-popup/send-quote-popup.component';
//import { materialService } from 'src/app/core/service/customerQuotes/material.service';
import { QuoteStatusUpdatePopupComponent } from '../quote-status-update-popup/quote-status-update-popup.component';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';

@Component({
  selector: 'app-custom-sticky-footer',
  templateUrl: './custom-sticky-footer.component.html',
  styleUrls: ['./custom-sticky-footer.component.scss']
})
export class CustomStickyFooterComponent implements OnInit, OnDestroy {
  quoteConstants = quoteConstants;
  // totalPrice: any;
  @Input() productType: any;
  @Input() totalPrice: any;
  @Input() addEditMarkup?: any;
  @Input() labourFooterLabel: boolean;
  @Input() productLength?: any;
  @Input() customerMailAddress: string;

  productTypes;
  subscription: Subscription;
  modalRef: any;
  quoteId: any;
  jobDetails: any;
  @ViewChild('contentModel', { static: false }) private content;

  constructor(
    public dataService: DataService,
    private jobDetailService: JobDetailsService,
    //private materialService: materialService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private shareEvents: QuotesShareEvents,
    private router: Router,
    public activeModal: NgbActiveModal,
    public quotesService: QuotesService,
  ) { }


  ngOnInit(): void {
    this.productTypes = this.productType;
    this.quoteId = this.activatedRoute.snapshot.params['id'];
    this.jobDetailService.setTotalValue.subscribe(res => {
      if (res) {
        this.totalPrice = res;
      }
    })
    //this.totalPrice=this.dataService.currentQuoteDetail?.totalPrice;
  }

  reviewQuote() {
    this.router.navigate(['/quotes/' + this.quoteId + '/review']);
  }

  viewQuote() {
    this.router.navigate(['/quotes/' + this.quoteId + '/view'])

  }

  openAddModal() {
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          this.subscription = this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(res => {
            this.activeModal.close('close');
            this.quotesService.quoteStatus = "NOTSENT";
            (document.querySelector(".quoteStatusUpdate") as HTMLElement).style.visibility = 'hidden';
            this.jobDetailService.totalMaterialAmount.next(this.addEditMarkup);
            this.modalRef = this.modalService.open(AddEditMarkupComponent, {
              centered: true, keyboard: false,
              backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
            });
          });
        }
      });
    }
    else {
      this.jobDetailService.totalMaterialAmount.next(this.addEditMarkup);
      this.modalRef = this.modalService.open(AddEditMarkupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
      });
    }
  }

  repriceQuote(e) {
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          this.subscription = this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(res => {
            this.quotesService.quoteStatus = "NOTSENT";
            this.activeModal.close('close');
            (document.querySelector(".quoteStatusUpdate") as HTMLElement).style.visibility = 'hidden';
            this.modalService.dismissAll();
            let elem = e.target;
            elem.innerHTML = '<div class="loading-wrapper"><div class="loader-more one"></div><div class="loader-more two"></div><div class="loader-more three"></div><div class="loader-more four"></div></div>';
            this.quoteId = this.activatedRoute.snapshot.params['id'];;
            this.jobDetailService.updatePriceService(this.quoteId).subscribe(res => {
              console.log(res);
              (document.querySelector("cx-global-message") as HTMLElement).style.display = 'block';
              this.shareEvents.notificationInfo(quoteConstants.repriceSuccessMessage);
              setTimeout(() => {
                (document.querySelector("cx-global-message") as HTMLElement).style.display = 'none';
              }, 3000);
              this.router.navigateByUrl('/quoteMaterials', { skipLocationChange: true }).then(() =>
                this.router.navigate(['/quotes/' + this.quoteId + '/materials'])
              );
              elem.innerText = quoteConstants.repriceLabel;
            },
              (err) => {
                (document.querySelector("cx-global-message") as HTMLElement).style.display = 'block';
                this.shareEvents.warningInfo(quoteConstants.repriceWarningMessage);
                setTimeout(() => {
                  (document.querySelector("cx-global-message") as HTMLElement).style.display = 'none';
                }, 3000);
                elem.innerText = quoteConstants.repriceLabel;
              });
          });
        }
      });
    }
    else {
      let elem = e.target;
      elem.innerHTML = '<div class="loading-wrapper"><div class="loader-more one"></div><div class="loader-more two"></div><div class="loader-more three"></div><div class="loader-more four"></div></div>';
      this.quoteId = this.activatedRoute.snapshot.params['id'];;
      this.jobDetailService.updatePriceService(this.quoteId).subscribe(res => {
        console.log(res);
        (document.querySelector("cx-global-message") as HTMLElement).style.display = 'block';
        this.shareEvents.notificationInfo(quoteConstants.repriceSuccessMessage);
        setTimeout(() => {
          (document.querySelector("cx-global-message") as HTMLElement).style.display = 'none';
        }, 3000);
        this.router.navigateByUrl('/quoteMaterials', { skipLocationChange: true }).then(() =>
          this.router.navigate(['/quotes/' + this.quoteId + '/materials'])
        );
        elem.innerText = quoteConstants.repriceLabel;
      },
        (err) => {
          (document.querySelector("cx-global-message") as HTMLElement).style.display = 'block';
          this.shareEvents.warningInfo(quoteConstants.repriceWarningMessage);
          setTimeout(() => {
            (document.querySelector("cx-global-message") as HTMLElement).style.display = 'none';
          }, 3000);
          elem.innerText = quoteConstants.repriceLabel;
        });
    }
  }
  sendtQuoteModal() {
    this.dataService.updateJobName.subscribe(response => {
      if (response != undefined && response != null) {
        console.log(response);
        this.jobDetails = response;
      }
    });
    this.modalRef = this.modalService.open(SendQuotePopupComponent, {
      centered: true, keyboard: false,
      backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
    });
    this.modalRef.componentInstance.jobDetails = this.jobDetails;
    this.modalRef.componentInstance.customerMailAddress = this.customerMailAddress;
  }

  markComplete(added) {
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          this.subscription = this.jobDetailService.updateQuoteStatus(this.quoteId, 'notsent').subscribe(res => {
            this.quotesService.quoteStatus = "NOTSENT";
            this.activeModal.close('close');
            (document.querySelector(".quoteStatusUpdate") as HTMLElement).style.visibility = 'hidden';
            this.modalService.dismissAll();
            //this.materialService.allProductAdded(this.quoteId, added);
          });
        }
      });
    }
    else {
      // this.materialService.allProductAdded(this.quoteId, added);
    }
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { deleteProduct, quoteConstants } from 'src/app/core/constants/general';
import { AddProductService } from 'src/app/core/service/customerQuotes/add-product.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { LabourCostsService } from 'src/app/core/service/customerQuotes/labourCosts.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { MaterialService } from 'src/app/core/service/customerQuotes/material.service';
import { QuotesService } from 'src/app/core/service//customerQuotes/quotes.service';

@Component({
  selector: 'app-product-delete-popup',
  templateUrl: './product-delete-popup.component.html',
  styleUrls: ['./product-delete-popup.component.scss']
})
export class ProductDeletePopupComponent implements OnInit {

  
  NgbModalRef: any;
  quoteConstants = quoteConstants;
  deleteConstants = deleteProduct;
  modalRef: any;
  quoteIds: any;
  @Input() product: any;
  @Input() quotesId: any;
  @Input() quoteName: any;
  @Input() callFrom?: any;
  @Input() stageId: any;
  productData: any
  callFroms: any;
  title: string;
  deleteDescription: string;
  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private addProductService: AddProductService,
    private shareEvents: ShareEvents,
    private labourCostService: LabourCostsService,
    private materialService: MaterialService,
    public quotesService: QuotesService,

    ) { }

  ngOnInit(): void {
    // this.quoteId = this.ac.snapshot.params['id'];
    this.callFroms = this.callFrom;
    this.quoteIds = this.quotesId;
    this.productData = this.product;

    if(this.callFroms === 'labour-cost') {
      this.title = this.deleteConstants.costPopupTitle;
      this.deleteDescription = this.deleteConstants.costDeleteDescription;
    } else if(this.callFroms === 'add-product') {
      this.title = this.deleteConstants.popupTitle;
      this.deleteDescription = this.deleteConstants.deleteDescription;
    } else if(this.callFroms === 'delete-quote') {
      this.title = this.deleteConstants.deleteQuoteTitle;
      this.deleteDescription = this.deleteConstants.deleteQuoteMessage;
    } 
  }
  closeModal(data:any){
    // this.activeModal.close(data);
    this.modalService.dismissAll();
    (document.querySelector(".createQuotePopup") as HTMLElement).style.visibility = 'visible';
    //this.jobDetailService.markupAdded.next(true);
  }
  dismissModal(){ 
    if(this.callFroms === 'labour-cost') {
    this.labourCostService.deleteCost(this.productData, this.quoteIds).subscribe(res => {
      this.labourCostService.setCostData.next(true);
      // this.router.navigateByUrl('/quoteCosts', {skipLocationChange: true}).then(()=>
      // this.router.navigate(['/quotes/'+this.quoteIds+'/costs'])
      // );
      (document.querySelector("cx-global-message") as HTMLElement).style.display = 'block';
      //this.shareEvents.notificationInfo(quoteConstants.costDeleteMessage); 
      setTimeout(() => {
        (document.querySelector("cx-global-message") as HTMLElement).style.display = 'none';
      }, 3000)
    })
  } else if (this.callFroms === 'add-product') {
    this.materialService.loaderTriggerSendEvent();
    this.addProductService.deleteProduct(this.productData, this.quoteIds, this.stageId).subscribe(res => {
      this.materialService.allProductAdded(this.quoteIds,false);
      this.materialService.updateRetreiveProduct.next(0);
      // this.router.navigateByUrl('/quoteMaterials', {skipLocationChange: true}).then(()=>
      // this.router.navigate(['/quotes/'+this.quoteIds+'/materials'])
     // );
      (document.querySelector("cx-global-message") as HTMLElement).style.display = 'block';
      //this.shareEvents.notificationInfo(quoteConstants.productDeleteMessage); 
      setTimeout(() => {
        (document.querySelector("cx-global-message") as HTMLElement).style.display = 'none';
      }, 3000)
    })
  } else if (this.callFroms === 'delete-quote') {
    this.quotesService.deleteQuoteService(this.quotesId).subscribe((data) => {
      this.quotesService.getLatestQuotes.next(true);
      (document.querySelector("cx-global-message") as HTMLElement).style.display = 'block';
      //this.shareEvents.notificationInfo(this.quoteName+' '+quoteConstants.quoteDeletedMessage); 
      setTimeout(() => {
        (document.querySelector("cx-global-message") as HTMLElement).style.display = 'none';
      }, 3000)
      }, error => {
    });
  }
    
    this.modalService.dismissAll();
  }
}

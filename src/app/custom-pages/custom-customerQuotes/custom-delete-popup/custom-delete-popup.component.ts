import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { deleteProduct, quoteConstants, stageOfBuild } from 'src/app/core/constants/general';
import { AddProductService } from 'src/app/core/service/customerQuotes/add-product.service';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { LabourCostsService } from 'src/app/core/service/customerQuotes/labourCosts.service';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { MaterialService } from 'src/app/core/service/customerQuotes/material.service';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';

@Component({
  selector: 'app-custom-delete-popup',
  templateUrl: './custom-delete-popup.component.html',
  styleUrls: ['./custom-delete-popup.component.scss']
})
export class CustomDeletePopupComponent implements OnInit {

  NgbModalRef: any;
  quoteConstants = quoteConstants;
  deleteConstants = deleteProduct;
  stageOfBuildConstants = stageOfBuild;
  modalRef: any;
  quoteIds: any;
  @Input() product: any;
  @Input() quotesId: any;
  @Input() quoteName: any;
  @Input() callFrom?: any;
  @Input() stageId: any;
  @Input() stageName: any;
  @Input() mediaFile: any;
  productData: any
  callFroms: any;
  title: string;
  deleteDescription: string;
  private subscription = new Subscription();
  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private addProductService: AddProductService,
    private shareEvents: ShareEvents,
    private labourCostService: LabourCostsService,
    private materialService: MaterialService,
    public quotesService: QuotesService,
    public jobDetailService: JobDetailsService,
    public dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.callFroms = this.callFrom;
    this.quoteIds = this.quotesId;
    this.productData = this.product;

    if (this.callFroms === 'labour-cost') {
      this.title = this.deleteConstants.costPopupTitle;
      this.deleteDescription = this.deleteConstants.costDeleteDescription;
    } else if (this.callFroms === 'add-product') {
      this.title = this.deleteConstants.popupTitle;
      this.deleteDescription = this.deleteConstants.deleteDescription;
    } else if (this.callFroms === 'delete-quote') {
      this.title = this.deleteConstants.deleteQuoteTitle;
      this.deleteDescription = this.deleteConstants.deleteQuoteMessage;
    } else if (this.callFroms === 'delete-stage') {
      this.title =this.stageOfBuildConstants.popupTitle +this.stageName+ this.stageOfBuildConstants.popupTitleStage;
      this.deleteDescription = this.stageOfBuildConstants.deleteMessage;
    } else if (this.callFroms === 'delete-file') {
      this.title =this.deleteConstants.filePopupTitle;
      this.deleteDescription = this.deleteConstants.deleteFileMessage;
    }

  }
  closeModal() {
    this.modalService.dismissAll();
    document.querySelector(".createQuotePopup").setAttribute('style','visibility:visible');
  }
  dismissModal() {
    if (this.callFroms === 'labour-cost') {
      this.subscription.add(this.labourCostService.deleteCost(this.productData, this.quoteIds).subscribe(_res => {
        this.labourCostService.setCostData.next(true);
        document.querySelector("cx-global-message").setAttribute('style','display:block');
        this.shareEvents.notificationInfo(quoteConstants.costDeleteMessage);
        setTimeout(() => {
          document.querySelector("cx-global-message").setAttribute('style','display:none');
        }, 3000)
      }));
    } else if (this.callFroms === 'add-product') {
      this.subscription.add(this.addProductService.deleteProduct(this.productData, this.quoteIds, this.stageId).subscribe(_res => {
        this.materialService.allProductAdded(this.quoteIds, false);
        this.materialService.updateRetreiveProduct.next(0);
        document.querySelector("cx-global-message").setAttribute('style','display:block');
        this.shareEvents.notificationInfo(quoteConstants.productDeleteMessage);
        setTimeout(() => {
          document.querySelector("cx-global-message").setAttribute('style','display:none');
        }, 3000)
      }));
    } else if (this.callFroms === 'delete-quote') {
      this.subscription.add(this.quotesService.deleteQuoteService(this.quotesId).subscribe(() => {
        this.quotesService.getLatestQuotes.next(true);
        document.querySelector("cx-global-message").setAttribute('style','display:block');
        this.shareEvents.notificationInfo(this.quoteName + ' ' + quoteConstants.quoteDeletedMessage);
        setTimeout(() => {
          document.querySelector("cx-global-message").setAttribute('style','display:none');
        }, 3000)
      }));
    } else if (this.callFroms === 'delete-stage') {
      this.subscription.add(this.jobDetailService.deleteStageSection(this.quotesId, this.stageId).subscribe(() => {
        this.dataService.currentStageId = '';
        this.materialService.allProductAdded(this.quoteIds, false);
        this.materialService.updateRetreiveProduct.next(0);
        document.querySelector("cx-global-message").setAttribute('style','display:block');
        this.shareEvents.notificationInfo(this.stageName + ' ' + stageOfBuild.stageDeletedMessage);
        setTimeout(() => {
          document.querySelector("cx-global-message").setAttribute('style','display:none');
        }, 3000)
      }));
    } else if (this.callFroms === 'delete-file') {
      this.subscription.add(this.quotesService.deleteFileService(this.quoteIds, this.mediaFile.quoteMediaPK).subscribe(() => {
        this.quotesService.getLatestFiles.next(true);
        document.querySelector("cx-global-message").setAttribute('style','display:block');
        this.shareEvents.notificationInfo(this.mediaFile.code + ' ' + quoteConstants.quoteDeletedMessage);
        setTimeout(() => {
          document.querySelector("cx-global-message").setAttribute('style','display:none');
        }, 3000)
      }));
    }
    this.modalService.dismissAll();
  }
  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }
}

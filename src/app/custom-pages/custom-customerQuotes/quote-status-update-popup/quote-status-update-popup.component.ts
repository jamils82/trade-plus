import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { quoteConstants } from 'src/app/core/constants/general';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quote-status-update-popup',
  templateUrl: './quote-status-update-popup.component.html',
  styleUrls: ['./quote-status-update-popup.component.scss']
})
export class QuoteStatusUpdatePopupComponent implements OnInit {
  quoteConstants = quoteConstants;
  @Output() quoteUpdateStatus = new EventEmitter();

  constructor(    
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {
  }
  dismissModal(data:any){
   // this.activeModal.close(data);
   this.modalService.dismissAll(); 
    if(document.querySelector(".createQuotePopup"))
    (document.querySelector(".createQuotePopup") as HTMLElement).style.visibility = 'visible';
    this.quoteUpdateStatus.emit("cancel");
  }
  confirm(){
    this.quoteUpdateStatus.emit("confirm");
  }
}

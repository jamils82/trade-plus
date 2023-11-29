import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { quoteConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {

  NgbModalRef: any;
  quoteConstants = quoteConstants;
  modalRef: any;
  @Input() public popupTitle;
  @Input() public containerMessage;
  @Input() public statusValue? ;
  modalTitle: any;
  updatedMessage: any;
  @Output() cancelPopup = new EventEmitter();
  @Output() confirmPopup = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.modalTitle = this.popupTitle;
    this.updatedMessage = this.containerMessage;
  }
  
  closeModal(data: any) {
    this.activeModal.close(data);
    (document.querySelector(".createQuotePopup") as HTMLElement).style.visibility = 'visible';
  }
  
  dismissModal(e) {
    this.modalService.dismissAll();
    this.confirmPopup.emit("confirm");

  }

}

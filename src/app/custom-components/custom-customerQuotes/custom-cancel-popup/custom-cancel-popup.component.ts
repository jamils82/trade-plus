import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { quoteConstants } from 'src/app/core/constants/general';

@Component({
  selector: 'app-create-quote-cancel-popup',
  templateUrl: './custom-cancel-popup.component.html',
  styleUrls: ['./custom-cancel-popup.component.scss']
})
export class CustomCancelPopupComponent implements OnInit {
  NgbModalRef: any;
  quoteConstants = quoteConstants;
  modalRef: any;
  @Input() public cancelPopupTitle;
  @Input() public cancelfileuploadMessage;
  cancelpopupTitle:any;
  fileuploadMessage:any;
  @Output() clearFileUpload = new EventEmitter();
  @Output() clearCompanyProfileForm = new EventEmitter();
  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal

    ) { }

  ngOnInit(): void {
    this.cancelpopupTitle=this.cancelPopupTitle;
    this.fileuploadMessage=this.cancelfileuploadMessage;
  }
  closeModal(data:any){
    this.activeModal.close(data);
    (document.querySelector(".createQuotePopup") as HTMLElement).style.visibility = 'visible';
  }
  dismissModal(){
    this.modalService.dismissAll();
    this.clearCompanyProfileForm.emit("confirm");

  }
  dismissModalfileUpload(data:any){
    this.activeModal.close(data);
    (document.querySelector(".createQuotePopup") as HTMLElement).style.visibility = 'visible';
    this.clearFileUpload.emit("confirm");
  }
}

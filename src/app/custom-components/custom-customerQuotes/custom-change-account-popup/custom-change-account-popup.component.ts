import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { changeAccount } from 'src/app/core/constants/general';

@Component({
  selector: 'app-custom-change-account-popup',
  templateUrl: './custom-change-account-popup.component.html',
  styleUrls: ['./custom-change-account-popup.component.scss']
})
export class CustomChangeAccountPopupComponent implements OnInit {

  NgbModalRef: any;
  changeAccountConstants = changeAccount;
  modalRef: any;

  constructor(
      private modalService: NgbModal,
      public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {

  }

  closeModal(data:any){
    this.activeModal.close(data);
  }

  dismissModal(){
    this.modalService.dismissAll();
  }
  
}

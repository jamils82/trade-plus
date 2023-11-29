import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chnage-quote-popup',
  templateUrl: './chnage-quote-popup.component.html',
  styleUrls: ['./chnage-quote-popup.component.scss']
})
export class ChnageQuotePopupComponent implements OnInit {
  selectedChoice: any;

  constructor(private modalService: NgbModal,
    public modalActiveService: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closePopUp() {
    this.modalService.dismissAll()
  }

  changePage(updatedValue){
    this.selectedChoice = updatedValue;
    this.modalActiveService.close(this.selectedChoice);

  }

}

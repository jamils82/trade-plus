import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shared-warning-popup',
  templateUrl: './shared-warning-popup.component.html',
  styleUrls: ['./shared-warning-popup.component.scss']
})
export class SharedWarningPopupComponent implements OnInit {
  @Input() heading: string;
  @Input() infoMessage: string;

  constructor(
    private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  
  closePopup() {
    this.modalService.dismissAll();
  }
}

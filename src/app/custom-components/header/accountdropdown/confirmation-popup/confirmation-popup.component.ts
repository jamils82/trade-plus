import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-switch-account-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {

  constructor(private modalService: NgbModal, private userProfileDetailsService: FIUserAccountDetailsService) { }

  @Output() switchAccount  = new EventEmitter();
  ngOnInit(): void {
  }
  closePopUp() {
    this.modalService.dismissAll()
  }
  onClick($event) {
    this.switchAccount.emit($event);
   // this.userProfileDetailsService.setCheckPermissions();
  }
}

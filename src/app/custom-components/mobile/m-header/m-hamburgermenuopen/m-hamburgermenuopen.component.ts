import { Component, OnInit } from '@angular/core';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-m-hamburgermenuopen',
  templateUrl: './m-hamburgermenuopen.component.html',
  styleUrls: ['./m-hamburgermenuopen.component.scss']
})
export class MHamburgermenuopenComponent implements OnInit {

  openContactUsDiv: boolean = false;
  openContactVal: boolean = false;

  constructor(private shareEvents: ShareEvents) { }

  ngOnInit(): void {

  }

  openContact() {
    this.openContactVal = !this.openContactVal;
  }

  openSubData() {
    this.openContactUsDiv = !this.openContactUsDiv;
  }

  mobileCloseMenu() {
    this.shareEvents.contactCustomerServicePopupMobileSendEvent();
  }
  closePopup() {
    this.shareEvents.mobileHamburgerMenuSubjectSendEvent();
  }
}

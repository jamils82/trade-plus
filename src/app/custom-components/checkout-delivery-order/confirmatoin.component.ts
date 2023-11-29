import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./delivery-order.component.scss'],
})
export class confirmationComponent implements OnInit {
  @Input() confirmData: any;

  constructor() {}

  ngOnInit(): void {
  }

  ngOnDestroy() {
    localStorage.removeItem('manualAddress');
    localStorage.removeItem('deliveryFormatAddress');
    localStorage.removeItem('orderRefDel');
    localStorage.removeItem('orderRefCC');
    localStorage.removeItem('branchID');
    localStorage.removeItem('contactDetails');
    localStorage.removeItem('requestedDate');
    localStorage.removeItem('TypeOfConfirm');
  }
}

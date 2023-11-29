import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paymentfailure',
  templateUrl: './paymentfailure.component.html',
  styleUrls: ['./paymentfailure.component.scss']
})
export class PaymentfailureComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    sessionStorage.setItem("PaymentTransactionStatus", "true");
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.scss']
})
export class PaymentsuccessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    sessionStorage.setItem("PaymentTransactionStatus", "true");
  }

}

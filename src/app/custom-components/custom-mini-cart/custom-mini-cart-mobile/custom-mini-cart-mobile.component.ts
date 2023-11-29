import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-mini-cart-mobile',
  templateUrl: './custom-mini-cart-mobile.component.html',
  styleUrls: ['./custom-mini-cart-mobile.component.scss']
})
export class CustomMiniCartMobileComponent implements OnInit {

  constructor(
    private modalService: NgbModal
  ) { }

  @Input() items: any;
  @Input() quantity$: any;
  @Input() totalPriceFormat: any;

  ngOnInit(): void {
  }

  closePopUp() {
    this.modalService.dismissAll()
  }
}

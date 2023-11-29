import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-delete-cart-item',
  templateUrl: './custom-delete-cart-item.component.html',
  styleUrls: ['./custom-delete-cart-item.component.scss']
})
export class CustomDeleteCartItemComponent implements OnInit {

  constructor(
    private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  close() {
    this.modalService.dismissAll();
  }
  closeWithSuccess() {
    this.modalService.dismissAll(true);
  }
}

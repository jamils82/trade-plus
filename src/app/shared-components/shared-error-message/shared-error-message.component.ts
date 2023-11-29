import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-shared-error-message',
  templateUrl: './shared-error-message.component.html',
  styleUrls: ['./shared-error-message.component.scss']
})
export class SharedErrorMessageComponent implements OnInit {
  
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  close() {
    this.modalService.dismissAll();
  }
}

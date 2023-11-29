import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { quoteConstants, viewQuote } from 'src/app/core/constants/general';
import { QuotesService } from 'src/app/core/service/quotes.service';

@Component({
  selector: 'app-create-quote-include-mediaInfo-popup',
  templateUrl: './include-mediaInfo-popup.component.html',
  styleUrls: ['./include-mediaInfo-popup.component.scss']
})
export class IncludeMediaInfoPopupComponent {
  NgbModalRef: any;
  quoteConstants = quoteConstants;
  viewQuote = viewQuote;
  @Input() quoteId: any;
  @Input() title: string;
  @Output() resetToggle = new EventEmitter();

  constructor(private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,
    public quotesService: QuotesService,

  ) { }

  dismissModal() {
    this.modalService.dismissAll();
    this.resetToggle.emit("cancel");
  }
  confirm() {
    this.router.navigate(['/quotes/' + this.quoteId]);
  }

}

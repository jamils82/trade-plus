import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-download-format',
  templateUrl: './view-download-format.component.html',
  styleUrls: ['./view-download-format.component.scss']
})
export class ViewDownloadFormatComponent implements OnInit {
  @Input() rowData: any;
  @Input() rowDataAttributes: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}

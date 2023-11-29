import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-shared-success-message',
  templateUrl: './shared-success-message.component.html',
  styleUrls: ['./shared-success-message.component.scss']
})
export class SharedSuccessMessageComponent implements OnInit {
  @Input() successInd$ = new BehaviorSubject<boolean>(false);
  @Input() infoMessage = '';
  constructor() { }

  ngOnInit(): void {
  }
  closeSuccessMsg() {
    this.successInd$.next(false);
  }
}

import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { inputStateService } from 'src/app/shared/services/inputState.service';

@Component({
  selector: 'app-save-preferred-email',
  templateUrl: './save-preferred-email.component.html',
  styleUrls: ['./save-preferred-email.component.scss']
})
export class SavePreferredEmailComponent implements OnInit {

  @Input() public num;
  @Input() public preObj;
  @Input() public selectedChoice;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(public modalService: NgbActiveModal,private inputStateService: inputStateService) { }

  ngOnInit() {}
  saveEmail(updatedValue) {
    this.inputStateService.setUpdatedState(false);
    //this.modalService.dismissAll(updatedValue);
    this.passEntry.emit(this.num);
    this.selectedChoice = updatedValue;
    this.modalService.close(this.selectedChoice);
  }
  closePopup(updatedValue){
    this.inputStateService.setUpdatedState(false);
    this.selectedChoice = updatedValue;
    this.modalService.close(this.selectedChoice);
  }

}

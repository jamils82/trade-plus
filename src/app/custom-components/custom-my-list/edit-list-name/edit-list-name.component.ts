import { MyListService } from 'src/app/core/service/my-list.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-list-name',
  templateUrl: './edit-list-name.component.html',
  styleUrls: ['./edit-list-name.component.scss']
})
export class EditListNameComponent implements OnInit {

  @Input() listName;
  @Input() email;
  @Output() newNameEventEmitter = new EventEmitter();
  newName;
  constructor( private modalService: NgbModal,
    private myListService: MyListService) { }

  ngOnInit(): void {
  }

  myListName(event) {
    this.newName= event.target.value;
  }

  onSave() {
    let data = {
      "newListName": this.newName,
      "oldListName": this.listName,
      "userID": this.email,
    }
    this.myListService.editListName(data).subscribe((result) => {
      if(result) {
        this.newNameEventEmitter.emit(result.listName)
       this.closePopUp(); 
      }
    }),
    (error) => {
    }
  }

  closePopUp() {
    this.modalService.dismissAll()
  }
}

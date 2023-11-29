import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyListService } from 'src/app/core/service/my-list.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';

@Component({
  selector: 'app-create-my-list',
  templateUrl: './create-my-list.component.html',
  styleUrls: ['./create-my-list.component.scss']
})
export class CreateMyListComponent implements OnInit {
  popUpTitle: string;
  isEdit: boolean = false;
  listForm: FormGroup;
  @Input() data: any;
  emailId: any;
  submitted: boolean;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private myListService: MyListService,
    private userProfileDetailsService: FIUserAccountDetailsService) { }

  ngOnInit(): void {
    if (!this.data) {
      this.popUpTitle = 'CREATE NEW LIST';
      this.createListForm(null);
    } else {
      this.popUpTitle = 'EDIT LIST NAME';
      this.createListForm(this.data);
      this.isEdit = true;
    }
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
      }
    });
    (<any>window).dataLayer.push({
      'event':'New List Click',
      'userId':this.emailId,
      'accountId':localStorage.getItem('selectedIUID'),
      'step': 1,
      'step_label': 'Create New List Page Load'
    });
  }

  closePopup() {
    this.modalService.dismissAll('');
  }

  get f() { return this.listForm.controls; }


  create() {
    this.submitted = true;
    if (this.listForm.invalid) {
      return;
    }
    if (this.listForm.valid) {


      if (!this.isEdit) {
        let list: any = {
          "listName": this.listForm.get('listName').value,
          "userID": this.emailId,
        };
        (<any>window).dataLayer.push({
          'event':'New List Click',
          'userId':this.emailId,
          'accountId':localStorage.getItem('selectedIUID'),
          'step': 2,
          'step_label': 'Create New List Click'
        });
        this.myListService.createMyList(list)
          .subscribe(
            result => {
              this.close(this.listForm.get('listName').value) ;
            },
            (error) => {
              this.close('error') ;
            }
          )
          // oldlistName
      } else {
        let list: any = {
          "newListName": this.listForm.get('listName').value,
          "oldListName": this.data.listName,
          "userID": this.emailId,
        }
        this.myListService.editMyList(list)
        .subscribe(
          (result) => {
            this.close(this.listForm.get('listName').value);
          }
        )
      }

    }


  }
  close(result: string) {
    this.modalService.dismissAll(result);
  }
  createListForm(data) {
    try {
      this.listForm = new FormGroup({
        listName: new FormControl({ value: data != null ? data.listName : '', disabled: false }, [Validators.required]),
      });
    } catch (ex) {
    }
  }
}

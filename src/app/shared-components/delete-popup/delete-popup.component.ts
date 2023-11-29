import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { downloadFormatService } from 'src/app/core/service/download-format.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { TeamMemberService } from 'src/app/core/service/team-member.service';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {
  popUpTitle: string;
  isEdit: boolean = false;
  @Input() data: any;
  @Output() afterDeleteResponse = new EventEmitter();
  @Output() clearAllData = new EventEmitter();
  emailId: any;
  submitted: boolean;
  constructor(
    private modalService: NgbModal, 
    public myListService: MyListService,
    public downloadformatService: downloadFormatService,
    private teamMemberService: TeamMemberService) { }

  ngOnInit(): void {

  }
  closePopup() {
    this.modalService.dismissAll('');
  }

  closeWithSuccess() {
    this.modalService.dismissAll(true);
  }

  deleteMyList(){

  if(this.data.page == 'MyList' ) {
    this.myListService.deleteMyList(this.data).subscribe(result => {
      this.closeWithSuccess()
    })
  }
  if(this.data.page == 'EditList') {
    this.myListService.deleteProductFromList(this.data).subscribe(result => {
      this.afterDeleteResponse.emit(result);
      this.closeWithSuccess()
    })
  }

  if(this.data.page == 'QuickOrder') {
    this.afterDeleteResponse.emit(this.data.index);
    this.closeWithSuccess();
  }

  if(this.data.page == 'QuickOrderClearAll') {
    this.clearAllData.emit(true);
    this.closeWithSuccess();
  }
  if(this.data.page == 'MyTeam') {
    const invitee = {
      "email": this.data.data.email,
      "firstName": this.data.data.firstName,
      "inviteStatus": this.data.data.inviteStatus,
      "invitedBy": this.data.data.invitedBy,
      "invitedByName": this.data.data.invitedByName,
      "invitedOn": this.data.data.invitedOn,
      "lastName": this.data.data.lastName,
      "mobileNumber": '+61' + this.data.data.mobileNumber,
      "permissionList": this.data.data.permissionList,
      "role": this.data.data.role,
      "selectedTradeAccount": this.data.data.selectedTradeAccount,
      "temporaryAccess": this.data.data.temporaryAccess,
      "userType": this.data.data.userType
    };

    this.teamMemberService.deleteInviteeList(invitee).subscribe((result) => {
       this.closeWithSuccess();
      });
  }

  if(this.data.page == 'downloadFormat') {
    console.log("this.data tt", this.data)
    this.downloadformatService.deleteFileFormat(this.data).subscribe(result => {
      this.afterDeleteResponse.emit(result);
      this.closeWithSuccess()
    })
  }
 // this.myListService.deleteMyList()
  }

}

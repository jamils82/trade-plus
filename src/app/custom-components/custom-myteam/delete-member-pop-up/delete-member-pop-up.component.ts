import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamMemberService } from 'src/app/core/service/team-member.service';

@Component({
  selector: 'app-delete-member-pop-up',
  templateUrl: './delete-member-pop-up.component.html',
  styleUrls: ['./delete-member-pop-up.component.scss'],
})
export class DeleteMemberPopUpComponent implements OnInit {
  @Input() data: any;
  constructor(
    private modalService: NgbModal,
    private teamMemberService: TeamMemberService
  ) {}

  ngOnInit(): void {}
  deleteInvite() {
    const invitee = {
      "email": this.data.data.email,
      "firstName": this.data.data.firstName,
      "inviteStatus": this.data.data.inviteStatus,
      "invitedBy": this.data.data.invitedBy,
      "invitedByName": this.data.data.invitedByName,
      "invitedOn": this.data.data.invitedOn,
      "lastName": this.data.data.lastName,
      "mobileNumber": this.data.data.mobileNumber,
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

  close() {
    this.modalService.dismissAll();
  }
  closeWithSuccess() {
    this.modalService.dismissAll(true);
  }
}

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountPrefService } from 'src/app/core/service/accountPref.service ';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';

@Component({
  selector: 'app-myob-popup',
  templateUrl: './myob-popup.component.html',
  styleUrls: ['./myob-popup.component.scss']
})
export class MyobPopupComponent implements OnInit {
  emailId: string;

  @Output() statusEventEmitter = new EventEmitter<boolean>();
  constructor(private modalService: NgbModal,
    private userAccountDetailsService: FIUserAccountDetailsService,
    private accountPrefService: AccountPrefService) { }

  ngOnInit(): void {
    this.userAccountDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
      }
    });
  }

  onSave() {
    let data: string = 'MYB';
    this.accountPrefService.myOBFergusConnect(data).subscribe((data) => {
      if (data != undefined) {
        const isError: boolean = data != undefined ? false : true;
        if( !isError ) {
          window.open(data , '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
        }
        this.statusEventEmitter.emit(isError);
        this.closePopUp();
      }
    });
  }

  closePopUp() {
    this.modalService.dismissAll()
  }

}

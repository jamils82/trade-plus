
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountPrefService } from 'src/app/core/service/accountPref.service ';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-xero-connect-popup',
  templateUrl: './xero-connect-popup.component.html',
  styleUrls: ['./xero-connect-popup.component.scss']
})
export class XeroConnectPopupComponent {
  @Output() statusEventEmitter = new EventEmitter<boolean>();
  validationError: any = 'Validation Failed';
  xeroEmail: string;
  showError = false;
  email = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern(/^[\.a-z0-9](\.?[\$\&\*\+\-\/\^\_\{\|\}\~\#\!\-a-z0-9]){5,}@xerofiles\.com$/)
  ]);
  constructor(
    private modalService: NgbModal,
    private accountPrefService: AccountPrefService) {

  }


  onSave() {
    this.showError = false;
    ///  email validation 
    if (this.email.invalid || this.email.value == '') {
      this.showError = true;
      return
    }
    
    let data: string = '&partnerCode=XRO&partnerDesc=Xero';
    const connectStatus = this.accountPrefService.getConnectStatus();
    console.log("Connection status:", connectStatus)
    this.accountPrefService.xeroCloudIntegration(connectStatus, this.xeroEmail, data).subscribe((data) => {
      if (data != undefined) {
        const isError: boolean = data == '200' ? false : true;
        this.statusEventEmitter.emit(isError);
        this.closePopUp();
      }
    });
  }

  closePopUp() {
    this.modalService.dismissAll()
  }
}

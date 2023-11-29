import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { CreateAccountService } from 'src/app/core/service/createAccount.service';
import { Auth0TokenService } from 'src/app/core/service/token.service';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss']
})
export class SuccessPageComponent implements OnInit {
  modal: any;
  btn: any;
  span: any;
  accordions: any;
  infoMessage: string;
  linkTradeAccountObject: any;
  errorInd: boolean = false;
  linkVal: any;

  constructor(private createAccountService: CreateAccountService,
    private auth0TokenService: Auth0TokenService,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit(): void {
  }

  

  

  getStarted() {
    this.linkVal = this.commonService.getLinkValues();
    document.location.href = '/';
    // this.createAccountService.linkTradeAccountsAPICall(this.linkVal).subscribe(
    //   result => {
    //     document.location.href = '/';
    //   },
    //   error => {
    //     this.infoMessage = "Link Account Failed"
    //     this.errorInd = true
    //     this.errorInd = true;
    //     // this.infoMessage = error.error.errors[0].message ;
    //   })
  }

}

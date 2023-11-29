import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.scss']
})
export class HelpSupportComponent implements OnInit {
  popUpData: any;
  phoneNumber: any;
  isMobile: boolean = false;
  constructor(private cmsService: CmsService, private shareEvents: ShareEvents) { }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.cmsService.getComponentData("TPCustomerServicePhoneNumberComponent").subscribe((data) => {
      this.phoneNumber = data;
    })
    this.cmsService.getComponentData("TPCustomerServiceComponent").subscribe((data) => {
      this.popUpData = data;
    })
  }

  phoneNumberClicked() {
    (<any>window).dataLayer.push({
      'event':'Phone Click',
      'eventCategory':'Phone',
    //  'eventAction':window.location.href, //Pass the URL of the screen from where user clicked on the Phone
    });
  }

}

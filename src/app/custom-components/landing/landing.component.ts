import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ApptradepopupComponent } from '../mobile/m-tradeapp-popup/apptradepopup/apptradepopup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  deviceInfo = null;
  contactUSDetail:boolean = true;
  iconDown:boolean = false;
  iconUp:boolean = true;
  constructor(
    private modalService: NgbModal,
    private deviceService: DeviceDetectorService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isDeviceMobile = this.deviceService.isMobile();
    if(isDeviceMobile == true) {
      // console.log("this.deviceInfo tt", this.deviceInfo);
      // console.log("isMobile tt", isDeviceMobile)
      this.openModal(); // Uncomment when trade app team requires the universal linking popup
    }
  }

  openModal() {
    this.modalService.open(ApptradepopupComponent, {
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'appTradePopup',
      size: 'lg',
    });
  }

  signinRedirect(val:any) {
    localStorage.setItem("Login", val);
   window.open(environment.UIsiteURl + "/login", "_blank");
  //  this.router.navigate(['/success']);
  }
  NeedHelp(){
    this.iconDown = !this.iconDown;
    this.iconUp = !this.iconUp;
    this.contactUSDetail = !this.contactUSDetail;
  }

  tradeAccount(){
    window.open("https://trade.tradelink.com.au/about-us/online-account-application", "_blank");
  }

}

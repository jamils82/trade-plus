import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { LogoutService } from 'src/app/core/service/logout.service';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ShareEvents } from 'src/app/shared/shareEvents.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-m-header',
  templateUrl: './m-header.component.html',
  styleUrls: ['./m-header.component.scss']
})
export class MHeaderComponent implements OnInit {
  isMobile: boolean = false;
  openMenu: boolean = false;
  openAccountsBurger: boolean = false;
  openMenubg: boolean = false;
  openSearch: boolean = false;
  searchVal: any;
  constructor(private auth: AuthService, @Inject(DOCUMENT) private doc: Document,
    private http: HttpClient, private shareEvents: ShareEvents,
    private logoutService: LogoutService) { }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.shareEvents.contactCustomerServicePopupMobileReceiveEvent().subscribe(() => {
      this.bgClick();
    });
    this.shareEvents.mobileProductSearchSidePanelSubjectReceiveEvent().subscribe(() => {
      this.bgClick();
    });
    this.shareEvents.mobileHamburgerMenuSubjectReceiveEvent().subscribe(() => {
      this.bgClick();
    });

  }

  searchtext(e) {
    this.searchVal = e;
  }

  menuClick() {
    this.openMenu = !this.openMenu;
    this.openMenubg = !this.openMenubg;
  }

  openAccountMenuIcon() {
    this.openAccountsBurger = !this.openAccountsBurger;
    this.openMenubg = !this.openMenubg;
  }

  openProductSearch() {
    this.openMenubg = !this.openMenubg;
    this.openSearch = !this.openSearch;
    this.openMenu = !this.openMenu;
  }

  bgClick() {
    this.openMenubg = !this.openMenubg;
    this.openAccountsBurger = false;
    this.openMenu = false;
    this.openSearch = false;
  }

  logout() {
    // const logoutURL = this.doc.location.origin;
    // localStorage.clear();
    // sessionStorage.clear();
    // let headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   'Authorization': 'Bearer ' + localStorage.getItem('accessTokenVal')
    // });
    // const formVal = {
    //   "client_id": "FB_OauthClient",
    //   "client_secret": "secret",
    //   "token": localStorage.getItem('accessTokenVal'),
    //   "token_type_hint": "access_token"

    // }
    // this.http.post(environment.siteUrl + 'authorizationserver/oauth/revoke', formVal, { headers: headers }).subscribe(
    //   res => {
    //     const response = res;
    //   }
    // );
    // this.auth.logout({ returnTo: logoutURL });
    this.logoutService.logoutRevoke().subscribe(() => {  
     // this.auth.logout({ returnTo: environment.UIsiteURl + '/login' });
      this.auth.logout({ returnTo: environment.UIsiteURl + '/tlAuthLandingPage' });
      sessionStorage.clear();
      localStorage.clear();
    })
  }
}

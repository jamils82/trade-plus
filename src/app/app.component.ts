import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterEvent } from '@angular/router';
import {
  AuthService,
  RoutingService,
  AuthStorageService,
  AuthToken,
  PageMetaService,
} from '@spartacus/core';
import { async, Observable, Subscription } from 'rxjs';
import { Auth0TokenService } from 'src/app/core/service/token.service';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'tradelink';
  // private subscription = new Subscription();
  getToken$: Observable<AuthToken>;
  disablePricing: boolean;
  disableViewOrders: boolean;
  disableQuotes: boolean;
  disablePayments: boolean;
  breadcrumb$: Observable<any> = this.pageMetaService.getMeta();
  currentUrl: string;
  previousUrl: any;
  constructor(
    private router: Router,
    private routingService: RoutingService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    private auth0TokenService: Auth0TokenService,
    private authStorageService: AuthStorageService,
    private pageMetaService: PageMetaService,

  ) {}

  async ngOnInit() { 
    const url = window.location.href;
    this.router.events.subscribe(() => {
      if (url.includes('/p/')) {
        window.console.error = () => {};
        window.console.error = function () {};
        console.error = function () {};
      }
      if (url.includes('/product/')) {
        window.console.error = () => {};
        window.console.error = function () {};
        console.error = function () {};
      }
      if (url.includes('/c/')) {
        window.console.error = () => {};
        window.console.error = function () {};
        console.error = function () {};
      }
      if (url.includes('/search/')) {
        window.console.error = () => {};
        window.console.error = function () {};
        console.error = function () {};
      }
    });
    if (url.includes('/linkAccount')) {
      let accountCount = 0;
      let data = JSON.parse(localStorage.getItem('userInfo'));
      if (data != undefined) {
        if (data?.orgUnit?.children && data?.orgUnit?.children?.length > 0) {
          data?.orgUnit?.children.forEach((element) => {
            if (element.selected == true) {
              accountCount += 1;
            }
          });
          if (accountCount > 0) {
            this.router.navigate(['/']);
          }
        }
      }
    }
    this.breadcrumb$.subscribe((data) => {
      data?.breadcrumbs?.forEach((element) => {
        element.label = element.label.toLowerCase();
      });
      data.title = data?.title?.toLowerCase();
      if (
        data?.breadcrumbs[0]?.label == 'Home' ||
        data?.breadcrumbs[0]?.label == 'home'
      ) {
        data.breadcrumbs[0].label = 'Home Page';
      }
    });
    this.getScreenSize();

    if (this.allowDeepLinkedUrl()) {
      return; // like open in new PDP in new window .
    }
    if (this.auth0TokenService.isTokenAvaiable()) {
      // this.userProfileDetailsService.setCheckPermissions();
      this.loginRegFloanNav();
    } else {
      this.callTokenservice();
    }
  }

  allowDeepLinkedUrl() {
    const currentURL: string = window.location.href;
    let allowFlag: boolean = false;

    if (
      currentURL.includes('/product') ||
      currentURL.includes('/teamManagementPage') ||
      currentURL.includes('/myList')
    ) {
      allowFlag = true;
    }
    return allowFlag;
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
  loginRegFloanNav() {
    let accountCount = 0;
    if (sessionStorage.getItem('initalFlowCheck')) return;
    sessionStorage.setItem('initalFlowCheck', 'true');
    const decodeToken: any = this.auth0TokenService.getDecodeToken();
    // *** have to create decodeToken
    if (decodeToken && !decodeToken.fromSignup && !(window.location.href.includes('/p/')) && !(window.location.href.includes('/search/'))) this.router.navigate(['/']);
    // this.router.navigate(['/checksession'])
    else {
      let data = JSON.parse(localStorage.getItem('userInfo'));
      if (data != undefined) {
        if (data?.orgUnit?.children && data?.orgUnit?.children?.length > 0) {
          data?.orgUnit?.children.forEach((element) => {
            if (element.selected == true) {
              accountCount += 1;
            }
          });
          if (accountCount > 0 && !(window.location.href.includes('/p/')) && !(window.location.href.includes('/search/'))) {
            this.router.navigate(['/']);
          } else if(!(window.location.href.includes('/p/')) && !(window.location.href.includes('/search/'))) {
            this.router.navigate(['/linkAccount']);
          }
        } else {
          this.router.navigate(['/linkAccount']);
        }
      } else {
        this.router.navigate(['/linkAccount']);
      }
    }
  }

  callTokenservice() {
    //this.getToken$ = this.auth0TokenService.getAuth0Token();
    this.getToken$ = this.authStorageService.getToken();
    this.getToken$.subscribe((data) => {
      if (data.access_token) {
        this.auth0TokenService.setDecodeToken(data);
        let token = data.access_token; //'tonpkRz63W_iyFoveyDtDF6iA_Q';
        localStorage.setItem('token', token);
        // const decoded = jwtDecode<JwtPayload>(token); // Returns with the JwtPayload type
        // localStorage.setItem('regflow', decoded['https://tradelink-b2b-dev.com.au/fromSignup']);
        this.loginRegFloanNav();
      }
    });
  } //

  getScreenSize() {
    const browserZoomLevel = window.devicePixelRatio;

    // if (browserZoomLevel > 1) {

    document.querySelector('body')?.classList.add('appScaleLevel');

    // }
  }
}

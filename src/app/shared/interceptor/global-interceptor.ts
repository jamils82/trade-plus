import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
//import { AuthService } from '@spartacus/core';
// import { AuthService } from '@auth0/auth0-angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import { LogoutService } from 'src/app/core/service/logout.service';
import { Auth0TokenService } from 'src/app/core/service/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  accessToken: any;
  idToken: string = null;
  accessValue: any;
  idValue = [];
  emailValue: any;
  currentTime: any;
  branchDetails: any;
  branchId: any;
  homeBranchInfoDetails: any;
  ASMAgentLoggedIn: boolean = false;
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private http: HttpClient,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private oAuthService: OAuthService,
    private logoutService: LogoutService,
    private auth0TokenService: Auth0TokenService
  ) {}
  //isLoggedIn: Observable<boolean> = this.authService.isUserLoggedIn();
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let auth0AccessToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
    this.branchDetails = JSON.parse(localStorage.getItem("branchDetails"));
    this.homeBranchInfoDetails = JSON.parse(localStorage.getItem("homeBranchInfo"));
    if(request.url.includes('products/search') && request.url.includes('&query=')) {
      let searchVal: any = request.url.split('&query=',);
      sessionStorage.setItem('searchInputValue', searchVal[1].split('&')[0]);
    }
    // Session expired check the URL and Clear local storage
    if (request.url.includes('/logout')) {
      // if (auth0AccessToken.token.access_token !== null && auth0AccessToken.token.access_token !== undefined &&
      //  sessionStorage.getItem('logoutButn') !== 'true') {
      this.logoutService.logoutRevoke().subscribe((res) => {
        //this.auth.logout({ returnTo: environment.UIsiteURl + '/login' });
        sessionStorage.clear();
        localStorage.clear();
        // window.location.href = environment.auth0Domain + "/logout";
        // clearSession();
      });
      // }
      // else {
      //   window.location.href = environment.auth0Domain + "/logout";
      //  clearSession();
      //  }
    }
    const prodSearchNewURL = (this.get_br_uid_cookie() && this.get_br_uid_cookie().length > 1) ? '&_br_uid_2=' + this.get_br_uid_cookie() : '';
    // alert("intetcepor token " + localStorage.getItem('token'))
    // !request.url.includes('cms')&&
    //!request.url.includes('consenttemplates')

    // changing lang=en for product search in header
    // if (
    //   request.url.includes('/products/suggestions') ||
    //   request.url.includes('/products/search')
    // ) {
    //   const newRequest = request.clone({
    //     url: request.url + '&lang=en',
    //   });
    //   return next.handle(newRequest);
    // }

    // if(this.branchDetails !== null){
    //   this.branchId = this.branchDetails.branchID;
    // }
    // else {
    //   this.branchId = this.homeBranchInfoDetails.branchID;
    // }
    //  if(request.url.includes('/logout')){
    //   const newRequest = request.clone({
    //     setHeaders: {
    //       fbLogin: 'auth0',
    //       Authorization: `Bearer ${this.auth0TokenService.getAccessTokenFromLS()}`,
    //       // branchId: this.branchDetails != null? this.branchDetails.branchID : this.homeBranchInfoDetails.branchID
          

    //     },
    //   });
    //   return next.handle(newRequest);
    // }

    // changing lang=en for product search in header
    if (request.url.includes('/products/suggestions') || request.url.includes('/products/search')) {
      const newRequest = request.clone({
      url: (prodSearchNewURL.length > 1) ? request.url + prodSearchNewURL : request.url,
      setHeaders: {
        fbLogin: 'auth0',
        Authorization: `Bearer ${this.auth0TokenService.getAccessTokenFromLS()}`,
        branchName: this.branchDetails != null? this.branchDetails.name : this.homeBranchInfoDetails.name
      },
      })
        return next.handle(newRequest);
     }
    if(request.url.includes('/mylist/getMyList') ||
    request.url.includes('/listofinvites') ||
    request.url.includes('/orders') ||
    request.url.includes('/carts/') ||
    request.url.includes('/addProducts') ||
    request.url.includes('/addProductsToQuote') ||
    request.url.includes('/products/*') ||
    request.url.includes('/products/search')){
      const newRequest = request.clone({
        setHeaders: {
          fbLogin: 'auth0',
          Authorization: `Bearer ${this.auth0TokenService.getAccessTokenFromLS()}`,
          branchName: this.branchDetails != null? this.branchDetails.name : this.homeBranchInfoDetails.name
        },
      });
      return next.handle(newRequest);
    }

    // **** Bloomreach Pixel
    if(request.url.includes('/products/search')) {
      const newRequest = request.clone({
        url: (prodSearchNewURL.length > 1) ? request.url + prodSearchNewURL : request.url,
        setHeaders: {
          fbLogin: 'auth0',
          Authorization: `Bearer ${this.auth0TokenService.getAccessTokenFromLS()}`,
          branchName: this.branchDetails != null? this.branchDetails.name : this.homeBranchInfoDetails.name
        },
      });
      return next.handle(newRequest);

    }

    const hardToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJwTXFHdERzbklqaHpIcFNLZDdJaSJ9.eyJodHRwczovL3RyYWRlbGluay1iMmItZGV2LmNvbS5hdS9lbWFpbCI6InZhcmF0aGFyYWphbi5zQHJveWFsY3liZXIuY29tIiwiaHR0cHM6Ly90cmFkZWxpbmstYjJiLWRldi5jb20uYXUvZnJvbVNpZ251cCI6dHJ1ZSwiaHR0cHM6Ly90cmFkZWxpbmstYjJiLWRldi5jb20uYXUvcGhvbmVOdW1iZXIiOiIrOTE5ODQxMjk1MTQxIiwiaHR0cHM6Ly90cmFkZWxpbmstYjJiLWRldi5jb20uYXUvc3VybmFtZSI6IlJhamFuIiwiaHR0cHM6Ly90cmFkZWxpbmstYjJiLWRldi5jb20uYXUvZmlyc3ROYW1lIjoidmFyYXRoYU5ldyIsImlzcyI6Imh0dHBzOi8vdHJhZGVsaW5rLWIyYi1kZXYuYXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYxMjhiZTVhYTIxYzczMDA2OTBmNjRkOCIsImF1ZCI6WyJodHRwczovL3RyYWRlbGluay1iMmItZGV2LmF1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly90cmFkZWxpbmstYjJiLWRldi5hdS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjMwMDYwMTg3LCJleHAiOjE2MzAxNDY1ODcsImF6cCI6IlNoN0I3S2FYWWc1Sk1xMDJKQTd5YVd4M3RsaG1RVDhLIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyJ9.YHvg7Kl1kPJKpvrbyklAAg2Xk-u4i2qGCpTE_RSr4IGH90FiaTst1UcUxnxb__hqZi2koqivRuocxw49ySwGgKA8a30fURPB5wYzm000KmtrBy3d0cLiow2RfAG7dwRqaEZudms0aqZCbPA8K6rNcnp-Ody7MZu8l75bQkfItazpA9hBCIeeuFi4_X9JCQ2xvZikjgHR2-y1NLqNu5pddQvPbWSIH6Tc2Eug56IQ6_mYjKe-67jt1MhgUU4ckPDaPy-Fx7J1tJf6FhOF5T0Uo2KFqbT4vbo-kUhsajnWdmzVDEdvFnrxwbVSbqeV19sTQ5xObB7JzFJ8x1-kMyQJcw';
    if (
      !request.url.includes('/oauth/token') &&
      !request.url.includes('/logout') &&
      !request.url.includes('/api.npms') &&
      !request.url.includes('cms') &&
      !request.url.includes('stores(currencies') &&
      !request.url.includes('api/geocode') &&
      !request.url.includes('api-uat.corelogic.asia')
    ) {
      const newRequest = request.clone({
        setHeaders: {
          fbLogin: 'auth0',
          Authorization: `Bearer ${this.auth0TokenService.getAccessTokenFromLS()}`,
          // branchId: this.branchDetails != null? this.branchDetails.branchID : this.homeBranchInfoDetails.branchID
        },
      });
      return next.handle(newRequest);
    }
     else if(request.url.includes('stores?currentPage')) {
      const newRequest = request.clone({
        setHeaders: {
          fbLogin: 'auth0',
          Authorization: `Bearer ${this.auth0TokenService.getAccessTokenFromLS()}`,
          // branchId: this.branchDetails != null? this.branchDetails.branchID : this.homeBranchInfoDetails.branchID
          

        },
      });
      return next.handle(newRequest);
    }
    
     else if (request.url.includes('api-uat.corelogic.asia')) {
      return next.handle(request);
    } else {
      const newRequest = request.clone({
        headers: request.headers.delete('Authorization'),
      });
      return next.handle(newRequest);
    }
  }
  public get_br_uid_cookie():string{
    let _br_cookie = document.cookie;
    let br_val = '';
    if(_br_cookie && _br_cookie.length > 0 && _br_cookie.includes('_br_uid_2=')){
    const _br_split = _br_cookie?.split('_br_uid_2=');
    let _br_uid_2 = _br_split[1]?.split(';')
    br_val= (_br_uid_2[0]) ? _br_uid_2[0] : null;
    }
    return br_val;
  }
}
function clearSession() {
  sessionStorage.clear();
  localStorage.clear();
  // window.location.href = environment.auth0Domain + "/logout";

  //  let logInTime = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
  //  let afterLoginTime = Math.floor(new Date().getTime()/1000.0 + 2*60000);
  // // alert((afterLoginTime-this.currentTime)/60)
  //   if(logInTime.token.access_token_stored_at < afterLoginTime) {
  //       window.location.href = environment.UIsiteURl + "/login";
  //    }
  setTimeout(() => {
    // window.location.reload();
    window.location.href = environment.UIsiteURl + '/login';
  }, 300);
}

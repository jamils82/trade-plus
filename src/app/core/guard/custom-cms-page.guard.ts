import { Inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@spartacus/core';
import { Auth0TokenService } from 'src/app/core/service/token.service'

@Injectable({
  providedIn: 'root',
})
export class customCmsGaurd implements CanActivate {
  userUid: string;
  isAdmin: boolean = false;
  private subscription = new Subscription();
  accessTokenVal: any;
  constructor(private router: Router, private auth: AuthService,
    @Inject(DOCUMENT) private doc: Document, private activatedRoute: ActivatedRoute,
    private auth0TokenService: Auth0TokenService,) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const tokenFromLS: any = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'))
    // *** have to create decodeToken 
    this.auth0TokenService.setDecodeToken(tokenFromLS.token);
    const signFlag: any = this.auth0TokenService.getDecodeToken()
    // alert("decodeToken.fromSignup from guard >> " + signFlag);
    if (signFlag && !signFlag.fromSignup) {
      //this.router.navigate(['/'])
      return true
    }
    this.router.navigate(['/linkAccount'])
    return true;

  }
}

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

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  userUid: string;
  isAdmin: boolean = false;
  private subscription = new Subscription();
  accessTokenVal: any;
  constructor(private router: Router, private auth: AuthService,
    @Inject(DOCUMENT) private doc: Document, private activatedRoute: ActivatedRoute) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    let auth0AccessToken = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'));
    if (auth0AccessToken.token.access_token !== null && auth0AccessToken.token.access_token !== undefined) {
      return true
    }
    else {

    }

  }
}

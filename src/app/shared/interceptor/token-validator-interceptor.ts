import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, finalize, filter, take, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OAuthEvent,EventType ,OAuthSuccessEvent,OAuthService } from 'angular-oauth2-oidc';
import { AuthConfigService, OAuthLibWrapperService } from '@spartacus/core';
import { AuthService } from '@auth0/auth0-angular';


@Injectable()
export class TokenValidator implements HttpInterceptor {

//   private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor( private router: Router,
   private authConfigService:AuthConfigService,
   private auth: AuthService,) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {


    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      if (error && error.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
       // this.auth.logout({ returnTo: environment.UIsiteURl + '/login' });
        this.auth.logout({ returnTo: environment.UIsiteURl + '/tlAuthLandingPage' });
       
      //   if (request.url.includes('/revoke')){
      //      // *** click on logout if the token expired
      //    this.auth.logout({ returnTo: environment.UIsiteURl + '/login' });
      //   }
      //   else
      //   {
      //    //  *** Slient login if token Expired .
      //    window.location.href = environment.UIsiteURl + "/login";
      //   }

   //   
        

      }
      return throwError(error);
    }));
  }

  
}

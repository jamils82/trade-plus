import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of ,EMPTY} from 'rxjs';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable()
export class RidirectionInterceptor implements HttpInterceptor {
  constructor(private router: Router){
    this.router.events.subscribe((event:Event)=>{
      if (event instanceof NavigationStart) {
        const qUlr:string = event.url
        let qUrlSplitArr:any = qUlr.split("/");

        if(event.url.indexOf("/search/")>-1){
          const pdpURL = "/p/"+String(qUrlSplitArr[2]).trim()
          this.router.navigate([pdpURL])
        }
        else if (event.url.indexOf("Open-Catalogue") >-1){ // Open-Catalogue/Cameras/Digital-Cameras/c/575
         //window.location.href = acceleratorURL +event.url ;
          //return EMPTY ;
        }
       
    }
    }
    ) 
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const acceleratorURL:String = "https://electronics.royalcyber.org/electronics-spa/en/"

    const checkLogin = JSON.parse(localStorage.getItem(' spartacus-local-data'));
   //  if(request.url.indexOf('CategoryPage')>1){
  //   // category Page Redirection 
  //   return EMPTY ;
  // }

    
    return next.handle(request);
   
  }
 

}


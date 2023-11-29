import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse }   from '@angular/common/http';
import { Injectable } from "@angular/core"
// import { platform } from 'os';
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
@Injectable()
export class RespModiInterceptor implements HttpInterceptor {
    constructor() {}
intercept(
        req: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>> {
         
        return next.handle(req).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse && req.url.includes('SPECIFICATIONS')) {
                    
                  

                   // evt.body  = phpCms;
                    let resBody:any  =  evt.body 
                    evt.body.classifications = [evt.body] //phpCms                    
                  //   alert("got CategoryPage response")
                }
                
            
           // new HttpResponse({ status: 200, body:resBody})


               
            }),
            // catchError((err: any) => {
            //     if(err instanceof HttpErrorResponse) {
            //         try {
            //             this.toasterService.error(err.error.message, err.error.title, { positionClass: 'toast-bottom-center' });
            //         } catch(e) {
            //             this.toasterService.error('An error occurred', '', { positionClass: 'toast-bottom-center' });
            //         }
            //         //log error 
            //     }
            //     return of(err);
             //})
             );
    
      }
      
}

const phpCms =  [ 
    {
       "code" : "622",
       "features" : [ 
           {
          "code" : "ElectronicsClassification/1.0/622.resolution, 80",
          "comparable" : true,
          "featureUnit" : {
             "name" : "pixels2",
             "symbol" : "pixels 3",
             "unitType" : "39"
          },
          "featureValues" : [ {
             "value" : "<b>Brown1</b> "
          } ],
          "name" : "Clolour",
          "range" : false
       }, {
          "code" : "ElectronicsClassification/1.0/622.source data-sheet, 6617",
          "comparable" : true,
          "featureUnit" : {
             "name" : ".",
             "symbol" : ".",
             "unitType" : "300"
          },
          "featureValues" : [ {
             "value" : "Acacia Panel Brown FSC Oliled"
          } ],
          "name" : "Model Name",
          "range" : false
       }, {
          "code" : "ElectronicsClassification/1.0/622.type, 31",
          "comparable" : true,
          "featureUnit" : {
             "name" : ".",
             "symbol" : ".",
             "unitType" : "12345"
          },
          "featureValues" : [ {
             "value" : "Digital camera"
          } ],
          "name" : "Model Number",
          "range" : false
       }, {
          "code" : "ElectronicsClassification/1.0/622.photo mode, 1817",
          "comparable" : true,
          "featureUnit" : {
             "name" : ".",
             "symbol" : ".",
             "unitType" : "inner copper material "
          },
          "featureValues" : [ {
             "value" : "3-2"
          } ],
          "name" : "Inner Material ",
          "range" : false
       } ],
       "name" : ""
    }, 
    
   
 ]
 
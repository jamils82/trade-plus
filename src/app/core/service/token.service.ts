// varatha
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import {AUTH0_GET_TOKEN} from "./endPointURL";
import { environment } from "src/environments/environment"
import { AuthToken,AuthStorageService} from '@spartacus/core';
import jwtDecode, { JwtPayload } from "jwt-decode";

@Injectable()
export class Auth0TokenService {
    constructor(private http: HttpClient , private authStorageService:AuthStorageService) { }
 

    protected _token$: Observable<AuthToken> = new BehaviorSubject<AuthToken>(
        {} as AuthToken
      );

      protected _decodeToken:any =null;

      getDecodeToken():any{
        return this._decodeToken ;

      }

      isTokenAvaiable():boolean{
        if(localStorage.getItem('spartacus⚿⚿auth')){
          const tokenFromLS:any = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'))
          const auth0AccessToken = tokenFromLS.token
          
          // ** decode token present 
          if(!this._decodeToken){
            this.setDecodeToken(auth0AccessToken)
          }
        return (auth0AccessToken.access_token)?true:false;
        }
        return false;
        
      }
      getAccessTokenFromLS():String{
        //  ** need to optimize ...
        const tokenFromLS:any = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'))
        const auth0AccessToken = tokenFromLS.token
        return (auth0AccessToken.access_token)
      }

      getAuth0Token(): Observable<AuthToken> {
      
        return this._token$;
      }
    
      setDecodeToken(token: AuthToken):void{
       
        if(token.access_token){
          const decoded = jwtDecode<JwtPayload>(token.access_token);
          let tokenTemp:any = {email:"",fromSignup:"",phoneNumber:"",surname:"",firstName:""};
          tokenTemp.email = decoded[`${environment.authoTenent}/email`] ;
          tokenTemp.fromSignup = decoded[`${environment.authoTenent}/fromSignup`];
          tokenTemp.phoneNumber = decoded[`${environment.authoTenent}/phoneNumber`];
          tokenTemp.surname = decoded[`${environment.authoTenent}/surname`];
          tokenTemp.firstName = decoded[`${environment.authoTenent}/firstName`];
          localStorage.setItem('fromSignup',  tokenTemp.fromSignup);
          this._decodeToken = tokenTemp
          
        }


      }
      /**
       * Set current value of token.
       *
       * @param token
       */
      setToken(token: AuthToken): void {
        this.setDecodeToken(token);
         this.authStorageService.setToken(token);
          // ** update in LocalSession Storage 
         // localStorage.setItem("spartacus⚿⚿auth", JSON.stringify(token)) ;
        
        
        (this._token$ as BehaviorSubject<AuthToken>).next(token);
      }
    


    public getAuthTokenCustom(code: string, accessCode:string): Observable<any> {
    let auth0ReQ:any  = {}
    const authFromLS:any = JSON.parse(localStorage.getItem("spartacus⚿⚿auth"))
    let  code_verifier:string
if(authFromLS && authFromLS.token){
    //        // auth0ReQ.code = code  = authFromLS.token.nonce
        code_verifier = authFromLS.token.PKCE_verifier ;
          }

   const reqObj =  {"client_id":"YlFbITrwE0HUcH3tBih0qN9YO7iONopT",
                    "client_secret":"g5-jBWwHhehDZevW_f3YHCCDnaoQTxu7nqlKFk5xEx895YtWiUBP3cKAxinsraz9",
                    "audience":"https://tradelink-b2b-dev.au.auth0.com/api/v2/",
                    "grant_type":"client_credentials"
                    }

                    auth0ReQ.client_id =  environment.auth0Client_id
                    auth0ReQ.client_secret =  environment.auth0Client_secret
                   // auth0ReQ.audience = "https://tradelink-b2b-dev.au.auth0.com/api/v2/"
                     auth0ReQ.code = code ;
                    auth0ReQ.redirect_uri = environment.UIsiteURl
                   // auth0ReQ.code_verifier = code_verifier;
                    auth0ReQ.grant_type = "authorization_code"
                    //***   useHttpBasicAuth :true commented
                   // auth0ReQ.audience = environment.auth0Audience
                    

                    // auth0ReQ.client_id = environment.auth0Client_id
                    // auth0ReQ.client_secret = environment.auth0Client_secret
                    // auth0ReQ.audience = environment.auth0Audience
                    // auth0ReQ.grant_type = "client_credentials"

        //let result: Observable<any> = new Observable<any>();
        let url = AUTH0_GET_TOKEN.url;
        return this.http.post(url, auth0ReQ, {
             headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                map((token: AuthToken) => this.setToken(token)),
                catchError(errorRes => {
                    return throwError(errorRes);
                }),

            );
       // return this.setToken();
    }
}
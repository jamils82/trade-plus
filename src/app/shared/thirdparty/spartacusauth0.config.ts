import { NgModule } from '@angular/core';
import { AuthConfig, provideConfig,ClientAuthenticationTokenService } from '@spartacus/core';
import { environment } from 'src/environments/environment';
import { OAuthEvent,EventType ,OAuthSuccessEvent } from 'angular-oauth2-oidc';
import {Auth0TokenService} from 'src/app/core/service/token.service'


//let responseVal ='code' //code token
const tokenFromLS:any = localStorage.getItem('spartacus⚿⚿auth')
let access_token:string =null ; 

if(tokenFromLS){
  const tokenFromLS:any = JSON.parse(localStorage.getItem('spartacus⚿⚿auth'))
  const token = tokenFromLS.token
  access_token = (token.access_token)?token.access_token:null;
}

let responseVal;
if (!access_token &&  !(window.location.pathname.includes('/linkAccount'))) {
  responseVal = 'code'
  if (!(window.location.href.includes('code=')) 
  && !(window.location.pathname.includes('/tlAuthLandingPage')) 
  && !(window.location.href.includes('linkAccount'))
  && !(window.location.href.includes('access_token'))) {
   // window.location.href = environment.UIsiteURl + "/login";
    window.location.href = environment.UIsiteURl + "/tlAuthLandingPage";
  }
}
else {
  responseVal = ''
}

// OAuthLibConfig: {
//   responseType: responseVal,
//   redirectUri: environment.UIsiteURl,
//   disablePKCE: false,
//   useHttpBasicAuth: true,
//   scope: 'openid profile email',
//   useIdTokenHintForSilentRefresh: true,
//   customQueryParams: {
//     audience: environment.auth0Audience,
//     response_mode: 'query'
//   }
// }

@NgModule({
  imports: [],
  exports: [],
  providers: [
    provideConfig(<AuthConfig>{
      authentication: {
        OAuthLibConfig: {
          responseType: responseVal,
          redirectUri: environment.UIsiteURl ,//+"/callback",
         // disablePKCE: false,
         // useHttpBasicAuth: true,
          scope: window.location.href.includes('?asm=true') ? 'basic' : 'openid profile email offline_access',
          useIdTokenHintForSilentRefresh: true,
          customQueryParams: {
            audience: environment.auth0Audience,
            response_mode: 'query',   
            requestType: localStorage.getItem("Login")
          }
        },
        baseUrl: window.location.href.includes('?asm=true') ? environment.siteUrl.slice(0, -1) : environment.auth0Domain,
        client_id: window.location.href.includes('?asm=true') ? 'asm' : environment.auth0Client_id,
        client_secret: window.location.href.includes('?asm=true') ? 'secret' : environment.auth0Client_secret,
        tokenEndpoint: window.location.href.includes('?asm=true') ? 'authorizationserver/oauth/token' : '/oauth/token',
        revokeEndpoint: 'v2/logout',
        userinfoEndpoint: '/userinfo',
        loginUrl: '/authorize',
      }
    }),
  ]

})

export class SpartacusAuth0ModuleConfig { 

  constructor(private auth0TokenService: Auth0TokenService, 
    private clientAuthenticationTokenService:ClientAuthenticationTokenService) {
    if(window.location.href.includes('code=')){
    
      const urlParams:any = new URLSearchParams(window.location.search);
      let queryArr:any =[];
     
      for (const [key, value] of urlParams) {
        queryArr.push(value)
    }
    //alert(queryArr);
    
      //this.clientAuthenticationTokenService.loadClientAuthenticationToken().subscribe();
      // this.auth0TokenService.getAuthTokenCustom(queryArr[0],queryArr[1]).subscribe(data=>{
      //  });
    }

    }

}
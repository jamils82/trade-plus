import { NgModule } from '@angular/core';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';


@NgModule({
  imports: [
    // For prod uncomment below code
    AuthModule.forRoot({
      // domain: environment.auth0Domain,
      // clientId: environment.auth0ClientID,
      // audience: 'https://fi-dev.au.auth0.com/api/v2/',
      // redirect_uri: environment.UIsiteURl
      domain: environment.logoutAuth0Domain,
      clientId: environment.auth0Client_id,
      audience: environment.auth0Audience,
      redirect_uri: environment.UIsiteURl
    })
  ],
  exports: [
    AuthModule
  ]

})

export class Auth0ModuleConfig { }
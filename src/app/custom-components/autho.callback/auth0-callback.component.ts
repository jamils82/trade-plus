import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { CreateAccountService } from 'src/app/core/service/createAccount.service';

@Component({
  selector: 'app-auth0-callback',
  templateUrl: './auth0-callback.component.html',
  styleUrls: ['./auth0-callback.component.scss']
})
export class Auth0CallbackComponent  implements OnInit {


  ngOnInit(){
    
  }
  
}

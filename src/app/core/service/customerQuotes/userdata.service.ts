import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { GET_USER, GET_USER_CART } from '../endPointURL';
import { DataService } from './data.service';
import { AccountDataService } from './accountdata.service';
//import { OAuthService } from 'src/app/shared/customerQuotes/oauth/outh.service';
import { RoutingService } from '@spartacus/core';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  
  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private accountDataService: AccountDataService,
   // private oAuthService: OAuthService,
    private routingService: RoutingService,
  ) { }



  getUserData() {
    this.getUserDataService().subscribe(res => {

      this.dataService.userTradeData = res;
      this.dataService.selectedTradeAcc = res.lastSelectedTradeAccount;
      let selectedTradeAcc = res.lastSelectedTradeAccount;
      let selectedJobAcc = '';
      let branchCode = '';
      if (res.lastSelectedJobAccount != undefined && res.lastSelectedJobAccount != null) {
        this.dataService.selectedJobAcc = res.lastSelectedJobAccount;
        selectedJobAcc = res.lastSelectedJobAccount;
      }
      let currentSelectedTradeAcc = localStorage.getItem('selectedTradeAccount');
      let currentSelectedJobAcc = localStorage.getItem('selectedJobAccount');
      localStorage.setItem('selectedTradeAccount',selectedTradeAcc);
      localStorage.setItem('selectedJobAccount',selectedJobAcc);

      let userAccountData = res.companies;
      let tradeAcc: any[] = [];

      userAccountData.map((item: any) => {
        if (item.tradeAccounts) {
          item.tradeAccounts.map((child: any) => {
            tradeAcc.push(child);
          });
        }
      });

      if ((currentSelectedTradeAcc != selectedTradeAcc || currentSelectedJobAcc != selectedJobAcc) && currentSelectedTradeAcc != null) {
        this.routingService.go('/quotes');
      }

        this.accountDataService.tradeAccountList = tradeAcc.sort((a, b) => a.branch.name.localeCompare(b.branch.name));
        branchCode = this.accountDataService.tradeAccountList.filter((list: any) => list.uid == this.dataService.userTradeData.lastSelectedTradeAccount)[0].branch.branchCode;
        let branchName = this.accountDataService.tradeAccountList.filter((list: any) => list.uid == this.dataService.userTradeData.lastSelectedTradeAccount)[0].branch.name;
        localStorage.setItem('branchCode',branchCode);
        localStorage.setItem('branchName',branchName);
      
      //this.getUserPermissions(this.dataService.selectedTradeAcc);
      if (!localStorage.getItem('spartacus⚿⚿auth')?.includes('access_token')) {
        //this.oAuthService.silentUserLogin(); 
      } else {
        this.accountDataService.getSelectedTradeAcc();
      }

    });
  }

  getUserDataService(): Observable<any> {
    let apiUrl = GET_USER.url;
    let params = new HttpParams();
    let headers = new HttpHeaders({
        'hybrisToken': localStorage.getItem('hybrisToken') || '',
        'email': localStorage.getItem('email') || '',
        'Authorization': 'bearer '+localStorage.getItem('userToken') || '{}',
    });

    params = params.set("userId", localStorage.getItem('email') || '');
    params = params.set("fields", 'FULL');

    return this.http.get<any>(apiUrl, {headers, params: params});
  }

  getUserCurrentCart(): Observable<any> {
    let apiUrl = GET_USER_CART.url;
    let email = localStorage.getItem('email');
    let params = new HttpParams();
    params = params.set("fields", 'FULL');

    return this.http.get<any>(apiUrl, {params: params});
  }
  
}

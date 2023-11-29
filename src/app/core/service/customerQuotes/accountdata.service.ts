import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { GET_JOB_ACC_FOR_TRADE_ACC, GET_USER } from '../endPointURL';
import { DataService } from './data.service'

@Injectable({
  providedIn: 'root'
})
export class AccountDataService {

  tradeAccountList: any;
  jobAccountList: any;
  
  constructor(
    private http: HttpClient,
    private dataService: DataService
  ) { }

  getJobAccountList(tradeAcc: any) {
    this.jobAccountList = [];
    this.getJobAccForTradeAcc(tradeAcc).subscribe(res => {
        if (res.customer.jobs != undefined) {
          this.dataService.selectedJobAcc = '';
          this.jobAccountList = res.customer.jobs;
        } 
        if (this.jobAccountList != undefined) {
          this.dataService.selectedJobAcc = this.jobAccountList.filter((list: any) => list.jobId == this.dataService.userTradeData.lastSelectedJobAccount);
        }
    });
  }

  getJobAccForTradeAcc(tradeAcc: any): Observable<any> {
    let apiUrl = GET_JOB_ACC_FOR_TRADE_ACC.url;
    let email = localStorage.getItem('email');

    return this.http.get<any>(apiUrl+'/'+email+'/'+tradeAcc+'/jobaccounts');
  }


  getSelectedTradeAcc() {
    if (this.tradeAccountList != undefined) {
      this.dataService.selectedTradeAcc = this.tradeAccountList.filter((list: any) => list.uid == this.dataService.userTradeData.lastSelectedTradeAccount)[0];
    }
    if (this.dataService.selectedTradeAcc != undefined) {
      this.getJobAccountList(this.dataService.selectedTradeAcc.uid);
    }
  }

  setSelectedTradeAcc(tradeAcc: any): Observable<any> {
    let apiUrl = GET_USER.url;
    return this.http.get<any>(apiUrl+'/'+localStorage.getItem('email')+'/changetrade?accountId='+tradeAcc.uid);
  }

  setSelectedJobAcc(jobAcc: any): Observable<any> {
    let apiUrl = GET_USER.url;
    let jobId = jobAcc.jobId != undefined ? jobAcc.jobId : '';
    return this.http.get<any>(apiUrl+'/'+localStorage.getItem('email')+'/changjob?jobId='+jobId);
  }

}
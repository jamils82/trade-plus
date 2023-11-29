import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  userData: any;
  userTradeData: any;
  selectedTradeAcc: any;
  selectedJobAcc: any;
  userPermissions: any;
  showPage = false;
  searchCompUid: any;
  currentQuoteId: any;
  currentJobDetails:any;
  currentStageId:any;
  private currentJobName = new BehaviorSubject(null);
  updateJobName = this.currentJobName.asObservable();
  
  changeJobname(jobname: any) {
    this.currentJobName.next(jobname)
  }
  
}

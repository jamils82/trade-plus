import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AccountDropDownStateService {
  private _accountState$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private _selectedAccountState$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private navData = new BehaviorSubject<any>('')
  private cartValue = new BehaviorSubject<any>({});
  private sideNavData = new BehaviorSubject<any>([])
  public _previouslyInvoked: any = null;
  isDataAvailable: boolean= false;

  get _getAccountState$(): Observable<any> {
    return this._accountState$.asObservable();
  }

  public setAccountState(data: any): void {
    this._accountState$.next({
      accountData: data
    });
    localStorage.setItem("emailID",data.uid)
    localStorage.setItem("phoneNum",data.phoneNumber);
    this.isDataAvailable = true;
  }

  get _getSelectedAccountState$():   Observable<any> {
    return this._selectedAccountState$.asObservable();
  }

  public setSelectedAccountState(uid: any): void {
    let selectedAccount;
    this._accountState$.subscribe((data) => {
      if (uid == data.accountData.orgUnit.uid && data.accountData.orgUnit.branch) {
        selectedAccount = data.orgUnit;
      }
      else {
        selectedAccount = data.accountData.orgUnit.children.find(x => x.uid === uid);
      }
      this._previouslyInvoked = selectedAccount;
    })
    this._selectedAccountState$.next({
      selectedAccount: selectedAccount
    });
  }

  get previouslySelectedValue(): any {
    return this._previouslyInvoked;
  }

  get getAccountEmailId(){
    return localStorage.getItem("emailID");
  }

  get getAccountPhoneNum(){
    return localStorage.getItem("phoneNum");
  }
  get userdisplayName() {
    var displayName;
    this._accountState$.subscribe((data) => {
      displayName = data.accountData.name;
    });
    return displayName;
  }

  setNavData(message: any) {
    this.navData.next(message)
  }

  getNavData(): Observable<any> {
     return this.navData.asObservable();
  }

  setSideNavData(data: any) {
    this.sideNavData.next(data);
  }

  getSideNavData(): Observable<any> {
    return this.sideNavData.asObservable();
  }

  setCartValue(value: any) {
    this.cartValue.next(value);
  }

  getCartValue(): Observable<any> {
    return this.cartValue.asObservable();
  }
}

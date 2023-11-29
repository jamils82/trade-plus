import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { QuickOrderModel } from 'src/app/custom-components/quick-order/quick-order.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  showWaitCursor = new BehaviorSubject<boolean>(false);
  currentWaitCursorOption = this.showWaitCursor.asObservable();

  RequestIndexQuote: number = 0;
  rows: Array<QuickOrderModel> = new Array();
  quoteData: any;
  checkoutData:any;
  browserUrl: string;
  pageState: any;
  quoteFlag: boolean;
  addressData: any;
  addressValue: any;
  quoteCode:any;
  pageValue: any;
  formData: any
  custId: any;
  mode: boolean;
  uid: any;
  jobId: any;
  linkobj: any;

  constructor(private router: Router) { }


  show() {
    this.showWaitCursor.next(true);
  }

  hide() {
    this.showWaitCursor.next(false);
  }

  setVal(data: any){
    this.rows = data;
    // alert(this.rows);
  }

  getVal(){
    // alert(this.rows)
    return this.rows;
  }
  setData(data: any){
    this.quoteData = data;
  }

  getDta(){
    return this.quoteData;
  }

  setUrl(url: string){
    this.browserUrl = url;
  }

  getUrl(){
    return this.browserUrl;
  }


  setCheckoutData(data:any){
    this.checkoutData = data;
  }

  getCheckoutData(){
  return this.checkoutData;
  }

  setQdpQuoteData(data:any){
    this.checkoutData = data;
  }

  getQdpQuoteData(){
  return this.checkoutData;
  }


  setPage(state: any){
    this.pageState = state;
  }

  getPage(){
    return this.pageState;
  }

  setFlag(flag: boolean){
    this.quoteFlag = flag;
  }

  getFlag(){
    return this.quoteFlag;
  }
  getstatus(){
    return this.quoteFlag;
  }
  setstatus(flag: boolean){
    this.quoteFlag = flag;
  }
  setAddressData(data: any){
    this.addressData = data;
  }

  getAddressData(){
    return this.addressData;
  }

  setAddressVal(data: any){
    this.addressValue = data;
  }
  
  getAddressVal(){
    return this.addressValue;
  }

  setQuoteValue(data:any){
    this.quoteCode = data;
  }

  getQuoteValue(){
    return this.quoteCode;
  }

  setPageVal(val: any){
    this.pageValue = val;
  }

  getPageVal(){
    return this.pageValue;
  }
  setFormData(val: any){
    this.formData = val
  }
  getFormData(){
    return this.formData
  }

  setQlpFlag(val: any){
    this.formData = val
  }
  getQlpFlag(){
    return this.formData
  }

  setUid(val:any){
    console.log(val);
    this.uid = val;
   
  }

  getUid(){
   return this.uid;
  }

  pageRefresh(route: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([`/${route}`]);
  }

  // DataLayer for Home, PLP, Cart, Fulfillment page
  onLoadGTMMethod(pageTypeVal, pageTitleVal, isConversionVal, currentURLVal, catVal?: string, catIdVal?: string) {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
      'pageType': pageTypeVal,
      'pageTitle': pageTitleVal,
      'isConversion': isConversionVal,
      'event': 'PageDetails',
      'currentURL': currentURLVal,
      'isLoggedIn': 'Yes',
      'cat': catVal,
      'catId': catIdVal
      });
  }
  // DataLayer for PDP page
  onLoadPDPGTM(pageTypeVal, pageTitleVal, isConversionVal, currentURLVal, productVal?: string, productIdVal?: string, skuId?: string) {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
      'pageType': pageTypeVal,
      'pageTitle': pageTitleVal,
      'isConversion': isConversionVal,
      'event': 'PageDetails',
      'currentURL': currentURLVal,
      'productId': productVal,
      'productName': productIdVal,
      'sku': skuId
      });
  }
  // DataLayer for search page
  onLoadSearchGTM(pageTypeVal, pageTitleVal, isConversionVal, currentURLVal, searchTermVal: string) {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
      'pageType': pageTypeVal,
      'pageTitle': pageTitleVal,
      'isConversion': isConversionVal,
      'event': 'PageDetails',
      'currentURL': currentURLVal,
      'searchTerm': searchTermVal,
      '_br_uid_2' : (this.get_br_uid_cookie()) ? this.get_br_uid_cookie() : ''
      });
  }
  // Global search Event
  onGlobalSearchClickEventGTM(eventVal?: string, qVal?: string, aqVal?: string) {
    (<any>window).dataLayer = (<any>window).dataLayer || [];
    (<any>window).dataLayer.push({
      'pageType': 'Event',
      'event': eventVal,
      'q': qVal,
      'aq': aqVal,
      });
  }

  public get_br_uid_cookie():string{
    let _br_cookie = document.cookie;
    let br_val = '';
    if(_br_cookie && _br_cookie.length > 0 && _br_cookie.includes('_br_uid_2=')){
    const _br_split = _br_cookie?.split('_br_uid_2=');
    let _br_uid_2 = _br_split[1]?.split(';')
    br_val= (_br_uid_2[0]) ? _br_uid_2[0] : null;
    }
    return br_val;
  }

  setCustId(id: any){
    this.custId = id;
  }
  getCustId(){
    return this.custId;
  }

  setCustMode(edit: boolean){
    this.mode = edit;
  }
  getCustMode(){
    return this.mode;
  }
  setJobId(id: any){
    this.jobId = id;
  }
  getJobId(){
    return this.jobId;
  }
  setLinkValues(obj:any){
    this.linkobj = obj;
  }
  getLinkValues(){
    return this.linkobj;
  }

}

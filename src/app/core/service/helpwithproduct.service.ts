import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ADD_ALL_TO_CART_API, ADD_TO_QUOTE, CLEAR_ALL_CART_API, POST_PRODUCT_INQUIRY } from "./endPointURL";

@Injectable()
export class ProductHelpService {
    constructor(private http: HttpClient) {
    }
private _currentPlpProdList:any;
private _selectedProductCode:any;
private _productCodeinCart:string
private _productCodeinQO:string
    public plpASelectAllChild = new BehaviorSubject<any>(false);

    public sendProductHelpInquiry(noteData: string): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = POST_PRODUCT_INQUIRY.url;
        return this.http.post(url, noteData, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public setUpdatePLPProductArray(prodArray:any):void{
        this._currentPlpProdList = prodArray;
    }

    public getUpdatePLPProductArray():any{

        return  this._currentPlpProdList;
    }

    public updatePLPProItem(item:any):void{
        if(item){
            const foundIndex = this._currentPlpProdList?.findIndex(x => x?.code === item?.code);
            if(item?.quantity)
            {

                this._currentPlpProdList[foundIndex].quantity = item?.quantity;
            }

            if(item?.checkBoxUpdate){
                this._currentPlpProdList[foundIndex].selected = (item?.isChecked)?true:false
            }

        }


    }

    public updateAllPlpProd(isChecked:boolean){

        this._currentPlpProdList.map((item) =>  item.selected = isChecked)

    }

    public generateGAData():Array<any> {
      let allSelecteItemArr = [];
      this._currentPlpProdList.forEach(itemm => {
        if(itemm.selected){
            allSelecteItemArr.push({
            name:itemm.name
            })
        }
    })
    return allSelecteItemArr;
    }

    public generatePlpAddAllItem():Array<any>{
        let allSelecteItemArr = []
        this._currentPlpProdList.forEach(itemm => {
            if(itemm.selected){
                allSelecteItemArr.push({
                productCode:itemm.code,
                quantity:itemm.quantity,
                })
            }
        })
        return allSelecteItemArr;
    }

    setSelectedProductCode(pcode, quantity){

        this._selectedProductCode = {
            "code": pcode,
            "quantity": quantity
        }
    }

    getSelectedProductCode():any{
        // called from list Popup.
        return this._selectedProductCode;
    }

    updateCodeInCart(cartArray:Array<any>){
        let prodCodeList:Array<any> = []
        cartArray.forEach(itemm => {
            prodCodeList.push(itemm.product?.code);
        })

        this._productCodeinCart =  prodCodeList.toString()


    }

    updateCodeInQuickOrder(codeArrStr){
        this._productCodeinQO= codeArrStr
    }

    getProductCodeArrInQuickOrder(){

        return   this._productCodeinQO;
     }
    getProductCodeListinCart(){

       return   this._productCodeinCart;
    }

    getUserID(): string {
        return JSON.parse(localStorage.getItem('userInfo')).email;
      }

    public addAllToCart(data): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = ADD_ALL_TO_CART_API.url + this.getUserID() + '/carts/addProducts?fields=DEFAULT';
        return this.http.post(url, data, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public addProductsToQuote(data): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = ADD_TO_QUOTE.url + this.getUserID() + '/addProductsToQuote' + '?fields=DEFAULT'
        return this.http.post(url, data, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    public clearAllCart(data): Observable<any> {
        let result: Observable<any> = new Observable<any>();
        let url = CLEAR_ALL_CART_API.url + this.getUserID() + '/carts/remove/entries?fields=DEFAULT';
        return this.http.post(url, data, {
            headers: { 'Content-Type': 'application/json' },
        })
            .pipe(
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

}//

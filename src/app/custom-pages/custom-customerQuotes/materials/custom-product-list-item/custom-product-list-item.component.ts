import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/internal/Subscription';
import { quoteConstants } from 'src/app/core/constants/general';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
import { ProductDeletePopupComponent } from './product-delete-popup/product-delete-popup.component';
import { MaterialService } from 'src/app/core/service/customerQuotes/material.service';
import { QuoteStatusUpdatePopupComponent } from '../../quote-status-update-popup/quote-status-update-popup.component';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';


@Component({
  selector: 'app-custom-product-list-item',
  templateUrl: './custom-product-list-item.component.html',
  styleUrls: ['./custom-product-list-item.component.scss']
})
export class CustomProductListItemComponent implements OnInit {
  quoteConstants = quoteConstants;
  modalRef: any;
  updateQtyEntries: any;
  totalPrice: any;
  responseloader=false;
  private subscription = new Subscription();
  constructor(
    public quotesService: QuotesService,
    private ac: ActivatedRoute,
    private modalService: NgbModal,
    private jobDetailService: JobDetailsService,
    private materialService: MaterialService,
    public activeModal: NgbActiveModal,
    private dataService: DataService,

  ) { }

  @Input() product: any;
  @Input() quoteId: any;
  @Input() productType: any;
  qetQuotedId:any;
  qtyValue:any;
  currentqtyValue:any;
  stageId: any;
  ngOnInit(): void {
    // console.log("Products:::", JSON.stringify(this.product))
    // console.log("Length:", this.product.name.length)
    this.qetQuotedId =  this.ac.snapshot.params['id'];
    this.stageId=this.dataService.currentStageId;
  }

  checkQty(e,item: any) {
    let isValidFormat = true;
    if (item.sellOrderMultiple > 0 && item.timberProductFlag) {
      if(e.keyCode < 47 || e.keyCode > 58){
        isValidFormat = false;
      }	else {
       // isValidFormat = this.checkUOMFormat(e, item.uomFormat);
      }
    } else {
    //  isValidFormat = this.checkUOMFormat(e, item.uomFormat);
    }
    
    if(isValidFormat == false){
      return false;
    } else {
      return true;
    }
  }
  qtyKeyup(e) {
    let currentVal = e.target.value;
    if (currentVal.length == 1 && (e.which == 48 || e.which == 96)) {
      currentVal = currentVal.slice(0, -1);
    }
    e.target.value=currentVal
  }
  qtyChange(element,item: any){
    if (this.productType == 'materials') {
      if (this.quotesService.quoteStatus == "PENDING") {  
        this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
          centered: true, keyboard: false,
          backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
        });
        this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
          if (result == 'confirm') {
            this.subscription.add(this.jobDetailService.updateQuoteStatus(this.qetQuotedId,'notsent').subscribe(res => {
              this.quotesService.quoteStatus = "NOTSENT";
              this.modalService.dismissAll();
              (document.querySelector(".quoteStatusUpdate") as HTMLElement).style.visibility = 'hidden';
              this.qtyValue = element.target.value;
              this.updateProductToQuote(element, this.qtyValue, '');
            }));
          }
          if (result == 'cancel') {
            this.materialService.updateRetreiveProduct.next(0);
          }
        });
      }
      else {
      this.qtyValue=element.target.value;
      this.updateProductToQuote(element,this.qtyValue,'');
      }
    }
  }
  qtyBlur(element) {
    if(element.target.value=="" || element.target.value==0){
      element.target.value=this.currentqtyValue;
    }
  }
  qtyFocus(element){
    this.currentqtyValue=element.target.value;
  }
  updateQty(element: any, btn: any, uomFormat: any, action: any) {
    if (btn != '') {
      btn.innerText = quoteConstants.addToQuoteBtn;
      btn.className = 'btn btn-blue addtoQuote';
    }
  
    if (action == '+') {
      var quantity = 0;
     // let decimalPattern = this.checkQtyRegEx(uomFormat);
      if(element.value != ""){
        quantity = Number(element.value);
      }     
      
      let addValue = 1;
      var newQtyValue;
      
      // if(uomFormat.indexOf(".") > 0 && !Number.isInteger(quantity)){
      //   let decimalLimit = quantity.toString().split(".")[1].length;
      //   let decimalPart = quantity - Math.floor(quantity);
      //   newQtyValue = parseInt(quantity.toString().split(".")[0]) + addValue;
      //   newQtyValue = newQtyValue + Number(decimalPart);
      //   newQtyValue = newQtyValue.toFixed(decimalLimit);
      // }else{
        newQtyValue = quantity + addValue;
      //}
      
      // if(decimalPattern.test(Number(newQtyValue))){
      //   element.value = newQtyValue;
      // }else{
        element.value = newQtyValue;
     // }
    } else if (action == '-' && element.value != 0) {

      let quantity = 0;
     // let decimalPattern = this.checkQtyRegEx(uomFormat);
      if(element.value == ""){
        quantity = 1;
      }
      else{
        quantity = Number(element.value);
      }
      
      let diffValue = 1;
      newQtyValue = 0;
      
      // if(uomFormat.indexOf(".") > 0 && !Number.isInteger(quantity)){
      //   let decimalLimit = quantity.toString().split(".")[1].length;
      //   let decimalPart = quantity - Math.floor(quantity);
        
      //   if(quantity > 0){
      //     newQtyValue = parseInt(quantity.toString().split(".")[0]) - diffValue;
      //     newQtyValue = newQtyValue + Number(decimalPart);
      //     newQtyValue = Number(newQtyValue.toFixed(decimalLimit));
      //   }else if(decimalLimit > 0){
      //     newQtyValue = quantity;
      //   }	        	
      // }else{
        if(quantity > 0){
          newQtyValue = quantity - diffValue;
        }
     // }
      
      // if(!decimalPattern.test(Number(newQtyValue))){
      //   newQtyValue = quantity;
      // }
      element.value = newQtyValue;
    } 
    if (this.productType == 'materials') {
      if(element.value==0) {
        element.value=1;
      }
      if (this.quotesService.quoteStatus == "PENDING") {
        this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
          centered: true, keyboard: false,
          backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
        });
        this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
          if (result == 'confirm') {
            this.subscription.add(this.jobDetailService.updateQuoteStatus(this.qetQuotedId,'notsent').subscribe(res => {
              this.quotesService.quoteStatus = "NOTSENT";
              this.modalService.dismissAll();
              (document.querySelector(".quoteStatusUpdate") as HTMLElement).style.visibility = 'hidden';
              this.qtyValue = newQtyValue;
              this.updateProductToQuote(element, this.qtyValue, action);   
            }));
          }
          if (result == 'cancel') {
            this.materialService.updateRetreiveProduct.next(0);
          }
        });
      }
      else {
      this.qtyValue=newQtyValue;
      this.updateProductToQuote(element,this.qtyValue,action);
      }
    }
  }

  checkQtyRegEx (uomFormat) {
    let numericPattern;
    let integerLimit = this.checkNoOfZ(uomFormat);
    if(integerLimit > 5 || integerLimit < 1)
      integerLimit = 5;
    if(uomFormat.indexOf(".") > 0){	
     let decimalLimit = uomFormat.split(".")[1].length;
     let decimalRegEx = "^\\d{1," + integerLimit + "}(\\.\\d{1," + decimalLimit + "})?$";   
     numericPattern = new RegExp(decimalRegEx);	
   }else{
     var numericRegEx = "^\\d{1," + integerLimit + "}?$";
     numericPattern = new RegExp(numericRegEx);	
   }
    return numericPattern;
  }

  checkNoOfZ (uomFormat) {
    let noOfZ = 0;
    let charToFind = "z";
    for(let i =0;i<uomFormat.length;i++){
        if(uomFormat.charAt(i) == charToFind)
          noOfZ++;
    }
    return noOfZ;
  }

  // checkUOMFormat(keyPressEvent, uomFormat) {
  //   if(keyPressEvent.keyCode < 46 || keyPressEvent.keyCode > 58){	
  //     return false;	
  //   }	
  //   var qtyNode = keyPressEvent.target;
  //   var qtyValue = qtyNode.value;
    
  //   var oldValue = qtyValue;
  //   var newKey = keyPressEvent.key;
  //   var position = keyPressEvent.target.selectionStart;
  //   var newQtyValue = [oldValue.slice(0, position), newKey, oldValue.slice(position)].join('');
    
  //   uomFormat = uomFormat.replace("-","");
  //   var integerLimit = 5;
  //   var decimalLimit = 0;
  //   var isDecimalUOM = false;
    
  //   if(uomFormat.indexOf(".") > 0){	
  //    decimalLimit = uomFormat.split(".")[1].length;
  //    isDecimalUOM = true;
  //   } else{
  //     qtyNode.setAttribute("maxlength", "5");
  //   }
  
  //  // var decimalPattern = this.checkQtyRegEx(uomFormat);
   
  //  var isValidFormat = true;
  //  if(keyPressEvent.keyCode > 47 && keyPressEvent.keyCode < 58){//enter only numbers	
  //    if(!decimalPattern.test(Number(newQtyValue))){	
  //      isValidFormat = false; 	
  //    }else{   				 		
  //      if(newQtyValue.indexOf(".") < 0){	
  //        if(newQtyValue.length > integerLimit)	
  //          isValidFormat =  false;	
  //      }else{	
  //        if((newQtyValue.split(".")[0].length > integerLimit) || (newQtyValue.split(".")[1].length > decimalLimit))	
  //          isValidFormat =  false;	
  //      }   				 	
  //    }	
  //    if(uomFormat == ""){	
  //      if(newQtyValue.length >5)	
  //        isValidFormat =  false	
  //    }   				 	
  //   }else if(keyPressEvent.keyCode == 46){//not allow decimal value in integer input	
  //     if(uomFormat == "" || !isDecimalUOM){	
  //       isValidFormat =  false;	
  //     }else if(qtyValue.indexOf(".")>0){
  //       isValidFormat =  false;	
  //     }
  //   }else{	
  //     isValidFormat =  false;	
  //   }
  //   return isValidFormat;
  // }
  onPaste(event) {
   let pastedData = event.clipboardData.getData('text/plain');
   if(pastedData.match(/^-?\d{0,5}(\.\d{0,2})?$/) === null) {
    event.preventDefault();
   }
  }
  updateProductToQuote(element,qty,action){
    if (qty != 0 && qty != '') {
      let qtybtn: HTMLElement = document.getElementsByClassName('qtyBtn') as unknown as HTMLElement;
      Array.prototype.filter.call(qtybtn, function(e){
        e.disabled = true;
      }); 
    this.responseloader=true;
    var timberLength=this.product?.selectedConfiguration?.length > 0 ? this.product.selectedConfiguration[0]?.size:'';
    let entry = {
      "quantity": qty,
      "decimalQty": qty,
      "product":{
        "code":this.product.product.code,
        "customProductFlag":this.product.customProductFlag,
      }
    }
    
    if(timberLength !='' && timberLength !=undefined){
      entry.product["length"] = timberLength;
      entry.product["timberProductFlag"]=this.product.product.timberProductFlag;
      if(action=='+'){
        entry["decimalQty"] =1;
      }
      else if(action=='-'){
        entry["decimalQty"] =-1;
      }
      else {
        entry["decimalQty"]=qty-this.currentqtyValue;
      }
    }
    this.subscription.add(this.materialService.updateProducts(this.qetQuotedId,entry,this.product.entryNumber,this.stageId).subscribe((data) => {
      this.materialService.allProductAdded(this.qetQuotedId,false);  
      this.responseloader=false;
        this.updateQtyEntries=data.entry;
          this.jobDetailService.markupAdded.next(true); 
          let qtybtn: HTMLElement = document.getElementsByClassName('qtyBtn') as unknown as HTMLElement;
          Array.prototype.filter.call(qtybtn, function(e){
           e.disabled = false;
          });
      },
      (err)=>{
        this.responseloader=false;
        let qtybtn: HTMLElement = document.getElementsByClassName('qtyBtn') as unknown as HTMLElement;
        Array.prototype.filter.call(qtybtn, function(e){
         e.disabled = false;
        });
      }
      ));
    }
  }
  addProductToQuote(e , item: any, qty: any) {
    if (qty != 0 && qty != '') {
      let elem = e.target;
      elem.disabled = true;
      let addtoquotebtn: HTMLElement = document.getElementsByClassName('addtoQuote') as unknown as HTMLElement;
      Array.prototype.filter.call(addtoquotebtn, function(e){
        e.disabled = true;
      }); 
      elem.innerHTML = '<div class="customerQuoteloading addtoQuoteLoader loading-wrapper "></div>';
      let entry = {
        "quantity": qty,
        "decimalQty": qty,
        "basePrice":{
          "value": item?.price?.value
        },
        "retailPrice":{
          "value":item?.m2Price?.value
        },
        "customProductFlag":"false"
        };
      if (item.timberProductFlag && item.sellOrderMultiple > 0) {
        entry["product"] = {
          "code": item.code,
          "timberProductFlag": "true",
          "length": item.sellOrderMultiple
        }
      } else {
        entry["product"] = {
          "code": item.code,
        }
      }

      this.materialService.loaderTriggerSendEvent();
      this.materialService.addProductsToMaterial(entry,this.quoteId,this.stageId).subscribe((data) => {
        elem.innerText = quoteConstants.addedBtn;
        elem.className = 'btn btn-blue-border addtoQuote';
        this.materialService.allProductAdded(this.quoteId,false);
        this.materialService.updateRetreiveProduct.next(0);
        let addtoquotebtn: HTMLElement = document.getElementsByClassName('addtoQuote') as unknown as HTMLElement;
        Array.prototype.filter.call(addtoquotebtn, function(e){
          e.disabled = false;
        });
      });
    }
  }

  deleteProduct(product) {
    if (this.quotesService.quoteStatus == "PENDING") {
      this.modalRef = this.modalService.open(QuoteStatusUpdatePopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'quoteStatusUpdate', size: 'lg'
      });
      this.modalRef.componentInstance.quoteUpdateStatus.subscribe((result) => {
        if (result == 'confirm') {
          let quoteId = this.ac.snapshot.params['id'];
          this.subscription.add(this.jobDetailService.updateQuoteStatus(quoteId,'notsent').subscribe(res => {
            this.quotesService.quoteStatus = "NOTSENT"; 
            this.activeModal.close('close');
              (document.querySelector(".quoteStatusUpdate") as HTMLElement).style.visibility = 'hidden';
              this.modalRef = this.modalService.open(ProductDeletePopupComponent,{ centered: true,keyboard : false,
                backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
                this.modalRef.componentInstance.product = product;
                this.modalRef.componentInstance.quotesId = this.qetQuotedId;
                this.modalRef.componentInstance.callFrom = 'add-product'
          }));
        }
      });
    }
    else {
    this.modalRef = this.modalService.open(ProductDeletePopupComponent,{ centered: true,keyboard : false,
    backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
    this.modalRef.componentInstance.product = product;
    this.modalRef.componentInstance.quotesId = this.qetQuotedId;
    this.modalRef.componentInstance.callFrom = 'add-product'
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

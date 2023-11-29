
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { CommonUtils } from './../../../core/utils/utils';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { SearchBoxConfig, ModalService } from '@spartacus/storefront';
import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ActiveCartService, MultiCartService, ProductService } from '@spartacus/core';
import { QuickOrderModel } from '../../quick-order/quick-order.model'
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChnageQuotePopupComponent } from './chnage-quote-popup/chnage-quote-popup.component';
import { startWith, map } from 'rxjs/operators';
import { checkoutService } from 'src/app/core/service/checkout.service';
@Component({
  selector: 'app-requestquote',
  templateUrl: './requestquote.component.html',
  styleUrls: ['./requestquote.component.scss']
})
export class RequestquoteComponent implements OnInit {
  isLoading$ = new BehaviorSubject<boolean>(false);
  loaderVal: any;
  isMobile: boolean = false;
  quickOrderIndex: number = 0
  selectedCode: string = ""
  subTotal: number = 0;
  jobReference:string = ""; 
  formattedSubTotal: number = 0.00;
  screenMode = "quickOrder"
  isDisabled: boolean = true;
  searchConfig: SearchBoxConfig = {
    displayProductImages: true,
    displayProducts: true,
    displaySuggestions: false,
    maxProducts: 5

  }
  filteredStreet: Observable<string[]>;
  selectedItemCount = 0
  maxRow = 20
  maxRowMobile = 1;
  rows: Array<QuickOrderModel> = new Array();
  currentItem: any = {};
  modalRef: any;
  submitQuote:boolean = true;
  rowCount: number = 10;
  public rowsProduct$ = new BehaviorSubject<any>(this.rows);
  isPricingPermission: boolean;
  addRowLabel: any;
  emailId: any;
  dblcheck:boolean = false;
  checked:boolean = false;
  public orderRefDel: string = '';
  public orderRefCC: string = '';
  disableAddToCart: boolean = false;
  addToCartDisabled: boolean = false;
  submitQuoterevised:boolean = false;
  isaddress: boolean = true;
  orderNumber: string;
  control = new FormControl();
  isLoader = false;
  public isExpandedAccPanel: boolean = true;
  public isExpandedRecPanel: boolean = false;
  public isExpandedAddPanel: boolean = false;
  public isDeliveryBox: boolean;
  public isAddAddressManual: boolean;
  public selectedAddressDel: any = '';
  public manualAddressData: any = {
    streetName: '',
    lotNumber: '',
    streetType: undefined,
    crossStreet: '',
    suburb: '',
    postCode: '',
  };
  public selectState: string = localStorage.getItem('isPreState') || undefined;
  public streetTypeData: any;
  tempOptionDisabled: boolean = false;
  comments: string;
  successInd$ = new BehaviorSubject<boolean>(false);
  successInd: boolean = false
  errorInd: boolean = false
  infoMessage: string = '';
  requestIndex = 0;
  public stateList: any;
  finalRequestIndex: number;
  listForm: FormGroup;
  quoteData: any;
  elementData: any = {};
  previousUrl: string;
  viewData: any;
  quoteDataPop: boolean = false;
  quoteUrl: string;
  flagVal: any;
  txtValue:boolean = true;
  flagIndex: any;
  pageState: any;
  public checkoutData: any;
  clickQuick: boolean = true;
  deliveryMode: any;
  manualAddress: any;
  quoteAddress: string = "";
  manuallyAdd: boolean = false;
  dataShow: boolean;

  constructor(private productService: ProductService,
    private activeCartService: ActiveCartService,
    private multiCartService: MultiCartService,
    private router: Router,
    public checkoutService: checkoutService,
    public commonService: CommonService,
    private productHelpService: ProductHelpService,
    private modalService: ModalService,
    private TPUserAccountDetailsService: FIUserAccountDetailsService,
    public ref: ChangeDetectorRef) {

  }

  coreLogicSearch(textEvent) {
    // this.txtValue = textEvent.target.value == '' ? true : false;
  //  console.log(this.selectedAddressDel)
   if(textEvent.target.value.length<1){
    this.txtValue = true;
    this.submitQuoterevised = false;
   }
    this.checked = false;
    this.dblcheck = false;
    let temps = textEvent.target.value.toLowerCase();
    if (temps.length >= 3) {
      this.isLoader = true;
      temps =
        temps.substr(0, 3) == 'lot' && temps[3] != ' '
          ? temps.replace('lot', 'lot ')
          : temps;
      temps =
        temps.substr(0, 4) == 'lots' && temps[3] != ' '
          ? temps.replace('lots', 'lots ')
          : temps;
      if (this.timerId) {
        this.timerId.unsubscribe();
      }
      
      this.timerId = this.checkoutService
        .getCoreLogicSearch(textEvent.target.value)
        .subscribe((data) => {
          if (data.suggestions) {
            
            // alert(this.selectedAddressDel)
            this.tempOptionDisabled =
              data.suggestions.length == 0 ? true : false;
             
            this.filteredStreet = data.suggestions.map((value) => {
              this.txtValue = textEvent.target.value == '' ? true : false;
              return {
                // streetId: value.streetId,
                
                propertyId: value.propertyId,
                suggestion: value.suggestion,
              };
              
            });
            
            this.ref.markForCheck();
          }
          this.isLoader = false;
        });
    } else {
      this.filteredStreet = undefined;
      this.isLoader = false;
      if (this.timerId) { 
        this.timerId.unsubscribe();
      }
    }
  }
  addAddressManual(args: any) {
    if(args){
      // this.txtValue = true;
      this.manuallyAdd = true;
      // alert(this.txtValue)
    }
    else{
      // this.txtValue = false;
      this.manuallyAdd = false;
    }
    this.isExpandedAccPanel = false;
    this.isExpandedRecPanel = true;
    this.isAddAddressManual = true;
    
    this.isaddress = false;
    this.submitQuote = false;
    this.clearRequestQuoteForm();
  }

  clearRequestQuoteForm(){
    this.manualAddressData.lotNumber = '';
    this.manualAddressData.streetName = '';
    this.manualAddressData.streetType = this.manualAddressData.streetType[0];
    this.manualAddressData.crossStreet = '';
    this.manualAddressData.suburb = '';
    this.manualAddressData.postCode = '';
    this.selectState = this.selectState[0];


  }

  async ngOnInit() {
    // alert(this.checked)
    // this.loaderVal = localStorage.getItem("loader")
    // alert(this.loaderVal)
    this.dataShow = await this.TPUserAccountDetailsService.isPlaceOrdersPermission();
    var info_uid = JSON.parse(localStorage.getItem("userInfo"));
     const dataInfo = {
      email: info_uid.uid,
      deliveryMode: this.isDeliveryBox ? 'Delivery' : 'Pick-Up',
    };
    this.checkoutService.getCheckoutInfo(dataInfo).subscribe((data)  => {
     this.streetTypeData = data.streetTypes;
    });

    this.checkoutService.getStates().subscribe((data)=>{
      this.stateList = data.regions;
    });

    this.filteredStreet = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.isMobile = CommonUtils.isMobile();
    this.clearAll();
    this.flagVal = true;
    if (this.isMobile) {
      this.addRowLabel = 'Add Another Item';
    }
    else {
      this.addRowLabel = 'Add Another Row';
    }
    this.getPricingPermission();
    if (this.isMobile) {
      this.intiallizeQuickOrderForm(this.maxRowMobile, true);
    }
    else {
      this.intiallizeQuickOrderForm(this.maxRow, true);
    }
    this.commonService.setVal(this.rows);
    // ---------- data from custom-my-quotes page START--------- //
    this.quoteData = this.commonService.getDta();
   // console.log("Quote data:", this.quoteData);
    this.previousUrl = this.commonService.getUrl();
  //  console.log(this.previousUrl)
    if(this.quoteData != undefined && this.previousUrl.includes('/quotesPage')){
      var val = 'customQuote'
      for(var i =0; i<this.rows.length; i++){
        if(this.rows[i]['details']== '--'){
          for(var j=0; j<this.quoteData.length; j++){
          this.elementData.code = this.quoteData[j].product.code;
          this.searchRowHanderQuote(i, this.elementData, val)
          i=i+1;
          }
          break;
        }
      }

    }
    // ---------- data from custom-my-quotes page END --------- //


// ---------- data from View-quotes page START--------- //
    this.viewData = this.commonService.getDta();
   // console.log("View data:", JSON.stringify(this.viewData));
    if(this.viewData != undefined && this.previousUrl == '/quotesPage'){
      this.clearAll();
      var val = 'viewQuote'
      for(var i =0; i<this.rows.length; i++){
        if(this.rows[i]['details']== '--'){
          for(var j=0; j<this.viewData.length; j++){
          this.elementData.code = this.viewData[j].product.code;
          this.searchRowHanderQuote(i, this.elementData, val)
          i=i+1;
          }
          break;
        }
      }
    }
  // ---------- data from View-quotes page End--------- //

  // var branch = JSON.parse(localStorage.getItem("branchDetails"))
  // console.log("Branch:", branch)
  // console.log("Id:", branch.branchID)
  }

  private _filter(value: string): string[] {
    return this.checkoutData?.deliveryAddresses;
  }

  

  createListForm() {
    try {
      this.listForm = new FormGroup({
        listName: new FormControl({ value: '', disabled: false }, [
          Validators.required,
        ]),
      });
    } catch (ex) {
      // console.log(ex);
    }
  }
  openAddMyFromList(content) {
    
    this.modalRef = this.modalService.open(content, {
      windowClass: 'addFromMyListpopup',
      centered: true,
      size: 'lg',
    });
    this.modalRef.result.then(
      (result) => {
        if (result === 'success') {
        }
      }
    );
  }
  autocompleteChange(event: any) {
    let tempValue: any = event.option._element.nativeElement['data-value'];
    this.checkoutService
      .getPropertyInfo(tempValue.propertyId)
      .subscribe((data) => {
        if (data) {
          this.manualAddressData.lotNumber = data.line1;
          this.manualAddressData.streetName = data.line2;
          this.streetTypeData.forEach(element => {
            if(element.name == data.address3) {
              this.manualAddressData.streetType = element.code;
            }
          });
          this.manualAddressData.crossStreet = data.address4;
          this.manualAddressData.suburb = data.region.isocode;
          this.selectState = data.region.isocode;
          this.manualAddressData.postCode = data.postalCode;
        
    let inputEle: any = document.getElementById('auto-input-ele');
    inputEle.blur();
  
    let lotNumber: string = this.manualAddressData.lotNumber
        ? this.manualAddressData.lotNumber + ', '
        : '';
      let streetName: string = this.manualAddressData.streetName
        ? this.manualAddressData.streetName + ', '
        : '';
      let streetType: string =
        this.manualAddressData.streetType &&
        this.manualAddressData.streetType !== 'undefined'
          ? this.manualAddressData.streetType + ', '
          : '';
      let crossStreet: string = this.manualAddressData.crossStreet
        ? this.manualAddressData.crossStreet + ', '
        : '';
      let suburb: string = this.manualAddressData.suburb
        ? this.manualAddressData.suburb + ', '
        : '';
      let postCode: string = this.manualAddressData.postCode
        ? this.manualAddressData.postCode + ', '
        : '';
      let temp: string = this.stateList.filter((data) => {
        if (data.isocode === this.selectState) {
          return data.name;
        }
      })[0].name;
      let state: string =
      this.selectState && this.selectState !== 'undefined' ? temp : '';
      this.selectedAddressDel =
        lotNumber +
        streetName +
        streetType +
        crossStreet +
        suburb +
        postCode +
        state;
      localStorage.setItem('isManual', JSON.stringify(this.manualAddressData));
      localStorage.setItem('isPreState', this.selectState);
      localStorage.setItem('manualAddress', this.selectedAddressDel);
      this.isExpandedAccPanel = false;
      this.isExpandedRecPanel = false;
      this.isAddAddressManual = false;
      this.txtValue = false;
    }
  });
  }
  addManualAddress(drop, form) {
    
    if (form.valid) {
      
      let lotNumber: string = this.manualAddressData.lotNumber
        ? this.manualAddressData.lotNumber + ', '
        : '';
      let streetName: string = this.manualAddressData.streetName
        ? this.manualAddressData.streetName + ', '
        : '';
      let streetType: string =
        this.manualAddressData.streetType &&
        this.manualAddressData.streetType !== 'undefined'
          ? this.manualAddressData.streetType + ', '
          : '';
      let crossStreet: string = this.manualAddressData.crossStreet
        ? this.manualAddressData.crossStreet + ', '
        : '';
      let suburb: string = this.manualAddressData.suburb
        ? this.manualAddressData.suburb + ', '
        : '';
      let postCode: string = this.manualAddressData.postCode
        ? this.manualAddressData.postCode + ', '
        : '';
      let temp: string = this.stateList.filter((data) => {
        if (data.isocode === this.selectState) {
          return data.name;
        }
      })[0].name;
      let state: string =
        this.selectState && this.selectState !== 'undefined' ? temp : '';
      this.selectedAddressDel =
        lotNumber +
        streetName +
        streetType +
        crossStreet +
        suburb +
        postCode +
        state;
      localStorage.setItem('isManual', JSON.stringify(this.manualAddressData));
      localStorage.setItem('isPreState', this.selectState);
      localStorage.setItem('manualAddress', this.selectedAddressDel);
      this.isExpandedAccPanel = false;
      this.isExpandedRecPanel = false;
      this.isAddAddressManual = false;
      this.isaddress = true;
      this.txtValue = false;
      // alert(this.txtValue);
      this.dblcheck = false;
      this.submitQuote = true;
      this.submitQuoterevised = true;
      
    }
    
    // this.isDisabled = true;
  }


  negativeConverter(value) {
    let val: any = parseFloat(value).toFixed(2);
    if (/\-/g.test(val)) {
      let isMinus = '-$' + val.replace('-', '');
      return (
        '-$' + parseFloat(isMinus.split('$')[1]).toFixed(2).toLocaleString()
      );
    } else {
      let isMinus = '$' + val;
      return (
        '$' + parseFloat(isMinus.split('$')[1]).toFixed(2).toLocaleString()
      );
    }
  }

  clearAll() {
    if (this.isMobile) {
      this.intiallizeQuickOrderForm(this.maxRowMobile, true);
    }
    else {
      this.intiallizeQuickOrderForm(this.maxRow, true);
    }
    this.calculateSubTotal();
  }

  clearData(){
    this.jobReference = "";
      this.comments = "";
      this.selectedAddressDel = "";
  }

  async getPricingPermission() {
    this.isPricingPermission = await this.TPUserAccountDetailsService.isPricingPermission();
    this.ref.markForCheck();
  }

  intiallizeQuickOrderForm(rowCount, newForm = false) {
    if (newForm) {
      this.subTotal = 0;
      this.rows = [];
    }


    for (let i = 0; i < rowCount; i++) {
      let rowItem = new QuickOrderModel()
      if (this.isMobile) {
        this.quoteDataPop = false;
        this.commonService.setPage(this.quoteDataPop);
        rowItem.brand = "-- --"
        rowItem.details = "-- --"
        rowItem.stock = "-- --"
        rowItem.productCode = "";
        rowItem.quantity = 1
        rowItem.productDetails = "";
        rowItem.itemCode = "-- --";
        rowItem.supplierCode = "-- --";
        rowItem.unit = "";
        //  rowItem.price = "--"
        //   rowItem.staticPrice = "--"
        // rowItem.fommatedprice = "-- --"
      } else {
        this.quoteDataPop = false;
        this.commonService.setPage(this.quoteDataPop);
        rowItem.brand = "--"
        rowItem.details = "--"
        rowItem.stock = ""
        rowItem.productCode = "";
        rowItem.quantity = 1
        rowItem.productDetails = "";
        rowItem.unit = "";
        //  rowItem.price = "--"
        //   rowItem.staticPrice = "--"
        // rowItem.fommatedprice = "--"
      }
      this.rows.push(rowItem)
    }

    this.rowsProduct$.next(this.rows);
    this.rowsProduct$.subscribe(data => {
      this.rowCount = data.length;
    })
  }
  getFinalIndex(){
    return this.finalRequestIndex;
  }
  public timerId: any;
 
  
  searchRowHander(rowIndex) {
    this.quickOrderIndex = rowIndex;
   // console.log(rowIndex);
    // console.log("Index order:", this.quickOrderIndex)
  }
  searchRowHanderQuote(rowIndex, quoteProduct, val) {
    this.quickOrderIndex = rowIndex;
  //  console.log(rowIndex);
    this.prodRequestCodecallBack(rowIndex, quoteProduct, val);
    // console.log("Index order:", this.quickOrderIndex)
  }

  
  prodRequestCodecallBack(rowIndex,product, val) {
    if (product.isPOAproduct == true) {
      this.errorInd = true;
      setTimeout(() => {
        this.errorInd = false;
      }, 10000);
    } else {
      this.productService.get(product.code).subscribe((prodData: any) => {
        if (prodData) {
          this.quoteDataPop = true;
          this.commonService.setPage(this.quoteDataPop);
          let rowItem = new QuickOrderModel()
          this.selectedCode = prodData?.code
          rowItem.productCode = prodData?.code
          rowItem.productDetails = 'Item Code : ' + prodData?.code + ' | Supplier Code : ' + prodData?.productSupplierCode
          rowItem.itemCode = prodData?.code
          rowItem.supplierCode = prodData?.productSupplierCode
          rowItem.brand = prodData?.manufacturer
          rowItem.details = prodData?.name//prodData.description
          rowItem.addToCartDisabled = prodData?.addToCartDisabled
          // if (prodData?.stock?.stockLevelStatus == 'inStock') {
          //   rowItem.stock = 'In stock';
          // } else {
          //   rowItem.stock = 'Available to order'
          // }
          if(prodData?.price?.formattedValue == 'POA' || product?.price?.formattedValue == '$0.00' ){
            rowItem.stock = 'POA';
            
          }
          else if (prodData?.stock?.leadTimeDays >= 1 && prodData?.stock?.stockLevel == 0){
            if(prodData?.stock?.leadTimeDays == 1){
              rowItem.stock = prodData?.stock?.leadTimeDays + ' Day Lead time';
            }
            else{
              rowItem.stock = prodData?.stock?.leadTimeDays + ' Days Lead time';
            }
          }
          else if((prodData?.stock?.leadTimeDays == 0 || prodData?.stock?.leadTimeDays == '' || product?.stock?.leadTimeDays == undefined) && product?.stock?.stockLevel == 0){
            rowItem.stock = 'Available to order';
          }
          else if(prodData?.stock?.stockLevel < 0 && product?.stock?.leadTimeDays == undefined){
            rowItem.stock = 'Available to order';
          }
          else if (prodData?.stock?.stockLevelStatus == 'inStock' && product?.stock?.leadTimeDays == undefined){
            rowItem.stock = prodData?.stock?.stockLevel + ' In stock';
          }
          else{

          }
          if(prodData.addToCartDisabled == true) {
              this.isDisabled = true;
          }
          rowItem.quantity = 1
          rowItem.dollar = '$';
          let dollarUSLocale = Intl.NumberFormat('en-US');
          rowItem.price = prodData?.price?.value
          rowItem.unit = 'EA'
          rowItem.staticPrice = prodData?.price?.value
          rowItem.fommatedprice = dollarUSLocale.format(prodData?.price?.value)

          this.rows[rowIndex] = rowItem;
          this.commonService.RequestIndexQuote = this.requestIndex++;
        //  console.log("Request Indexxxxx:", this.requestIndex)
       //   console.log("Row Index:", this.rows[this.quickOrderIndex])
        //  console.log(rowIndex);
          this.rowsProduct$.next(this.rows);
          if(val == 'list'){
            this.infoMessage = 'Your list items have been successfully added to your Quote Request Form';
            this.successInd$.next(true);
            setTimeout(() => {
              this.infoMessage = '';
              this.successInd$.next(false);
            }, 3000);
            window.scrollTo(0,0);
          }
          else if (val == 'myQuote'){
            this.infoMessage = 'Your quote items have been successfully added to your Quote Request Form';
            this.successInd$.next(true);
            setTimeout(() => {
              this.infoMessage = '';
              this.successInd$.next(false);
            }, 3000);
            window.scrollTo(0,0);
          }
        }
        
        this.calculateSubTotal();

      })
    }
  }

  prodCodecallBack(product) {
    
    if (product.isPOAproduct == true) {
      this.errorInd = true;
      setTimeout(() => {
        this.errorInd = false;
      }, 10000);
    } else {
      this.productService.get(product.code).subscribe((prodData: any) => {
        if (prodData) {
          this.quoteDataPop = true;
          this.commonService.setPage(this.quoteDataPop);
          let rowItem = new QuickOrderModel()
          this.selectedCode = prodData?.code
          rowItem.productCode = prodData?.code
          rowItem.productDetails = 'Item Code : ' + prodData?.code + ' | Supplier Code : ' + prodData?.productSupplierCode
          rowItem.itemCode = prodData?.code
          rowItem.supplierCode = prodData?.productSupplierCode
          rowItem.brand = prodData?.manufacturer
          rowItem.details = prodData?.name//prodData.description
          rowItem.addToCartDisabled = prodData?.addToCartDisabled
          // if (prodData?.stock?.stockLevelStatus == 'inStock') {
          //   rowItem.stock = 'In stock';
          // } else {
          //   rowItem.stock = 'Available to order'
          // }
          if(prodData?.price?.formattedValue == 'POA' || product?.price?.formattedValue == '$0.00' ){
            rowItem.stock = 'POA';
            
          }
          else if (prodData?.stock?.leadTimeDays >= 1 && prodData?.stock?.stockLevel == 0){
            if(prodData?.stock?.leadTimeDays == 1){
              rowItem.stock = prodData?.stock?.leadTimeDays + ' Day Lead time';
            }
            else{
              rowItem.stock = prodData?.stock?.leadTimeDays + ' Days Lead time';
            }
          }
          else if((prodData?.stock?.leadTimeDays == 0 || prodData?.stock?.leadTimeDays == '' || product?.stock?.leadTimeDays == undefined) && product?.stock?.stockLevel == 0){
            rowItem.stock = 'Available to order';
          }
          else if(prodData?.stock?.stockLevel < 0 && product?.stock?.leadTimeDays == undefined){
            rowItem.stock = 'Available to order';
          }
          else if (prodData?.stock?.stockLevelStatus == 'inStock' && product?.stock?.leadTimeDays == undefined){
            rowItem.stock = prodData?.stock?.stockLevel + ' In stock';
          }
          else{

          }
          if(prodData.addToCartDisabled == true) {
              this.isDisabled = true;
          }
          rowItem.quantity = 1
          rowItem.dollar = '$';
          let dollarUSLocale = Intl.NumberFormat('en-US');
          rowItem.price = prodData?.price?.value
          rowItem.unit = 'EA'
          rowItem.staticPrice = prodData?.price?.value
          rowItem.fommatedprice = dollarUSLocale.format(prodData?.price?.value)

          this.rows[this.quickOrderIndex] = rowItem;
          // console.log("Rows:", JSON.stringify(this.rows))
          // for(var i=0; i<this.rows.length; i++){
          //   if(this.rows[i]['productDetails'] == '--'){

          //   }
            
          // }
          this.rowsProduct$.next(this.rows);
          
        }
        this.calculateSubTotal();

      })
    }
  }



  quantityHandler(quanObj) {
    this.quickOrderIndex = quanObj?.code
    let rowObj = this.rows[this.quickOrderIndex]
    // if(rowObj?.price>0 && quanObj.rowIndex === this.quickOrderIndex){
      rowObj.quantity = (quanObj?.quantity) ? quanObj?.quantity : 1
    if (rowObj?.price > 0) {
      rowObj.price = rowObj?.staticPrice 
      let staticPrice: any = rowObj?.staticPrice
      let dollarUSLocale = Intl.NumberFormat('en-US');
      rowObj.fommatedprice = staticPrice
      // rowObj.fommatedprice = JSON.stringify(rowObj.price);
      //this.rowsProduct$.next(this.rows);
    }
    this.rows[this.quickOrderIndex] = rowObj
    this.calculateSubTotal();

  }
  calculateSubTotal() {
    const parentVal = this.rows.filter((element: any) => {
      return (element.addToCartDisabled == true )
    });
    this.addToCartDisabled = parentVal.length> 0 ? true: false
    this.subTotal = 0;
    this.formattedSubTotal = 0.00;
    this.selectedItemCount = this.generateSelectedAItem().length
    this.productHelpService.updateCodeInQuickOrder(this.generateSelectedAItem());
    let isProductEmpty = 0;
    let isProductPresent = true;
    this.rows.forEach(element => {
      // console.log("Element::", JSON.stringify(element))
      if(element?.productCode != "") {
        isProductEmpty += 1;
      // }else {
      //   isProductPresent = false
      }
      if (element?.price) {
        this.subTotal += element?.price * element?.quantity;
        let dollarUSLocale = Intl.NumberFormat('en-US');
        this.formattedSubTotal = this.subTotal;
      }
    });
    if(isProductEmpty > 0 && !this.addToCartDisabled) {
      this.isDisabled = false;
    }
    else {
      this.isDisabled = true;
    }
    // THis logic need to remove
    // this.isDisabled = !(this.subTotal > 0)

  }


  public generateSelectedAItem(): Array<any> {
    let allSelecteItemArr = []
    this.rows.forEach(itemm => {
      if (itemm.productCode != "") {
        allSelecteItemArr.push({
          productCode: itemm.productCode,
          quantity: itemm.quantity,
          price: itemm.price
        })
      }
    })

    return allSelecteItemArr;
  }

  checkClicked(val){
   this.checked = !this.checked;
  // alert(this.checked);
   if(this.checked == true){
   // alert("sanjeev");
    this.txtValue = false;
    
  
   }
   else if(this.checked == false){
    //alert("sanjeev 2");
    this.dblcheck = true;
    this.txtValue = true;
   }
   this.isAddAddressManual = false;
   this.isaddress = true;
   this.isDisabled = false;
   this.selectedAddressDel = null;
   
  //  if(this.checked){
  //   this.deliveryAddress = 'click & collect'
  //  }
  }

  addToCartEmpty() {
    // this.generateSelectedAItem().forEach(item => {
    //   (<any>window).dataLayer.push({
    //     'event':'Quick Order ATC ClicK',
    //     'eventCategory':'Quick Order ATC',
    //     'eventAction':'Quick Order ATC'
    //   });
    // });
    if(this.checked){
      this.activeCartService.getActiveCartId().subscribe(data => {
        let obj = {
          "jobRefNum": this.jobReference,
          "comments": this.comments,
          "products": this.generateSelectedAItem(),
          "deliveryMode": 'Pick Up'
          
        }
        this.commonService.setData(obj.deliveryMode);
        this.productHelpService.addProductsToQuote(obj).subscribe(result => {
        
          if(result == "SUCCESS"){
            
            this.infoMessage = 'Thank you, your quote has been submitted successfully.';
            this.successInd$.next(true);
            setTimeout(() => {
              this.infoMessage = '';
              this.successInd$.next(false);
            }, 10000);
            this.commonService.hide();
          }
          else if(result == "FAILURE"){
            this.infoMessage = 'Something went wrong with your order.';
            this.successInd$.next(true);
            setTimeout(() => {
              this.infoMessage = '';
              this.successInd$.next(false);
            }, 10000);
            this.commonService.hide();
          }
          else{

          }
        })
      });
    }
    else{
  
      let isPreState = localStorage.getItem('isPreState');
      this.manualAddress= 
          this.manualAddressData.streetName != ''
          ? {
              ...this.manualAddressData,
              isoCOde: this.selectState,
              town: this.stateList.filter((data: any) => {
                if (isPreState) {
                  return data;
                } else if (data.isocode === this.selectState) {
                  return data;
                }
              })[0].name,
            }
          : null;
      this.activeCartService.getActiveCartId().subscribe(data => {
        let obj = {
          "jobRefNum": this.jobReference,
          "comments": this.comments,
          "products": this.generateSelectedAItem(),
          "deliveryMode": 'Delivery',
          "newDeliveryAddress": {
            country: {
              isocode: 'AU',
            },
            line1: `${this.manualAddress.lotNumber}`,
            line2: `${this.manualAddress.streetName}`,
            address3: `${this.manualAddress.streetType}`,
            address4: `${this.manualAddress.crossStreet}`,
            postalCode: this.manualAddress.postCode,
            region: {
              countryIso: 'AU',
              isocode: this.manualAddress.isoCOde == undefined ? localStorage.getItem('isPreState') : this.manualAddress.isoCOde,
            },
            shippingAddress: true,
            town: `${this.manualAddress.suburb}`,
            visibleInAddressBook: true,
          }
          
        }
      
        this.commonService.setData(obj.deliveryMode);
        this.productHelpService.addProductsToQuote(obj).subscribe(result => {
          
          if(result == "SUCCESS"){
            
            this.infoMessage = 'Thank you, your quote has been submitted successfully.';
            this.successInd$.next(true);
            setTimeout(() => {
              this.infoMessage = '';
              this.successInd$.next(false);
            }, 10000);
            this.commonService.hide();
          }
        });
        
      });
      
    }

  }

  closeErrorMessage() {
    this.errorInd = false;
    this.successInd = false;
  }

  addAlltoCart() {
    if (this.generateSelectedAItem().length < 1) {
      return
    }
    this.commonService.show();
    this.addToCartEmpty();
    this.createListForm();
    window.scrollTo(0,0);
    setTimeout(this.clearData.bind(this),3000)
    setTimeout(this.clearAll.bind(this),6000);
    this.quoteDataPop = false;
    this.commonService.setPage(this.quoteDataPop);
    this.checked = false;
    this.txtValue = true;
    // this.isDisabled = true;
    this.clearRequestQuoteForm();
    this.submitQuoterevised = false;
    // setTimeout(this.navigateToHome.bind(this),10000)
  }

  // navigateToHome(){
  //   this.router.navigate(['/'])
  // }

  deleteMember(content, element) {
    //  alert(element.listName+ 'element');
    // this.currentItem.listName = this.selectedMyListData.listName;
    this.currentItem.page = 'QuickOrder';
    this.currentItem.heading = 'REMOVE ITEM';
    this.currentItem.clearButton = "Remove";
    this.currentItem.label = 'Are you sure you want to remove this item?';
    this.currentItem.index = element;
    // this.currentItem.userId = this.selectedMyListData.userID;
    this.modalRef = this.modalService.open(content, {
      windowClass: 'deleteList',
      centered: true,
      size: 'md',
    });
    this.modalRef.result.then((result) => {
      if (result) {
      }
    }, (name: any) => {
      if (name != '') {
        // this.infoMessage = this.currentItem.listName + ' has been deleted.'
        // this.successInd = true;
        // setTimeout(() => {
        //   this.successInd = false;
        // }, 10000);
      }
    })
  }

  deleteAllMember(content) {
    //  alert(element.listName+ 'element');
    // this.currentItem.listName = this.selectedMyListData.listName;
    this.currentItem.page = 'QuickOrderClearAll';
    this.currentItem.heading = 'CLEAR ALL';
    this.currentItem.clearButton = "Clear All";
    this.currentItem.label = 'Are you sure? All the products you added will be removed.';
    // this.currentItem.userId = this.selectedMyListData.userID;
    this.modalRef = this.modalService.open(content, {
      windowClass: 'deleteList',
      centered: true,
      size: 'md',
    });
    this.modalRef.result.then((result) => {
      if (result) {
      }
    }, (name: any) => {
      if (name != '') {
        // this.infoMessage = this.currentItem.listName + ' has been deleted.'
        // this.successInd = true;
        // setTimeout(() => {
        //   this.successInd = false;
        // }, 10000);
      }
    })
  }

  deleteSelRow(rowIndex) {
    this.rows.splice(rowIndex, 1);
    this.rowsProduct$.next(this.rows);
    this.calculateSubTotal();
  }
  numberOnly(event, isDeliveryBox): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 43 &&
      charCode !== 32
    ) {
      return false;
    }
    if (isDeliveryBox == 'Delivery') {
      this.orderRefDel = event.target.value;
    } else if (isDeliveryBox == 'Click & Collect') {
      this.orderRefCC = event.target.value;
    }
    return true;
  }

  // ngOnDestroy(){
  //   var compFlag = this.commonService.getFlag();
  //   this.pageState = this.commonService.getPage();
  //   if(this.quoteDataPop == true && this.flagVal == true && compFlag == undefined){
  //     this.openModalQuote();
  //   }
  //   else{

  //   }
  // }

  // openModalQuote(){
  //   this.modalRef = this.modalService.open(ChnageQuotePopupComponent, {
  //     windowClass: 'ChnageQuotePopup',
  //     centered: true,
  //     size: 'lg',
  //   });
  //   this.modalRef.componentInstance.selectedChoice = true;
  //   this.modalRef.result.then((result) => {
  //     console.log("Result Quote:", result)
  //     if(result){
  //       this.router.navigate(['/tpQuickOrderPage']);
  //     }
  //   })
  // }

}

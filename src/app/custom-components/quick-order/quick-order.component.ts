import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { CommonUtils } from './../../core/utils/utils';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { SearchBoxConfig, ModalService } from '@spartacus/storefront';
import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ActiveCartService, MultiCartService, ProductService } from '@spartacus/core';
import { QuickOrderModel } from './quick-order.model'
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';

@Component({
  selector: 'app-quick-order',
  templateUrl: './quick-order.component.html',
  styleUrls: ['./quick-order.component.scss']
})
export class QuickOrderComponent implements OnInit {
  isMobile: boolean = false;
  quickOrderIndex: number = 0
  selectedCode: string = ""
  subTotal: number = 0;
  formattedSubTotal: number = 0.00;
  screenMode = "quickOrder"
  isDisabled: boolean = true;
  searchConfig: SearchBoxConfig = {
    displayProductImages: true,
    displayProducts: true,
    displaySuggestions: false,
    maxProducts: 5

  }
  selectedItemCount = 0
  maxRow = 10
  maxRowMobile = 1;
  rows: Array<QuickOrderModel> = new Array();
  currentItem: any = {};
  modalRef: any;
  rowCount: number = 10;
  errorInd: boolean = false;
  public rowsProduct$ = new BehaviorSubject<any>(this.rows);
  isPricingPermission: boolean;
  addRowLabel: any;
  disableAddToCart: boolean = false;
  addToCartDisabled: boolean = false;
  test: boolean = false;
  dataShow: boolean;
  constructor(private productService: ProductService,
    private activeCartService: ActiveCartService,
    private multiCartService: MultiCartService,
    private router: Router,
    public commonService: CommonService,
    private productHelpService: ProductHelpService,
    private modalService: ModalService,
    private TPUserAccountDetailsService: FIUserAccountDetailsService,
    public ref: ChangeDetectorRef,
    ) {

  }

  async ngOnInit(): Promise<void> {
    this.dataShow = await this.TPUserAccountDetailsService.isPlaceOrdersPermission();
    const url = window.location.href;
    // if(url.includes('/tpQuickOrderPage') && await this.TPUserAccountDetailsService.isPlaceOrdersPermission()){
    //   this.test = true;
    // }
    this.isMobile = CommonUtils.isMobile();
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
    this.commonService.onLoadGTMMethod('other', 'Quick Order', '0', window.location.href);
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
      // console.log(rowItem);
      this.rows.push(rowItem)
    }

    this.rowsProduct$.next(this.rows);
    this.rowsProduct$.subscribe(data => {
      this.rowCount = data.length;
    })
  }

  searchRowHander(rowIndex) {
    this.quickOrderIndex = rowIndex
  }
  prodCodecallBack(product) {
    if (product.isPOAproduct == true) {
      this.errorInd = true;
      setTimeout(() => {
        this.errorInd = false;
      }, 10000);
    } else { 
      this.productService.get(product.code).subscribe((prodData: any) => {
        // console.log("Rows product:", JSON.stringify(prodData))
        if (prodData) {
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
            rowItem.stock = prodData?.stock?.stockLevel + ' In stock'
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

          this.rows[this.quickOrderIndex] = rowItem
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
      rowObj.price = rowObj?.staticPrice * quanObj?.quantity
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
      if(element?.productCode != "") {
        isProductEmpty += 1;
      // }else {
      //   isProductPresent = false
      }
      if (element?.price) {
        this.subTotal += element?.price;
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
        })
      }
    })

    return allSelecteItemArr;
  }

  addToCartEmpty() {
    // this.generateSelectedAItem().forEach(item => {
    //   (<any>window).dataLayer.push({
    //     'event':'Quick Order ATC ClicK',
    //     'eventCategory':'Quick Order ATC',
    //     'eventAction':'Quick Order ATC'
    //   });
    // });
        this.activeCartService.getActiveCartId().subscribe(data => {
      let obj = {
        "cardId": data,
        "carts": this.generateSelectedAItem()
      }
      this.productHelpService.addAllToCart(obj).subscribe(result => {
        if(result)  {
          this.multiCartService.reloadCart(data);
          // let prodIds = [];
          // let prodNames = [];
          result.cartModifications.forEach((element) => {
            console.log('Added element', element);
            // prodIds.push(element.entry.product.code);
            // prodNames.push(element.entry.product.name);
            (<any>window).dataLayer.push({
              'event':'ATC ClicK',
              'eventCategory':'Add To Cart',
              'eventAction':'action', //Pass the product title
              'productId': element.entry.product.code,
              'producName': element.entry.product.description,
              'sku': element.entry.product.code,
              ecommerce: {
                'currency':'AUD',
                items: [{
                  'item_id': element.entry.product.code,
                  'item_name': element.entry.product.description,
                  'price': element.entry.totalPrice.value,
                  'item_brand': element.entry.product.manufacturer,
                  'quantity': element.quantity,
                }]
              },
            });
          });
          // (<any>window).dataLayer.push({
          //   event: 'ATC ClicK',
          //   eventCategory: 'Add To Cart',
          //   eventAction: 'action', //Pass the product title
          //   productId: prodIds,
          //   producName: prodNames,
          //   sku: prodIds,
          // });
          setTimeout(() => {
            this.activeCartService.isStable().subscribe((stable) => {
              if (stable) {
                this.commonService.hide();
                this.router.navigate(['/cart'])
              }
            })
          });
        }
      })
    });
  }

  addAlltoCart() {
    if (this.generateSelectedAItem().length < 1) {
      return
    }
    this.commonService.show();
    this.addToCartEmpty();
  }

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

}//

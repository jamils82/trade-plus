import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { ActiveCartService } from '@spartacus/core';
import { CommonUtils } from './../../../core/utils/utils';
import { MyListService } from 'src/app/core/service/my-list.service';
import { SharedMethodsService } from 'src/app/shared-components/shared-methods.service';
import { Router } from '@angular/router';
import { ModalService } from '@spartacus/storefront';
import { startWith } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-my-list',
  templateUrl: './edit-my-list.component.html',
  styleUrls: ['./edit-my-list.component.scss']
})
export class EditMyListComponent implements OnInit {

  @Output() backToMyList = new EventEmitter();
  @Input() selectedMyListData;
  @Input() userId;
  screenName = 'editMyList';
  currentItem: any = {};
  modalRef: any;
  listName;
  infoMessage: string = '';
  successInd$ = new BehaviorSubject<boolean>(false);
  successInd: boolean = false;
  errorInd: boolean = false;
  isItemChecked: Boolean;
  isAllItemChecked: Boolean;
  selectAllParent: Boolean;
  selectAll: Boolean;
  selectedObj: any = {};
  selectedProducts: any = {};
  selectedItemCount: number = 0;
  selectedArray = new Array();
  productDetailsArray = new Array();
  quantity: number = 0;
  quantityClicked: boolean = false;
  tableData: any = [];
  mobData: any = [];
  viewMoreItems: any = [];
  viewMoreVisible: boolean = false;
  currentValue = 24;
  isMobile: boolean = false;
  addToCartDisabled: boolean = false;
  parentPoaProduct: boolean = false;
  constructor(private modalService: ModalService,
    private router: Router,
    private sharedMethodsService: SharedMethodsService,
    private myListService: MyListService,
    public ref: ChangeDetectorRef,
    private activeCartService: ActiveCartService,
    public commonService: CommonService) { }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.listName = this.selectedMyListData.listName;
    this.editListEntries(this.selectedMyListData.entriesList);
  }
  editListEntries(data) {
    const selectedVal = data.filter(element => {
      return (element.product.addToCartDisabled == true )
    });
    this.addToCartDisabled = selectedVal.length> 0 ? true: false
    const selected = data.filter((element: any) => {
      return (element.product?.price?.formattedValue == 'POA' || element.product?.price?.formattedValue == '$0.00')
    });
    this.parentPoaProduct = selected.length> 0 ? true: false;
    this.tableData = data;
    this.mobData = this.isMobile ? this.tableData.slice(0, 12) : this.tableData;
    if (this.tableData.length > 12 && this.mobData.length != this.tableData.length) {
      this.viewMoreVisible = true;
    }
    else {
      this.viewMoreVisible = false;
    }
  }

  viewMoreClick() {
    this.mobData = this.tableData.slice(0, this.currentValue);
    if (this.tableData.length > 12 && this.mobData.length != this.tableData.length) {
      this.viewMoreVisible = true;
    }
    else {
      this.viewMoreVisible = false;
    }
    this.currentValue += 12;
  }

  selectAllChangeHandler(event) {
    this.selectAllParent = event;
    this.selectAll = this.selectAllParent;
    if (this.selectAllParent) {
      this.selectedArray = [];
      this.selectedItemCount = 0;
      this.selectedMyListData?.entriesList.forEach(element => {
        this.selectedObj = {};
        this.selectedObj.productDetails = element.product;
        this.selectedObj.isChecked = this.isItemChecked;
        this.selectedArray.push(this.selectedObj)
        this.selectedItemCount = this.selectedMyListData?.entriesList?.length;
      });
    } else {
      this.selectedItemCount = 0;
      this.selectedObj = {};
      this.selectedArray = [];
    }
  }

  itemToCartSelected(i, product, event) {
    this.selectedObj = {};
    this.isItemChecked = event
    this.selectedObj.id = i;
    this.selectedObj.productDetails = product;
    this.selectedObj.isChecked = this.isItemChecked;
    if (!this.isItemChecked) {
      this.selectedItemCount -= 1;
      this.selectAllParent = false;
      this.selectedArray = this.selectedArray.filter(item => (item.productDetails.code != this.selectedObj.productDetails.code));
    }
    else {
      this.selectedArray.push(this.selectedObj)
      this.selectedItemCount += 1;
      if (this.selectedItemCount == this.selectedMyListData?.entriesList?.length) {
        this.selectAllParent = true;
      }
    }
  }

  quantityFieldClicked() {
    this.quantityClicked = true;
  }
  quantityHandler(quanObj) {
    this.quantity = quanObj.quantity;
    this.selectedMyListData?.entriesList.forEach(element => {
      if (element.product.code == quanObj.code) {
        element.product.quantity = this.quantity;
      }
    });
  }

  deleteMember(content, element) {
    //  alert(element.listName+ 'element');
    this.currentItem.listName = this.selectedMyListData.listName;
    this.currentItem.page = 'EditList';
    this.currentItem.code = element.code;
    this.currentItem.userId = this.selectedMyListData.userID;
    this.currentItem.quantity = element.quantity;
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
        this.infoMessage = 'Product has been deleted.'
        this.successInd$.next(true);
        setTimeout(() => {
          this.successInd$.next(false);
        }, 10000);
      }
    })
  }

  afterDeleteResponse(response) {
    this.selectedMyListData = response;
    this.mobData = response.entriesList;
    this.ref.markForCheck();
  }

  backToMyListClick() {
    this.backToMyList.emit(false);
  }

  onSave() {
    this.backToMyList.emit(false);
  }

  addToCartProducts() {
    this.productDetailsArray = [];
    // let productCodesArr = [];
    // let productNamesArr = [];
    this.selectedArray.forEach(element => {
      (<any>window).dataLayer.push({
        'event':'ATC ClicK',
        'eventCategory':'Add To Cart',
        'eventAction': 'action', //Pass the product title
        'productId': element.productDetails.code,
        'producName': element.productDetails.name,
        'sku': element.productDetails.code
      });
      // productCodesArr.push(element.productDetails.code);
      // productNamesArr.push(element.productDetails.name);
      this.selectedProducts = {};
      this.selectedProducts.product = element.productDetails
      this.selectedProducts.quantity = element.productDetails.quantity;
      this.productDetailsArray.push(this.selectedProducts);
    });
    // let newProductCodesArr = productCodesArr.join(',');
    // let newProductNamesArr = productNamesArr.join(',');
    // (<any>window).dataLayer.push({
    //   'event':'ATC ClicK',
    //   'eventCategory':'Add To Cart',
    //   'eventAction': 'action', //Pass the product title
    //   'productId': newProductCodesArr,
    //   'producName': newProductNamesArr,
    //   'sku': newProductCodesArr
    //   });
    
    // this.selectedProducts.forEach(element => {

    // });
    if (this.productDetailsArray && this.productDetailsArray.length > 0) {
      // this.commonService.show();
      this.sharedMethodsService.addAllProductsToCArt(this.productDetailsArray);
      this.activeCartService.isStable().subscribe((data) => {
        if (data) {
          // this.commonService.hide();
          this.infoMessage = 'Successfully added to the cart';
          this.successInd$.next(true);
          setTimeout(() => {
            this.successInd$.next(false);
          }, 10000);
        }
      })
    }
  }

  editName(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'editListName', centered: true, size: 'md' });
  }

  public tempListName;
  downloadCSV(listName) {
    this.tempListName = listName;
    this.myListService
      .getDownloadInvoiceCSV(listName)
      .subscribe((resp: HttpResponse<Blob>) => {
        this.downloadFile(resp.body, 'Lists_' + this.tempListName + '.csv');
      });
  }

  downloadFile(data: any, fileName: string) {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  newNameEventEmitter(event) {
    this.listName = event
  }

  saveClicked() {
    let productArray = [];
    let saveChanges = {};
    this.selectedMyListData?.entriesList.forEach(element => {
      productArray.push({ 'code': element.product.code, 'quantity': element.product.quantity })
    })
    if (this.quantityClicked) {
      saveChanges = {
        deleteProduct: false,
        listName: this.listName,
        productEntry: productArray,
        userID: this.userId
      }
      let templateClass = document.getElementsByClassName("MYListPageTemplate") as HTMLCollectionOf<HTMLElement>;
      // templateClass[1].style.backgroundColor = "white";
      // templateClass[1].style.opacity = "0.5";
      // let style = document.getElementsByClassName("loader") as HTMLCollectionOf<HTMLElement>;
      // if (style && style.length > 0) {
      //   style[0].style.display = "block";
      // }
      
      this.commonService.show();
      this.myListService.saveList(saveChanges).subscribe((result) => {
        this.ref.markForCheck()
        this.selectedMyListData = result;
        this.editListEntries(result?.entriesList)
        productArray = [];
        saveChanges = {};
        this.quantityClicked = false;
        for (let i = 0; i < result.entriesList.length; i++) {
          this.itemToCartSelected(i, result.entriesList[i].product, false);
        }
        this.selectAllChangeHandler(false);
        this.selectedItemCount = 0;
        this.selectedArray = [];
        this.commonService.hide();
      }, (error) => {
       
        this.commonService.hide();
      }),
        (error) => {
        this.commonService.hide();
        }
    }
  }
}

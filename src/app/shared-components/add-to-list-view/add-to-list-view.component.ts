import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '@spartacus/core';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CurrentProductService } from '@spartacus/storefront';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-to-list-view',
  templateUrl: './add-to-list-view.component.html',
  styleUrls: ['./add-to-list-view.component.scss'],
})
export class AddToListViewComponent implements OnInit {
  products$: Observable<Product> =
    this.currentProductService.getProduct('SPECIFICATIONS');
  @Input() selectedItemCount?: number;
  @Input() screenName: string;
  @Input() product?: Product;
  @Input() productCode?: number;
  @Input() quantity: number;
  @Input() isPOAProduct: boolean = false;
  @Output() successMessageEmitter = new EventEmitter<boolean>();
  modalRef: any;
  mylist: any;
  emailId: string;

  constructor(
    public modalService: NgbModal,
    public myListService: MyListService,
    private currentProductService: CurrentProductService,
    public userProfileDetailsService: FIUserAccountDetailsService,
    public productHelpService: ProductHelpService
  ) {}

  ngOnInit(): void {
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
      }
    });
  }

  addSelectedItemToList(content: any) {
    if (
      this.screenName == 'plpListScreenSingleItem' ||
      this.screenName == 'plpGridScreenSingleItem'
    ) {
      this.productHelpService.setSelectedProductCode(
        this.product?.code,
        this.quantity
      );
    }
    if (this.screenName == 'pdpScreen') {
      this.productHelpService.setSelectedProductCode(
        this.productCode,
        this.quantity
      );
    }
    if (this.screenName == 'cartScreen') {
      (<any>window).dataLayer.push({
        event: 'Save List from Cart Click',
        userId :this.emailId,
        accountId :localStorage.getItem('selectedIUID'),
        step_label : 'Save as List Click',
        step: 1
      });
    } 
    this.myListService.setTitle(this.product?.name);
    this.myListService.setcurrentScreen(this.screenName);
    // **** then call popup .
    this.openAddToListDialog(content);
    //alert(this.productHelpService.generatePlpAddAllItem(true))
  }
  getMyList() {
    const data = {
      userId: localStorage.getItem('selectedIUID'),
      email: this.emailId,
    };

    this.myListService.getMyList(data).subscribe((result) => {
      if (result && result.myList && result.myList.length > 0) {
        this.mylist = result.myList.filter(
          (element) => element.type == 'MYLIST'
        );
      }
    }),
      (error) => {
        // console.log(error);
      };
  }

  openAddToListDialog(content) {
    if (this.isPOAProduct) return;
    this.modalRef = this.modalService.open(content, {
      windowClass: 'addListpopup',
      centered: true,
      size: 'lg',
    });
    this.modalRef.result.then(
      (result) => {
        if (result === 'success') {
        }
      },
      (list: any) => {
        if (list != '' && list != undefined) {
          this.successMessageEmitter.emit(true);
          let finalList = list.split(',');
          for (let i = 0; i < finalList.length; i++) {
            //  console.log(list);
            this.myListService
              .addItemToList(finalList[i])
              .subscribe((result) => {
                // console.log(result);
              }),
              (error) => {
                // console.log(error);
              };
          }
        }
      }
    );
  }
}

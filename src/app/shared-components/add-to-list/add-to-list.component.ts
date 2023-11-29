import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CurrentProductService } from '@spartacus/storefront';
import { Product } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-to-list',
  templateUrl: './add-to-list.component.html',
  styleUrls: ['./add-to-list.component.scss'],
})
export class AddToListComponent implements OnInit {
  productName: string;
  products$: Observable<Product> =
    this.currentProductService.getProduct('SPECIFICATIONS');
  listForm: FormGroup;
  emailId: string;
  @Input() screenName: string;
  @Input() product: any;
  selectedList: any = [];
  mylist: any;
  selectedUID: string;
  dummyLists: any;
  errorInd: boolean = false;
  successInd: boolean = false;
  infoMesasge: string = '';
  constructor(
    private modalService: NgbModal,
    public myListService: MyListService,
    private currentProductService: CurrentProductService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.show();
    this.createListForm();
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.getMyList();
      }
    });
    this.products$.subscribe((data) => {
      this.productName = data.name;
    });
  }
  closePopup() {
    this.modalService.dismissAll();
  }
  filterLists(value) {
    this.mylist = JSON.parse(JSON.stringify(this.dummyLists));
    this.mylist = this.mylist.filter((filtered) =>
      filtered.listName.toLowerCase().includes(value.toLowerCase())
    );
  }
  get f() {
    return this.listForm.controls;
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

  getMyList() {
    this.selectedUID = localStorage.getItem('selectedIUID');
    const data = {
      userId: this.selectedUID,
      email: this.emailId,
    };

    this.myListService.getMyList(data).subscribe((result) => {
      this.commonService.hide();
      if (result && result.myList && result.myList.length > 0) {
        this.mylist = result.myList.filter(
          (element) => element.type == 'MYLIST'
        );
        this.dummyLists = this.mylist;
      }
    },
      (error) => {
        this.commonService.hide();
        // console.log(error);
      });
  }
  itemToCartSelected(evt, ind) {
    if (evt.target.checked) {
      this.selectedList.push(this.mylist[ind].listName);
    } else {
      this.selectedList.splice(ind, 1);
    }
  }
  addList() {
    if (this.selectedList.length > 0) {
      this.modalService.dismissAll(this.selectedList.toString());
      // For Google analytics
      if (this.screenName == 'cartScreen') {
        (<any>window).dataLayer.push({
          event: 'Save List from Cart Click',
          userId :this.emailId,
          accountId :localStorage.getItem('selectedIUID'),
          step_label : 'Save as List Added',
          step: 2
        });
      } else if (this.screenName == 'quickOrderMultiItem') {
        (<any>window).dataLayer.push({
          event: 'Quick Order ATL',
          eventCategory: 'Quick Order ATL',
          eventAction: 'Quick Order ATL',
          userId :this.emailId,
          accountId :localStorage.getItem('selectedIUID'),
        });
      } else {
        (<any>window).dataLayer.push({
          event: 'ATL ClicK',
          eventCategory: 'Add To List',
          userId :this.emailId,
          accountId :localStorage.getItem('selectedIUID'),
          item_name: this.product.name, //Pass the product title
          item_list_name: this.screenName || 'Screen Name', //Pass the screen title or category from where the user clicking on Add to List
        });
      }
    }
  }
  createList() {
    if (this.listForm.invalid) {
      return;
    }
    let list: any = {
      listName: this.listForm.get('listName').value,
      userID: this.emailId,
    };
    (<any>window).dataLayer.push({
      event: 'New List Click',
      eventCategory: 'New List',
      eventAction: this.listForm.get('listName').value, //Pass the product title
    });
    this.myListService.createMyList(list).subscribe(
      (result) => {
        this.successInd = true;
        this.infoMesasge = 'New list created successfully';
        this.createListForm();
        setTimeout(() => {
          this.successInd = false;
        }, 10000);
        this.getMyList();
      },
      (error) => {
        this.errorInd = true;
        this.infoMesasge = 'List name already exists';
        setTimeout(() => {
          this.errorInd = false;
        }, 10000);
      }
    );
  }
}

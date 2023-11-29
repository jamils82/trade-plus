import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveCartService, MultiCartService } from '@spartacus/core';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { SharedMethodsService } from '../shared-methods.service';

@Component({
  selector: 'app-add-from-list',
  templateUrl: './add-from-list.component.html',
  styleUrls: ['./add-from-list.component.scss']
})
export class AddFromListComponent implements OnInit {
  buttonDisable: boolean = true;
  emailId: string;
  @Input() screenName: string;
  selectedList: any;
  mylist: any;
  selectAll: any = [];
  selectedUID: string;
  dummyLists: any;
  constructor(
    private modalService: NgbModal,
    public myListService: MyListService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public sharedMethodsService: SharedMethodsService,
    public commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.show();
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.getMyList();
      }
    });
    (<any>window).dataLayer.push({
      'event':'ALTC ClicK',
      'step': 1,
      'step_label':'Add My List to Cart Loaded'
    });
  }
  closePopup() {
    this.modalService.dismissAll();
  }
  filterLists(value) {
    this.mylist = JSON.parse(JSON.stringify(this.dummyLists));
    this.mylist = this.mylist.filter(filtered => filtered.listName.toLowerCase().includes(value.toLowerCase()));
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
        this.mylist = result.myList.filter(element => element.type == 'MYLIST');
        this.dummyLists = this.mylist;
      }
    },
      (error) => {
        this.commonService.hide();
      });
  }
  itemToCartSelected(i) {
    this.selectedList = this.mylist[i].entriesList;
    // console.log(this.selectedList)
    this.buttonDisable = this.selectedList && this.selectedList.length > 0 ? false: true;
  }
  addList() {
    if (this.selectedList != undefined) {
      this.sharedMethodsService.addAllProductsToCArt(this.selectedList);
      this.modalService.dismissAll(true);
    }
    (<any>window).dataLayer.push({
      'event':'ALTC ClicK',
      'step': 2,
      'step_label':'Add to Cart Clicked'
    });
  }

}

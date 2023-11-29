import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveCartService, MultiCartService } from '@spartacus/core';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { SharedMethodsService } from '../shared-methods.service';
import { RequestquoteComponent } from '../../custom-components/request-quote-mod/requestquote/requestquote.component';

@Component({
  selector: 'app-add-from-mylist',
  templateUrl: './add-from-mylist.component.html',
  styleUrls: ['./add-from-mylist.component.scss']
})
export class AddFromMylistComponent implements OnInit {
buttonDisable: boolean = true;
  emailId: string;
  @Input() screenName: string;
  @Output() prodCodecallBack = new EventEmitter();
  selectedList: any;
  finalList : any = [];
  mylist: any;
  selectAll: any = [];
  checkedList:any = [];
  listNameArray: Array<any> = [];
  selectedUID: string;
  dummyLists: any;
  elementData: any = {};
  flagVal: any;
  // myList: any = 'fromMyList'
  // indexorder: number = 0;
  constructor(
    private modalService: NgbModal,
    public myListService: MyListService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public sharedMethodsService: SharedMethodsService,
    public commonService: CommonService,
    public request: RequestquoteComponent) { }

  ngOnInit(): void {
    this.commonService.show();
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.getMyList();
      }
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
    // console.log(i)
    // console.log(this.mylist[i])
    this.selectedList = this.mylist[i].entriesList;
    // console.log(this.selectedList);
    this.selectedList.forEach(data => {
      this.finalList.push(data);
     })
    this.buttonDisable = this.finalList && this.finalList.length > 0 ? false: true;
  }

 

  addList() {
      if (this.finalList != undefined) {
        for(var i=0; i<this.finalList.length; i++){
          this.elementData.code = this.finalList[i].product.code;
        }
        for(var j=0; j<this.request.rows.length; j++){
          if(this.request.rows[j]['details']== '--'){
          for(var i=0; i<this.finalList.length; i++){
            this.flagVal = 'list';
            this.elementData.code = this.finalList[i].product.code;
            this.request.searchRowHanderQuote(j, this.elementData, this.flagVal);
            j=j+1;
          }
          break;
        }
        }
      
      this.modalService.dismissAll(true);
    }
  }

}

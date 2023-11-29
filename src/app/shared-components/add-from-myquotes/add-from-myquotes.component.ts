import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveCartService, MultiCartService } from '@spartacus/core';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { MyListService } from 'src/app/core/service/my-list.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { QuickOrderModel } from 'src/app/custom-components/quick-order/quick-order.model';
import { RequestquoteComponent } from 'src/app/custom-components/request-quote-mod/requestquote/requestquote.component';
import { SharedMethodsService } from '../shared-methods.service';

@Component({
  selector: 'app-add-from-myquotes',
  templateUrl: './add-from-myquotes.component.html',
  styleUrls: ['./add-from-myquotes.component.scss']
})


export class AddFromMyquotesComponent implements OnInit {
  buttonDisable: boolean = true;
  emailId: string;
  selectedList: any;
  elementData: any = {};
  myQuotelist: any;
  selectAll: any = [];
  selectedUID: string;
  dummy: any;
  finalList: any = [];
  jobRefer: any;
  flagVal: string;
  // Array<QuickOrderModel> = new Array();
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
          this.getMyQuoteList();
        }
      });
    }

    closePopup() {
      this.modalService.dismissAll();
    }

    filterMyQuotesLists(value) {
      // console.log(value)
      this.myQuotelist = JSON.parse(JSON.stringify(this.dummy));
      this.myQuotelist = this.myQuotelist.filter(filtered => filtered.quoteCode.includes(value));
      
    }

    getMyQuoteList() {
      this.selectedUID = localStorage.getItem('selectedIUID');
      const data = {
        userId: this.selectedUID,
        email: this.emailId,
      };
      
      this.myListService.getMyQuoteList(data).subscribe((result) => {
        // console.log("Mylist:", JSON.stringify(result))
        this.commonService.hide();
        if (result && result.quotes && result.quotes.length > 0) {
          this.myQuotelist = result.quotes.filter(element => element.type == 'QUOTE');
          
          // this.jobRefer = "Megha"
          this.dummy = this.myQuotelist;
        }
      },
        (error) => {
          this.commonService.hide();
        });
    }

    itemToCartSelected(i) {
      
      this.selectedList = this.myQuotelist[i].entries;
      // console.log("Slected data:", JSON.stringify(this.selectedList))
      this.selectedList.forEach(data => {
        this.finalList.push(data);
       })
    
      // this.buttonDisable = this.selectedList && this.selectedList.length > 0 ? false: true;
      this.buttonDisable = this.finalList && this.finalList.length > 0 ? false: true;
    }

    addList() {

    //   if (this.selectedList != undefined) {
    //     for(var i=0; i<this.selectedList.length; i++){
    //       this.elementData.code = this.selectedList[i].product.code;
    //     }
    //     for(var j=0; j<this.request.rows.length; j++){
    //       if(this.request.rows[j]['details']== '--'){
    //       for(var i=0; i<this.selectedList.length; i++){
    //         this.elementData.code = this.selectedList[i].product.code;
    //         console.log("Element data:", this.elementData);
    //         this.request.searchRowHanderQuote(j, this.elementData);
    //         j=j+1;
    //       }
    //       break;
    //     }
    //   }
    //   this.modalService.dismissAll(true);
    // }
     
      if (this.finalList != undefined) {
        for(var i=0; i<this.finalList.length; i++){
          this.elementData.code = this.finalList[i].product.code;
        }
        for(var j=0; j<this.request.rows.length; j++){
          if(this.request.rows[j]['details']== '--'){
          for(var i=0; i<this.finalList.length; i++){
            this.flagVal = 'myQuote';
            this.elementData.code = this.finalList[i].product.code;
            // console.log("Element data:", this.elementData);
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
  

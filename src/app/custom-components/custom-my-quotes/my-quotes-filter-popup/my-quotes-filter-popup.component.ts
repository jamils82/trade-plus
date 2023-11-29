import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-my-quotes-filter-popup',
  templateUrl: './my-quotes-filter-popup.component.html',
  styleUrls: ['./my-quotes-filter-popup.component.scss']
})
export class MyQuotesFilterPopupComponent implements OnInit {

  @Input() public status : any;
  statusChecked: any = [];
  checkAll: boolean;
  checkboxAll: boolean;
  filterValues: any = [];
  isItemChecked:Boolean;
  isAllItemChecked: Boolean;
  selectAllType: Boolean = false;
  selectAll: Boolean;
  selectedObj: any = {};
  selectedProducts: any = {};
  selectedTypeCount: number = 0;
  selectedTypeArray = new Array();
  typeChecked: Boolean = false;
  count = 0;
  selectedStatusCount: number = 0;
  @Output() typeSelected = new EventEmitter()
  @Output() doMobFilter = new EventEmitter();
  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    if(this.status){
      this.statusChecked = [ ...this.statusChecked, ...this.status];
      this.selectedStatusCount = this.statusChecked.length;
    }
  }
  closePopup() {
    this.modalService.dismissAll('');
  }

  applyFilter(){
    this.doMobFilter.emit({status: this.statusChecked});
    this.modalService.dismissAll('');
  }
  clearAll() {
    this.checkAll = false;
    this.checkboxAll = false;
    this.statusChecked = [];
    this.status = [];
    this.selectedStatusCount = 0;
    this.doMobFilter.emit({status: []});
  }
  filterSelect(event, value: string, type: any){
    if(value == 'ALL'){
      if(event.target.checked){
        this.checkAll = true;
        this.checkboxAll =true;
        this.statusChecked = ['ALL','Active','EXPIRED','SUBMITTED','PENDING','CONVERTED'];
        this.selectedStatusCount = 3;
      }else{
        this.statusChecked = [];
        this.doMobFilter.emit({status: this.statusChecked});
        this.checkAll = false;
        this.checkboxAll = false;
        this.selectedStatusCount = 0;
      }
    }else{
      if(event.target.checked){
        // this.count +=1;
        if(type == 'status'){
          this.statusChecked.push(event.target.checked ? value : '');
          this.selectedStatusCount += 1
          if(this.selectedStatusCount == 2){
            //this.checkAll = true;
           // this.checkboxAll = true;
         //   this.statusChecked = ['ALL','Active','EXPIRED'];
          }
        }
      }else{
        // this.count -= 1;
          if(this.statusChecked.indexOf('ALL') >= 0){
            this.checkboxAll = false;
            const index = this.statusChecked.indexOf('ALL');
            this.statusChecked.splice(index, 1);
          }
          const index = this.statusChecked.indexOf(value);
          this.statusChecked.splice(index, 1);
          this.selectedStatusCount -= 1
      }
    }
  }

  typeCheckClick(event){
    let selectedVal:any;
    this.isItemChecked = event.target.checked
    selectedVal = event.target.value;
    if(!this.isItemChecked) {
      this.selectedTypeCount -= 1;
      this.selectAllType = false;
      this.selectedTypeArray = this.selectedTypeArray.filter(item => (item != event.target.value));
    }
    else {
      this.selectedTypeArray.push(event.target.value)
      this.selectedTypeCount += 1;
      if(this.selectedTypeCount == 2) {
        this.selectAllType = true;
      }
    }
  }
}

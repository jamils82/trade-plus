import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-filter-popup-mobile',
  templateUrl: './filter-popup-mobile.component.html',
  styleUrls: ['./filter-popup-mobile.component.scss']
})
export class FilterPopupMobileComponent implements OnInit {
  filterValues: any = [];
  isItemChecked:Boolean;
  isAllItemChecked: Boolean;
  selectAllType: Boolean;
  selectAllStatus: Boolean;
  selectAll: Boolean;
  selectedObj: any = {};
  selectedProducts: any = {};
  selectedTypeCount: number = 0;
  selectedStatusCount: number = 0;
  typeChecked: any = [];
  statusChecked: any = [];
  typeCheckAll: Boolean;
  typeCheckboxAll: Boolean;
  statusCheckAll: Boolean;
  statusCheckboxAll: Boolean;
  @Output() doMobFilter = new EventEmitter();
  @Input() public type : any;
  @Input() public status : any;

  constructor(
    private modalService: NgbModal,
    public ref: ChangeDetectorRef
  ) {
  }
  closePopup() {
    this.modalService.dismissAll('');
  }
  ngOnInit(): void {
    if(this.type){
      this.typeChecked = [ ...this.typeChecked, ...this.type];
      this.selectedTypeCount = this.typeChecked.length;
    }
    if(this.status){
      this.statusChecked = [ ...this.statusChecked, ...this.status];
      this.selectedStatusCount = this.statusChecked.length;
    }
  }

  clearAll() {
    this.typeCheckboxAll = false;
    this.typeCheckAll = false;
    this.selectedTypeCount = 0;
    this.typeChecked = [];

    this.statusCheckboxAll = false;
    this.statusCheckAll = false;
    this.selectedStatusCount = 0;
    this.statusChecked = [];
    this.status = [];
    this.type = [];
    this.doMobFilter.emit({type: [], status: []});
    this.ref.markForCheck()
  }

  typeFilterSelect(event, value: string, type: any){
    if(value == 'ALL'){
      if(event.target.checked){
        this.typeCheckAll = true;
        this.typeCheckboxAll =true;
      this.typeChecked = ['ALL','MYLIST','TEMPLATE'];
      this.selectedTypeCount = 3;
      }else{
        this.typeChecked = [];
        this.doMobFilter.emit({type: this.typeChecked, status: []});
        this.typeCheckAll = false;
        this.selectedTypeCount = 0;
      }
    }else{
      if(event.target.checked){
        if(type == 'type'){
          this.typeChecked.push(event.target.checked ? value : '');
          this.selectedTypeCount += 1
          if(this.selectedTypeCount == 2){
            this.typeCheckAll = true;
            this.typeCheckboxAll = true;
            this.typeChecked = ['ALL','MYLIST','TEMPLATE'];
          }
        }
      }else{
          if(this.typeChecked.indexOf('ALL') >= 0){
            this.typeCheckboxAll = false;
            const index = this.typeChecked.indexOf('ALL');
            this.typeChecked.splice(index, 1);
          }
          const index = this.typeChecked.indexOf(value);
          this.typeChecked.splice(index, 1);  
          this.selectedTypeCount -= 1
      }
    }
  }

  statusFilterSelect(event, value: string, type: any){
    if(value == 'ALL'){
      if(event.target.checked){
        this.statusCheckAll = true;
        this.statusCheckboxAll =true;
        this.statusChecked = ['ALL','Active','Archived'];
        this.selectedStatusCount = 3;
      }else{
        this.statusChecked = [];
        this.doMobFilter.emit({status: this.statusChecked});
        this.statusCheckAll = false;
        this.selectedStatusCount = 0;
      }
    }else{
      if(event.target.checked){
        if(type == 'status'){
          this.statusChecked.push(event.target.checked ? value : '');
          this.selectedStatusCount += 1
          if(this.selectedStatusCount == 2){
            this.statusCheckAll = true;
            this.statusCheckboxAll = true;
            this.statusChecked = ['ALL','Active','Archived'];
          }
        }
      }else{
          if(this.statusChecked.indexOf('ALL') >= 0){
            this.statusCheckboxAll = false;
            const index = this.statusChecked.indexOf('ALL');
            this.statusChecked.splice(index, 1);
          }
          const index = this.statusChecked.indexOf(value);
          this.statusChecked.splice(index, 1);  
          this.selectedStatusCount -= 1
      }
    }
  }

  applyFilter(){
    this.doMobFilter.emit({type: this.typeChecked, status: this.statusChecked});
    this.modalService.dismissAll('');
  }
}

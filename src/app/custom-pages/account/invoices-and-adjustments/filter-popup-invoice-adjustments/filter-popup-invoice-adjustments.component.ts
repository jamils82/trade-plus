import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-filter-popup-invoice-adjustments',
  templateUrl: './filter-popup-invoice-adjustments.component.html',
  styleUrls: ['./filter-popup-invoice-adjustments.component.scss']
})
export class FilterPopupInvoiceAdjustmentsComponent implements OnInit {

  filterValues: any = [];
  isItemChecked: Boolean;
  isAllItemChecked: Boolean;
  selectAllType: Boolean;
  selectAllStatus: Boolean;
  selectAll: Boolean;
  selectedObj: any = {};
  selectedProducts: any = {};
  selectedTypeCount: number = 0;
  selectedTypeArray = new Array();
  selectedStatusCount: number = 0;
  selectedStatusArray = new Array();
  typeChecked: Boolean;
  statusChecked: Boolean;
  @Input() public type : any;
  @Input() public status : any;
  @Output() statusSelected = new EventEmitter();
  @Output() typeSelected = new EventEmitter();
  @Output() doMobFilter = new EventEmitter();
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    if(this.type){
      this.selectedTypeArray = [ ...this.selectedTypeArray, ...this.type];
    }
    if(this.status){
      this.selectedStatusArray = [ ...this.selectedStatusArray, ...this.status];
    }
  }
  closePopup() {
    this.modalService.dismissAll('');
  }
  applyChanges() {
    this.modalService.dismissAll('');
    this.typeSelected.emit(this.selectedTypeArray);
    this.statusSelected.emit(this.selectedStatusArray);
  }

  clearAll() {
    this.selectedTypeCount = 0;
    this.typeChecked = false;
    this.selectAllType = false;
    this.selectedTypeArray = [];
    this.selectedStatusCount = 0;
    this.statusChecked = false;
    this.selectAllStatus = false;
    this.selectedStatusArray = [];
    this.doMobFilter.emit({type: [], status: []});
  }
  typeAllChecked(event) {
    this.selectAllType = event.target.checked;
    this.selectAll = this.selectAllType;
    if (this.selectAllType) {
      this.selectedTypeArray = [];
      this.selectedTypeCount = 0;
      this.typeChecked = true;
      this.selectedTypeArray.push('ALL','INV', 'CRD')
      this.selectedTypeCount = 2;
    } else {
      this.selectedTypeCount = 0;
      this.typeChecked = false;
      this.selectedTypeArray = [];
    }
  }

  typeCheckClick(event) {
    let selectedVal: any;
    this.isItemChecked = event.target.checked
    selectedVal = event.target.value;
    if (!this.isItemChecked) {
      if(this.selectedTypeArray.indexOf('ALL') >= 0){
        this.selectedTypeArray = this.selectedTypeArray.filter(item => (item != 'ALL'));
        this.selectAllStatus = false;
      }
      this.selectedTypeCount -= 1;
      this.selectAllType = false;
      this.selectedTypeArray = this.selectedTypeArray.filter(item => (item != event.target.value));
    }
    else {
      this.selectedTypeArray.push(event.target.value)
      this.selectedTypeCount += 1;
      if (this.selectedTypeCount == 2) {
        this.selectAllType = true;
      }
    }
  }

  statusAllChecked(event) {
    this.selectAllStatus = event.target.checked;
    this.selectAll = this.selectAllStatus;
    if (this.selectAllStatus) {
      this.selectedStatusArray = [];
      this.selectedStatusCount = 0;
      this.statusChecked = true;
      this.selectedStatusArray.push('ALL','OPEN', 'PAID')
      this.selectedStatusCount = 2;
    } else {
      this.selectedStatusCount = 0;
      this.statusChecked = false;
      this.selectedStatusArray = [];
    }
  }

  statusCheckClicked(event) {
    let selectedVal: any;
    this.isItemChecked = event.target.checked
    selectedVal = event.target.value;
    if (!this.isItemChecked) {
      if(this.selectedStatusArray.indexOf('ALL') >= 0){
        this.selectedStatusArray = this.selectedStatusArray.filter(item => (item != 'ALL'));
      }
      this.selectedStatusCount -= 1;
      this.selectAllStatus = false;
      this.selectedStatusArray = this.selectedStatusArray.filter(item => (item != event.target.value));
    }
    else {
      this.selectedStatusArray.push(event.target.value)
      this.selectedStatusCount += 1;
      if (this.selectedStatusCount == 2) {
        this.selectAllStatus = true;
      }
    }
  }

  applyFilter(){
    this.doMobFilter.emit({type: this.selectedTypeArray, status: this.selectedStatusArray});
    this.modalService.dismissAll('');
  }

  // clearAll(){
  //   this.typeChecked = this.statusChecked = false;
  //   this.type = this.status = [];
  //   this.selectedTypeArray = this.selectedStatusArray = [];
  //   this.doMobFilter.emit({type: [], status: []});
  // }

}


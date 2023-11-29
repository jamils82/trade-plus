import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-oder-deliveries-filter',
  templateUrl: './oder-deliveries-filter.component.html',
  styleUrls: ['./oder-deliveries-filter.component.scss']
})
export class OderDeliveriesFilterComponent implements OnInit {

  @Input() public type : any;
  @Input() public status : any;
  @Output() doMobFilter = new EventEmitter();
  typesChecked: any = [];
  statusChecked: any = [];
  checkAll: boolean;
  checkboxAll: boolean;
  selectedStatusCount: number = 0;
  constructor(
    private modalService: NgbModal,
    public ref: ChangeDetectorRef
  ) { }
  closePopup() {
    this.modalService.dismissAll('');
  }

  ngOnInit(): void {
    if(this.type){
      this.typesChecked = [ ...this.typesChecked, ...this.type];
    }
    if(this.status){
      this.statusChecked = [ ...this.statusChecked, ...this.status];
      this.selectedStatusCount = this.statusChecked.length;
    }
  }
  ngOnChanges() {

  }   
   
  filterSelect(event, value: string, type: any){
    if(value == 'ALL'){
      if(event.target.checked){
        this.checkAll = true;
        this.checkboxAll =true;
        this.statusChecked = ['ALL','PENDING','ORDER_RECEIVED','ORDER_PROCESSING','AWAITING_DISPATCH','BACK_ORDERED','PARTLY_DISPATCHED','DISPATCHED','PARTLY_COMPLETED','COMPLETED'];
        this.selectedStatusCount = 10;
      }else{
        this.statusChecked = [];
        this.doMobFilter.emit({type: this.typesChecked, status: []});
        this.checkAll = false;
      }
    }else{
      if(event.target.checked){
        if(type == 'type'){
          this.typesChecked.push(event.target.checked ? value : '');
        }
        if(type == 'status'){
          this.statusChecked.push(event.target.checked ? value : '');
          this.selectedStatusCount += 1
          if(this.selectedStatusCount == 10){
            this.checkAll = true;
            this.checkboxAll = true;
            this.statusChecked = ['ALL','PENDING','ORDER_RECEIVED','ORDER_PROCESSING','AWAITING_DISPATCH','BACK_ORDERED','PARTLY_DISPATCHED','DISPATCHED','PARTLY_COMPLETED','COMPLETED'];
          }
        }
      }else{
        if(type == 'type'){
          const index = this.typesChecked.indexOf(value);
          this.typesChecked.splice(index, 1);
        }else{
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
    // this.ref.markForCheck();
  }
  clearAll(){
    this.checkAll = false;
    this.checkboxAll = false;
    this.selectedStatusCount = 0;
    this.type = this.status = [];
    this.typesChecked= this.statusChecked = [];
    this.doMobFilter.emit({type: [], status: []});
  }
  applyFilter(){
    this.doMobFilter.emit({type: this.typesChecked, status: this.statusChecked});
    this.modalService.dismissAll('');
  }

}

import { Component, OnInit ,EventEmitter, Output, Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-custom-itemcounter',
  templateUrl: './custom-itemcounter.component.html',
  styleUrls: ['./custom-itemcounter.component.scss']
})
export class CustomItemcounterComponent implements OnInit {
  addToCartForm: FormGroup;
  private qualitySubscribe: Subscription;
  @Output() quantityHandler = new EventEmitter();
  @Input() rowIndex:any;
  @Input() quantity: any;
  constructor() {   
  }

  ngOnInit(): void {
    this.addToCartForm = new FormGroup({
      quantity: new FormControl(this.quantity || 1, { updateOn: 'blur' }),
    });
    this.qualitySubscribe = this.addToCartForm.valueChanges
    .pipe(startWith(this.addToCartForm.value))
    .subscribe((value) =>{

     if( value?.quantity){
      let emtObj:any= {}
      emtObj.quantity = value.quantity
      emtObj.code = this.rowIndex


      this.quantityHandler.emit(emtObj)
     }
    })

  }

}

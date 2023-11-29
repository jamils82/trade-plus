import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, ChangeDetectorRef, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'edit-format-date-popup',
    templateUrl: './edit-format-date-popup.html',
    styleUrls: ['./edit-format-date-popup.scss'],
  })
  
export class EditFormatDatePopup implements OnInit {
    @Input() fieldName: any;
    @Input() dateTimeFormat: any;
    @Input() changeHeading: any;
    @Output() passEntry: EventEmitter<any> = new EventEmitter();
    selectedDateFormat : any = '';
    selectedFieldName = '';
    showFieldName = '' ;

    constructor(   
        private modalService: NgbModal,
        public ref: ChangeDetectorRef){     }
        
        ngOnInit(): void {
        this.showFieldName = this.changeHeading == false ? this.fieldName.fieldName : this.fieldName
    }
    doFilterStatus(getId){
        this.selectedDateFormat = {
            validationKey:this.dateTimeFormat[getId].key,
            validationValue: this.dateTimeFormat[getId].value
        }
    }
    valueChange(val:string){
        this.showFieldName = Number(val) || val.trim() == '' ?  ''  : val;
    }
    closePopup(){
        this.modalService.dismissAll(); 
    }
    saveDate(){
        this.passEntry.emit({process:'save', setDateFormat:this.selectedDateFormat, setFieldName:this.showFieldName });
    }

}
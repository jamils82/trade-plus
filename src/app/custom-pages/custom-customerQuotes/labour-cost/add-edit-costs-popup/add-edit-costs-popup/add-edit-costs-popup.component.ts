import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { labourCost, quoteConstants } from 'src/app/core/constants/general';
import {CustomCancelPopupComponent } from '../../../../../custom-components/custom-customerQuotes/custom-cancel-popup/custom-cancel-popup.component';
import { LabourCostsService } from 'src/app/core/service/customerQuotes/labourCosts.service';
import { Subscription } from 'rxjs';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';

@Component({
  selector: 'app-add-edit-costs-popup',
  templateUrl: './add-edit-costs-popup.component.html',
  styleUrls: ['./add-edit-costs-popup.component.scss']
})
export class AddEditCostsPopupComponent implements OnInit {
  quoteConstants = quoteConstants;
  costConstants = labourCost;
  modalRef: any;
  @Input() public currentTabTitle;
  @Input() public costType;
  @Input() public quoteId;
  @Input() public currentElement;
  chargeRatePlaceholder:string;
  labourCostNamePlaceholder:string;
  private subscription = new Subscription();
  editCost = false;
  existCostnameErrorMsg:any;
  regxInput:any;
  loader=false;
  quantityMaxLength = 5;
  inputLength:any;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private labourCostService: LabourCostsService,
    public activeModal: NgbActiveModal,

  ) { }

  ngOnInit(): void {
    console.log("CostType:", this.costType)
    this.currentTabTitle=this.currentTabTitle=='OtherCosts'?'Other':this.currentTabTitle;

    this.chargeRatePlaceholder=this.currentTabTitle=='Labour'?this.costConstants.chargeRatePlaceholderLabour:
    this.currentTabTitle=='Other'?this.costConstants.chargeRatePlaceholderOther:
    this.currentTabTitle=='Overheads'?this.costConstants.chargeRatePlaceholderOverhead:this.costConstants.chargeRatePlaceholderSubContractor;

    this.labourCostNamePlaceholder=this.currentTabTitle=='Labour'?this.costConstants.namePlaceholderLabour:this.currentTabTitle=='Other'?this.costConstants.namePlaceholderOther:
    this.currentTabTitle=='Overheads'?this.costConstants.namePlaceholderOverhead:this.costConstants.namePlaceholderSubContractor;
 
    let editCurrentTab=this.currentTabTitle=='Other'?'OtherCosts':this.currentTabTitle;
    if(this.currentElement!=undefined){
      console.log(editCurrentTab,'editCurrentTab');
      this.editCost=true;
      if(editCurrentTab == "OtherCosts ") {
        this.subscription.add(this.labourCostService.retrieveLabourOtherCosts(this.quoteId,editCurrentTab).subscribe(res => {
          res.otherCostList.forEach((data) =>{

            if(editCurrentTab ==data.costType){
              data.entries.forEach((entry,index)=>{
                if(this.currentElement==index){
                  this.loader=true;
                  this.addEditCostForm.controls['name'].disable();
                  this.addEditCostForm.get('name').setValue(entry?.name);
                  this.addEditCostForm.get('quantity').setValue(entry?.quantity);
                  this.addEditCostForm.get('price').setValue(entry?.price);
                  this.addEditCostForm.get('notes').setValue(entry?.notes);
                }
              });
            }
          });
     }));
    } else {
      this.subscription.add(this.labourCostService.retrieveLabourCosts(this.quoteId,editCurrentTab).subscribe(res => {
        res.otherCostList.forEach((data) =>{

          if(editCurrentTab ==data.costType){
            data.entries.forEach((entry,index)=>{
              if(this.currentElement==index){
                this.loader=true;
                this.addEditCostForm.controls['name'].disable();
                this.addEditCostForm.get('name').setValue(entry?.name);
                this.addEditCostForm.get('quantity').setValue(entry?.quantity);
                this.addEditCostForm.get('price').setValue(entry?.price);
                this.addEditCostForm.get('notes').setValue(entry?.notes);
              }
            });
          }
        });
   }));
    }
      
    }
  }   
  addEditCostForm = this.fb.group({
    name: new FormControl('',Validators.required),
    price: new FormControl(''),
    quantity: new FormControl('',Validators.required),
    notes:new FormControl(''),
  });
  onSubmit(eventName) {
    let formData = this.addEditCostForm.getRawValue();
    let currentTab=this.currentTabTitle=='Other'?'OtherCosts':this.currentTabTitle;
    console.log(currentTab, 'onsubmit currentTab');
    if(eventName === 'create') {
      this.subscription.add(this.labourCostService.createLabourOtherCosts(this.quoteId,currentTab,formData).subscribe((responseData) => {
        this.modalService.dismissAll(); 
        this.labourCostService.setCostData.next(true);

      }, error => {
        if(error.status==400 && error.error.message=='Other cost name is already existed with specified Type and Quote'){
          window.scroll(0,0);
          this.existCostnameErrorMsg=this.costConstants.existCostnameErrorMsg;
        }
      }));
    }
    else if(eventName === 'edit') {
      console.log(currentTab, "currentTab");
      this.subscription.add(this.labourCostService.updateLabourOtherCosts(this.quoteId,currentTab,formData).subscribe((responseData) => {
        this.modalService.dismissAll(); 
        this.labourCostService.setCostData.next(true);
      }, error => {
      }));
    }
  }
  existNameClear(){
    this.existCostnameErrorMsg='';
  }

  numberOnly(event) {
    console.log(event);
      event.target.name == 'quantity'?
      this.regxInput=event.target.value
       .replace(/[^\d.]|\.(?=.*\.)/, '')
       .replace(/^(\d{4})\d+/, '$1')
       .replace(/(\.\d\d).+/, '$1'):
       this.regxInput=event.target.value
       .replace(/[^\d.]|\.(?=.*\.)/, '')
       .replace(/^(\d{6})\d+/, '$1')
       .replace(/(\.\d\d).+/, '$1')
       if (this.regxInput !== event.target.value) {
       event.target.name == 'quantity'?
       this.addEditCostForm.get('quantity').setValue(this.regxInput): 
       this.addEditCostForm.get('price').setValue(this.regxInput)
   }
   event.target.name == 'quantity'? 
   this.inputLength=this.regxInput.indexOf('.')>1 ? 8 : 6:
   this.inputLength=this.regxInput.indexOf('.')>1 ? 10 : 8;
   this.quantityMaxLength = this.inputLength;

    }
    onPaste(event) {
      event.target.name == 'quantity'?this.regxInput=/^-?\d{0,4}(\.\d{0,2})?$/:this.regxInput=/^-?\d{0,6}(\.\d{0,2})?$/;
     let pastedData = event.clipboardData.getData('text/plain');
     if(pastedData.match(this.regxInput) === null) {
      event.preventDefault();
     }
    }
  addEditCostCancelPopup(){
    if(this.addEditCostForm.pristine== false){
      (document.querySelector(".createQuotePopup") as HTMLElement).style.visibility = 'hidden';
      this.modalRef = this.modalService.open(CustomCancelPopupComponent,{ centered: true,keyboard : false,
      backdrop: 'static',windowClass: 'createQuotePopup',size: 'lg' });
      this.modalRef.componentInstance.cancelPopupTitle = this.costConstants.cancelQuoteLabel;
     }
     else {
      this.modalService.dismissAll(); 
     }
  }
  ngOnDestroy(): void {
    this.existCostnameErrorMsg='';
    this.modalService.dismissAll(); 
    this.subscription.unsubscribe();
  }
}

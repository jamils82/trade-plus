import { Component, OnInit, } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { addEditProduct, addProduct } from 'src/app/core/constants/general';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { AddEditMarkupService } from 'src/app/core/service/customerQuotes/add-edit-markup.service';
import { CustomCancelPopupComponent } from 'src/app/custom-components/custom-customerQuotes/custom-cancel-popup/custom-cancel-popup.component';
@Component({
  selector: 'app-add-edit-markup',
  templateUrl: './add-edit-markup.component.html',
  styleUrls: ['./add-edit-markup.component.scss']
})
export class AddEditMarkupComponent implements OnInit {
  addEditProduct = addEditProduct;
  labelData = addProduct;
  modalRef: any;
  addMarkupForm: FormGroup;
  disabledBtn = false;
  totalValue;
  quoteId: any;
  quantityMaxLength = 5;
  checkLength = false;
  markupPrices: any;
  materialTotal: any;
  materialValues: any;
  constructor(private modalService: NgbModal,
    private jobDetailService: JobDetailsService,
    private addEditMarkup: AddEditMarkupService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {
    this.addMarkupForm = this.fb.group({
      markup: new FormControl('', [Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(5)]),
    });
  }

  ngOnInit(): void {
    this.jobDetailService.totalMaterialAmount.subscribe(res => {
      this.materialValues = res;
      this.totalValue = res?.materialPrice?.value;
    })
    
    this.jobDetailService.sendQuoteId.subscribe(res => {
      this.quoteId = res;
    });
    let priceMultiply;
    if(this.materialValues?.markupPercentage) {
    priceMultiply = this.materialValues?.markupPercentage*this.totalValue;
    this.addMarkupForm.get('markup').setValue(this.materialValues.markupPercentage+'%');
    } else {
    priceMultiply = 30*this.totalValue
    this.addMarkupForm.get('markup').setValue('30%');
    };
    this.markupPrices = (priceMultiply/100).toFixed(2);

    this.materialTotal = (Number(this.markupPrices)+Number(this.totalValue)).toFixed(2);

  }

  openModalCancelPopup() {
    this.jobDetailService.setDetailApiData.next(false);
    if (this.addMarkupForm.pristine == false || (this.addMarkupForm.value.markup > "30%" || this.addMarkupForm.value.markup < "30%")) {
      (document.querySelector(".addMarkupSec") as HTMLElement).style.visibility = 'hidden';
      this.modalRef = this.modalService.open(CustomCancelPopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'addMarkupSec', size: 'lg'
      });
    this.modalRef.componentInstance.cancelPopupTitle = addEditProduct.cancelTitle;
    }
    else {
      this.modalService.dismissAll();
    }
  }

  incriment() {
    let num = this.addMarkupForm.get('markup').value;
    let splitPer = num.split('%')
    num = splitPer[0].split('.');
    let number = ++num[0];
    if (!number) {
      num = 0
    }
    if(splitPer[0].indexOf('.') > 0) {
    this.addMarkupForm.get('markup').setValue(number+'.'+num[1]+'%');
    } else {
    this.addMarkupForm.get('markup').setValue(number+'%');
    }

    let markupValue = this.addMarkupForm.get('markup').value;
    let mValue = markupValue.split('%');
    let priceMultiply = mValue[0]*this.totalValue
    this.markupPrices = (priceMultiply/100).toFixed(2);

    this.materialTotal = (Number(this.markupPrices)+this.totalValue).toFixed(2);
  }

  decriment() {
    let num = this.addMarkupForm.get('markup').value;
    let splitPer = num.split('%')
    let numb = splitPer[0].split('.');
    let number = --numb[0];
    if (number != 0 && number > 0) {
      this.addMarkupForm.get('markup').setValue(number+'.'+numb[1]+'%')
    } 
    if (num.indexOf('.') > -1 && number > -1) {
      this.addMarkupForm.get('markup').setValue(number+'.'+numb[1]+'%')
    } else {
      if (number != -1 && number > -1) {
        this.addMarkupForm.get('markup').setValue(number+'%')
      } 
    }

    let markupValue = this.addMarkupForm.get('markup').value;
    let mValue = markupValue.split('%');
    let priceMultiply = mValue[0]*this.totalValue
    this.markupPrices = (priceMultiply/100).toFixed(2);

    this.materialTotal = (Number(this.markupPrices)+this.totalValue).toFixed(2);
  }


  addMarkupPrice() {
    this.disabledBtn = true;
    let productForm = this.addMarkupForm.getRawValue();
    const payload = {
      markupPercent: productForm.markup.replace('%', ''),
    }
    this.addEditMarkup.addMarkup(payload, this.quoteId).subscribe(res => {
      this.modalService.dismissAll();
      this.disabledBtn = true;
      this.jobDetailService.setTotalValue.next(res.totalPrice.value)
      this.jobDetailService.markupAdded.next(true);
    })
  }

  addPercent() {  
    let markup = this.addMarkupForm.controls['markup'].value;
    let updatedMarkup = markup.indexOf('%') > -1 ? markup : markup+'%';
    this.addMarkupForm.controls['markup'].setValue(updatedMarkup);

    let markupValue = this.addMarkupForm.get('markup').value;
    let mValue = markupValue.split('%');
    let priceMultiply = mValue[0]*this.totalValue
    this.markupPrices = (priceMultiply/100).toFixed(2);
    this.materialTotal = (Number(this.markupPrices)+this.totalValue).toFixed(2);
    if(isNaN(Number(mValue[0])) || mValue[0] == '') {
    this.addMarkupForm.controls['markup'].setValue(0+'%');
    }

  }
  numberOnlyFormat(event): boolean {
    let markup = this.addMarkupForm.controls['markup'].value;
    let markups = markup.indexOf('%') > -1 ? markup.split('%') : markup;

    let validateDescimal = markups.indexOf('.') < 0 ? markups : markups.split('.');
    if(markups.indexOf('.') > -1 && validateDescimal[1].length == 2) {
      this.quantityMaxLength = markups.length;
      return false;
    } 
    else {
      if (event.key == '.' || markups[0].indexOf('.') > -1) {
        let decimal = markups[0].indexOf('.') > -1 ? markups[0].split('.') : markups[0];
        this.quantityMaxLength = markups[0].length <= 5 ? decimal[0].length + 4 : 8;
      } else {
        this.quantityMaxLength = 5;
      }
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode == 47 || (charCode < 46 && charCode != 37) || charCode > 57)) {
      return false;
    }
    return true;
  }
  }
}

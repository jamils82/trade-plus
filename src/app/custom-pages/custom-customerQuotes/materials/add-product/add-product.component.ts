import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuotesService } from 'src/app/core/service/quotes.service';
import { addProduct, quoteConstants } from 'src/app/core/constants/general';
import { Subscription } from 'rxjs';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';
import { AddProductService } from 'src/app/core/service/customerQuotes/add-product.service';
import { CustomCancelPopupComponent } from 'src/app/custom-components/custom-customerQuotes/custom-cancel-popup/custom-cancel-popup.component';
import { MaterialService } from 'src/app/core/service/customerQuotes/material.service';
import { DataService } from 'src/app/core/service/customerQuotes/data.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  labelData = addProduct;
  modalRef: any;
  quoteConstants = quoteConstants;
  addProductForm: FormGroup;
  quoteDetails: any;
  data: any;
  quoteDetailData: any;
  disabledBtn = false;
  limitToText = false;
  checkPaste = false;
  private subscription = new Subscription();
  quoteId: any;
  quantityMaxLength = 5;
  regxInput: any;
  inputLength: any;
  stageId: any;
  quoteHeaderCode: string;
  constructor(private modalService: NgbModal,
    private jobDetailService: JobDetailsService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private addProductService: AddProductService,
    private materialService: MaterialService,
    private dataService: DataService,
  ) {
    this.addProductForm = this.fb.group({
      productName: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      descriptionNote: new FormControl(),
      unitOfMeasure: new FormControl(),
      quantity: new FormControl('1')

    });
  }

  ngOnInit(): void {
    this.quoteHeaderCode = localStorage.getItem('quoteHeaderCode') 
    this.stageId=this.dataService.currentStageId;
    // alert(this.stageId)
    if (window.location.href.includes(this.quoteHeaderCode)){
      // alert("If")
      this.quoteId = this.quoteHeaderCode
    }
    else{
      // alert("Else")
      this.jobDetailService.sendQuoteId.subscribe(res => {
        this.quoteId = res;
      })
    }
    
  }

  openModalCancelPopup() {
    this.jobDetailService.setDetailApiData.next(false);
    if (this.addProductForm.pristine == false) {
      (document.querySelector(".createQuotePopup") as HTMLElement).style.visibility = 'hidden';
      this.modalRef = this.modalService.open(CustomCancelPopupComponent, {
        centered: true, keyboard: false,
        backdrop: 'static', windowClass: 'createQuotePopup', size: 'lg'
      });
      this.modalRef.componentInstance.cancelPopupTitle = this.labelData.cancelTitle;
      //this.jobDetailService.markupAdded.next(true);

    }
    else {
      this.activeModal.close();
      this.modalService.dismissAll();
      //this.jobDetailService.markupAdded.next(true);
    }
  }

  increment() {
    let numbers: any
    let getQty = this.addProductForm.get('quantity').value.toString();
    if (getQty && getQty.indexOf('.') > -1) {
      let priceValue = getQty.split('.');
      numbers = priceValue[1].length > 2 ? priceValue[0] + '.' + priceValue[1].slice(0, -1) : getQty;
    } else {
      numbers = getQty;
    }
    let nums = numbers.toString();
    let num = nums.indexOf('.') > -1 ? nums.split('.') : nums;
    let number = nums.indexOf('.') > -1 ? ++num[0] : ++num;
    if (!number) {
      num = 0
    }
    let updateNum = nums.indexOf('.') > -1 ? number + '.' + num[1] : number;
    this.addProductForm.get('quantity').setValue(updateNum)
  }

  decrement() {
    let numbers: any
    let getQty = this.addProductForm.get('quantity').value.toString();
    if (getQty && getQty.indexOf('.') > -1) {
      let priceValue = getQty.split('.');
      numbers = priceValue[1].length > 2 ? priceValue[0] + '.' + priceValue[1].slice(0, -1) : getQty;
    } else {
      numbers = getQty;
    }
    let num = numbers.toString();
    let numb = num.split('.');
    let number = --numb[0];
    if (number != 0 && number > 0) {
      this.addProductForm.get('quantity').setValue(number + '.' + numb[1])
    }
    if (num.indexOf('.') > -1 && number > -1) {
      this.addProductForm.get('quantity').setValue(number + '.' + numb[1])
    } else {
      if (number != 0 && number > 0) {
        this.addProductForm.get('quantity').setValue(number)
      }
    }
  }


  addOwnProduct() {
    this.disabledBtn = true;
    let productForm = this.addProductForm.getRawValue();
    if (productForm.price.indexOf('.') > -1) {
      let priceValue = productForm.price.split('.');
      productForm.price = priceValue[1].length > 2 ? priceValue[0] + '.' + priceValue[1].slice(0, -1) : productForm.price;
    }
    if (productForm && productForm.quantity.toString().indexOf('.') > -1) {
      let qtyValue = productForm.quantity.split('.');
      productForm.quantity = qtyValue[1].length > 2 ? qtyValue[0] + '.' + qtyValue[1].slice(0, -1) : productForm.quantity;
    }
    let quantity;
    if (productForm.quantity == 0) {
      quantity = 1;
    } else if (productForm.quantity < 0) {
      quantity = 1;
    } else {
      quantity = productForm.quantity;
    }
    const payload = {
      quantity: quantity ? quantity : 1,
      decimalQty: quantity ? quantity : 1,
      product: {
        code: "custom", //for first Instance [static text]
        name: productForm.productName,
        description: productForm.descriptionNote ? productForm.descriptionNote : '',
        unitCode: productForm.unitOfMeasure ? productForm.unitOfMeasure : ''
      },
      basePrice: {
        value: Number(productForm.price)
      },
      customProductFlag: "true"
    }
    this.addProductService.saveProduct(payload, this.quoteId,this.stageId).subscribe(res => {
      this.materialService.allProductAdded(this.quoteId,false);
      this.materialService.updateRetreiveProduct.next(0);
      this.modalService.dismissAll();
      this.disabledBtn = true;
    })
  }

  numberOnly(event): any {
    if (event.target.value != '.' && isNaN(event.target.value) && event.target.name == 'price') {
      this.regxInput = event.target.value
        .replace(/[^\d.]|\.(?=.*\.)/, '')
        .replace(/^(\d{5})\d+/, '$1')
        .replace(/(\.\d\d).+/, '$1')
      this.addProductForm.get('price').setValue(this.regxInput);
      return
    }
    if (event.target.value != '.' && isNaN(event.target.value) && event.target.name == 'quantity') {
      this.regxInput = event.target.value
        .replace(/[^\d.]|\.(?=.*\.)/, '')
        .replace(/^(\d{5})\d+/, '$1')
        .replace(/(\.\d\d).+/, '$1')
      this.addProductForm.get('quantity').setValue(this.regxInput);
      return
    }
    this.regxInput = event.target.value
      .replace(/[^\d.]|\.(?=.*\.)/, '')
      .replace(/^(\d{5})\d+/, '$1')
      .replace(/(\.\d\d).+/, '$1')
    if (this.regxInput !== event.target.value) {
      event.target.value = this.regxInput;
    } else {
    }
    this.inputLength = this.regxInput.indexOf('.') > 1 ? 9 : 6;
    this.quantityMaxLength = this.inputLength;

  }

  onPaste(event) {
    this.regxInput = /^-?\d{0,5}(\.\d{0,2})?$/;
    let pastedData = event.clipboardData.getData('text/plain');
    if (pastedData.match(this.regxInput) === null) {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

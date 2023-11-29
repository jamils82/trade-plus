import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductListItemComponent, ProductListItemContext, ProductListItemContextSource } from '@spartacus/storefront';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';
import { CustomAddtocartComponent } from '../../custom-pdp/custom-addtocart/custom-addtocart.component';



@Component({
  selector: 'app-custom-plp-list-item',
  templateUrl: './custom-plp-list.component.html',
  styleUrls: ['./custom-plp-list.component.scss'],
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
})
export class CustomPlpListComponent extends ProductListItemComponent  {
  @Output()
  selectedCartItem = new EventEmitter<any>();
  @Output() successMessageEmitter = new EventEmitter();
  @ViewChild(CustomAddtocartComponent) customAddCompRef: CustomAddtocartComponent;

  screenName = "plpList";
  selectAll:boolean;
  isItemChecked:Boolean;

  constructor(
    productListItemContextSource: ProductListItemContextSource,
    private productHelpService:ProductHelpService) {
    super(productListItemContextSource)

   }


   ngOnInit(): void {
    this.productHelpService.plpASelectAllChild.subscribe((value)=> this.selectAll=value )
   }

   itemToCartSelected(event){
    this.isItemChecked = event.target.checked
     const seletedItem = {
       productCode:this.product.code,
       isChecked :this.isItemChecked,
       quality : (this.customAddCompRef.addToCartForm.value)?this.customAddCompRef.addToCartForm.value.quantity:1,
       poaProduct: this.product.price?.formattedValue == 'POA' || this.product.price?.formattedValue == '$0.00'? true: false,
       addToCartDisabled: this.product.addToCartDisabled
     }
     this.productHelpService.updatePLPProItem({code:this.product.code, checkBoxUpdate:true,isChecked:this.isItemChecked})
 this.selectedCartItem.emit(seletedItem);
   }
   successMessageEmitterMessage() {
     this.successMessageEmitter.emit();
   }
}

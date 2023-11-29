import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomProductListItemComponent } from './custom-product-list-item.component';
import { ProductDeletePopupComponent } from './product-delete-popup/product-delete-popup.component';



@NgModule({
  declarations: [
    CustomProductListItemComponent, 
    ProductDeletePopupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [CustomProductListItemComponent]
})
export class CustomProductListItemModule { }

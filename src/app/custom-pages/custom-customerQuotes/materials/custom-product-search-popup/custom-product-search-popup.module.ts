import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomProductSearchPopupComponent } from './custom-product-search-popup.component';
import { CustomProductListItemModule } from '../custom-product-list-item/custom-product-list-item.module';
import { CustomLoadMoreModule } from '../custom-load-more/custom-load-more.module';



@NgModule({
  declarations: [
    CustomProductSearchPopupComponent,
  ],
  imports: [
    CommonModule,
    CustomProductListItemModule,
    CustomLoadMoreModule
  ]
})
export class CustomProductSearchPopupModule { }

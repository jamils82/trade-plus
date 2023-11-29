import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {CustomStickyFooterModule} from 'src/app/custom-pages/custom-customerQuotes/custom-sticky-footer/custom-sticky-footer.module';
import { RouterModule } from '@angular/router';
import { MaterialsComponent } from './materials.component';
import { CustomProductListItemModule } from 'src/app/custom-pages/custom-customerQuotes/materials/custom-product-list-item/custom-product-list-item.module';
import { CustomLoadMoreModule } from 'src/app/custom-pages/custom-customerQuotes/materials/custom-load-more/custom-load-more.module';
import { AddProductComponent } from './add-product/add-product.component';
import { CustomProductSearchPopupModule } from './custom-product-search-popup/custom-product-search-popup.module';
import { AddEditMarkupComponent } from './add-edit-markup/add-edit-markup.component';
import { QuotesShareEvents } from 'src/app/shared/customerQuotes/QuotesShareEvents.service';



@NgModule({
  declarations: [
    MaterialsComponent,
    AddProductComponent,
    AddEditMarkupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  //  CustomStickyFooterModule, // Remove sticky footer component later in 10.5 if there is no requirement
    CustomProductListItemModule,
    CustomProductSearchPopupModule,
    CustomLoadMoreModule
  ],
  providers: [
    QuotesShareEvents
  ],
  exports: [MaterialsComponent, AddProductComponent],
})

export class MaterialsModule { }

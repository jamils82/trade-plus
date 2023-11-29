import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewQuoteComponent } from './review-quote.component';
// import { CustomStickyFooterModule } from '../custom-sticky-footer/custom-sticky-footer.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ReviewQuoteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  //  CustomStickyFooterModule // Remove sticky footer component later in 10.5 if there is no requirement
  ]
})
export class ReviewQuoteModule { }

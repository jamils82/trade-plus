import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobDetailComponent } from './job-detail.component';
import { FormsModule } from '@angular/forms';
// import {CustomStickyFooterModule} from 'src/app/custom-pages/custom-customerQuotes/custom-sticky-footer/custom-sticky-footer.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    JobDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
   // CustomStickyFooterModule // Remove sticky footer component later in 10.5 if there is no requirement
  ],
  exports: [JobDetailComponent],
})
export class JobDetailModule { }

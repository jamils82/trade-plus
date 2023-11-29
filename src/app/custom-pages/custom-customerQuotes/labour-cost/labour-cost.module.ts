import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabourCostComponent } from './labour-cost.component';
// import { CustomStickyFooterModule } from '../custom-sticky-footer/custom-sticky-footer.module';
import { AddEditCostsPopupComponent } from './add-edit-costs-popup/add-edit-costs-popup/add-edit-costs-popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [LabourCostComponent, AddEditCostsPopupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  //  CustomStickyFooterModule, // Remove sticky footer component later in 10.5 if there is no requirement
  ],
  exports: [LabourCostComponent],
})
export class LabourCostModule { }

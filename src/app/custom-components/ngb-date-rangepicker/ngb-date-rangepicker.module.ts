import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDateRangepickerComponent } from './ngb-date-rangepicker.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [NgbDateRangepickerComponent],
  imports: [
    CommonModule,
    NgbDatepickerModule
  ],
  exports: [
    NgbDateRangepickerComponent
  ]
})
export class NgbDateRangepickerModule { }

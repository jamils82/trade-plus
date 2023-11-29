import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPaginationDirective } from './custom-paginatior.directive';
import { OutsideClickDirective } from './outside-click.directive';



@NgModule({
  declarations: [AppPaginationDirective, OutsideClickDirective],
  imports: [
    CommonModule
  ],
  exports: [
    AppPaginationDirective, OutsideClickDirective
  ]
})
export class CustomDirectiveModule { }

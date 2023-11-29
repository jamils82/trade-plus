import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomLoadMoreComponent } from './custom-load-more.component';



@NgModule({
  declarations: [CustomLoadMoreComponent],
  imports: [
    CommonModule
  ],
  exports: [CustomLoadMoreComponent]
})
export class CustomLoadMoreModule { }

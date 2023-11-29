import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepagetilesComponent } from './homepagetiles.component';
import { MediaModule } from '@spartacus/storefront';



@NgModule({
  declarations: [HomepagetilesComponent],
  imports: [
    CommonModule,
    MediaModule
  ]
})
export class HomepagetilesModule { }

import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindStoreComponent } from './find-store.component';



@NgModule({
  declarations: [FindStoreComponent],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAvFaeE_BCcuxnbxuSHDft-0oH495tiT3o',
      libraries: ['places']
    })
  ],
  exports: [FindStoreComponent]
})
export class FindStoreModule { }

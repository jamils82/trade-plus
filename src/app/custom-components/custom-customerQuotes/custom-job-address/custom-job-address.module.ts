import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomJobAddressComponent } from './custom-job-address.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    CustomJobAddressComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AutocompleteLibModule // while moving to MICO, will add later

 
  ],
  exports: [CustomJobAddressComponent],
})
export class CustomJobAddressModule { }

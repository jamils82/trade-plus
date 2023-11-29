import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactusComponent } from './contactus.component';
import { CmsConfig, ConfigModule } from '@spartacus/core';



@NgModule({
  declarations: [ContactusComponent],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        FIContactUsComponent: {
          component: ContactusComponent,
        },
      },
    } as CmsConfig)
  ],
  exports: [ContactusComponent]
})
export class ContactusModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpSupportComponent } from './help-support.component';
import { CmsConfig, ConfigModule } from '@spartacus/core';
// import { ContactCustomerServiceModule } from '../contact-cust-service/contact-customer-service/contact-customer-service.module';



@NgModule({
  declarations: [HelpSupportComponent],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        TPHelpAndSupportSlot: {
          component: HelpSupportComponent,
        },
      },
    } as CmsConfig),
    // ContactCustomerServiceModule
  ],exports:[HelpSupportComponent]
})
export class HelpSupportModule { }

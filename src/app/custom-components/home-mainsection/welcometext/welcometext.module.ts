import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcometextComponent } from './welcometext.component';
import { CmsConfig, ConfigModule } from '@spartacus/core';



@NgModule({
  declarations: [WelcometextComponent],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        TPWelcomeTextComponent: {
          component: WelcometextComponent,
        },
      },
    } as CmsConfig)
  ]
})
export class WelcometextModule { }

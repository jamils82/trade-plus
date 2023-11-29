import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CustomNavigationModule } from './../../custom-navigation/custom-navigation.module';
import { HelpSupportModule } from './../../help-support/help-support.module';
import { FindStoreModule } from './../../find-store/find-store.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountdropdownComponent } from './accountdropdown.component';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MobileMenuPopupComponent } from './mobile-menu-popup/mobile-menu-popup.component';





@NgModule({
  declarations: [AccountdropdownComponent, ConfirmationPopupComponent, MobileMenuPopupComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,
    FindStoreModule,
    UrlModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule,
    HelpSupportModule,
    CustomNavigationModule,
    ConfigModule.withConfig({
      cmsComponents: {
        TPAccountDropdownComponent: {
          component: AccountdropdownComponent,
        },
      },
    } as CmsConfig)
  ],
  exports: [AccountdropdownComponent]
})
export class AccountdropdownModule { }

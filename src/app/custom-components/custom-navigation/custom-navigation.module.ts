import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { CustomNavbarComponent } from './custom-navigation/custom-navigation.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ 
    CustomNavbarComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    // MenuModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CategoryNavigationComponent : {
          component : CustomNavbarComponent
        }
      }
    } as CmsConfig)
  ],
  exports: [
    CustomNavbarComponent
  ]
})
export class CustomNavigationModule { }

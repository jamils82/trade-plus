import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { CmsConfig, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { IconModule, MediaModule, SearchBoxModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    IconModule,
    RouterModule,
    MediaModule,
    UrlModule,
    I18nModule,
    SearchBoxModule,
    ConfigModule.withConfig({
      cmsComponents: {
        SearchBoxComponent: {
          component: SearchComponent,
        },
      },
    } as CmsConfig),
  ]
})
export class SearchModule { }

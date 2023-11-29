import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CMSTabParagraphContainer, Product, CmsService, WindowRef } from '@spartacus/core';
import { CurrentProductService, TabParagraphContainerComponent, CmsComponentData, BreakpointService } from '@spartacus/storefront';

@Component({
  selector: 'app-custom-product-tabs',
  templateUrl: './custom-product-tabs.component.html',
  styleUrls: ['./custom-product-tabs.component.scss']
})
export class CustomProductTabsComponent extends TabParagraphContainerComponent implements OnInit {
  activeTabNum:number = 0
  constructor(
    public componentData: CmsComponentData<CMSTabParagraphContainer>,
    protected cmsService: CmsService,
    protected winRef: WindowRef,
    protected breakpointService: BreakpointService
  ) {
    super(componentData, cmsService, winRef, breakpointService)
  }

  ngOnInit(): void {
  }

}

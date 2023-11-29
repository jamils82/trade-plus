import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-custom-product-notice',
  templateUrl: './custom-product-notice.component.html',
  styleUrls: ['./custom-product-notice.component.scss']
})
export class CustomProductNoticeComponent implements OnInit {
  productNoticePageData = [];
  private SITE_URL = environment.siteUrl;

  constructor(
    private cmsService: CmsService
  ) { }

  ngOnInit(): void {
    this.cmsService.getCurrentPage().subscribe(data => {
      let slotComponents = data.slots.ProductNoticeSlot.components;
      for(let i=0; i < slotComponents.length; i++) {
          this.cmsService.getComponentData(slotComponents[i].uid).subscribe((data) => {
            this.productNoticePageData.push(data);
          })
        }
    })
  }
}

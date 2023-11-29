import { Component, OnInit } from '@angular/core';
import { CmsBannerCarouselComponent, CmsBannerComponent, CmsService } from '@spartacus/core';
import { BannerCarouselComponent, CmsComponentData } from '@spartacus/storefront';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent extends BannerCarouselComponent implements OnInit {
  constructor(private service: CmsService, public component: CmsComponentData<CmsBannerCarouselComponent>) { super(component, service) }

  ngOnInit(): void {
  }

}

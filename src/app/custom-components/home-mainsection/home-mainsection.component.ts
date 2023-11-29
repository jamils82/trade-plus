import { Component, OnInit } from '@angular/core';
import { CmsBannerComponent, CmsService } from '@spartacus/core';
import { CmsComponentData } from '@spartacus/storefront';

@Component({
  selector: 'app-home-mainsection',
  templateUrl: './home-mainsection.component.html',
  styleUrls: ['./home-mainsection.component.scss']
})

export class HomeMainsectionComponent implements OnInit {
  landingPageTiles: any;
  
  constructor(private cmsService: CmsService, public component: CmsComponentData<CmsBannerComponent>) { }

  ngOnInit(): void {
   
  }

}

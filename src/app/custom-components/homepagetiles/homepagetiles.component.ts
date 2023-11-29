import { Component, OnInit } from '@angular/core';
import { CmsBannerComponent } from '@spartacus/core';
import { CmsComponentData } from '@spartacus/storefront';

@Component({
  selector: 'app-homepagetiles',
  templateUrl: './homepagetiles.component.html',
  styleUrls: ['./homepagetiles.component.scss']
})
export class HomepagetilesComponent implements OnInit {

  constructor(public component: CmsComponentData<CmsBannerComponent>) { }

  ngOnInit(): void {
  }

}

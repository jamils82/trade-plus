import { CmsComponentData } from '@spartacus/storefront';
import { Component, OnInit } from '@angular/core';
import { CmsParagraphComponent, CmsService } from '@spartacus/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  paragraphData: any;
  faqArray: any = [];
  constructor(public cmsService: CmsService,
    ) { }

  ngOnInit(): void {
    this.cmsService.getCurrentPage().subscribe((ytList) => {
      let listItems = ytList.slots.Section1.components;
      for(let i=0; i < listItems.length; i++) {
          this.cmsService.getComponentData(listItems[i].uid).subscribe((data) => {
          this.faqArray.push(data);
          this.paragraphData = data;
        })
      }
    })
  }

}

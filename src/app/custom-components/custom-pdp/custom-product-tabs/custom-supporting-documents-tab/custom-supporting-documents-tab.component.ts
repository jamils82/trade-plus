import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';
import { Product, ProductScope } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-custom-supporting-documents-tab',
  templateUrl: './custom-supporting-documents-tab.component.html',
  styleUrls: ['./custom-supporting-documents-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSupportingDocumentsTabComponent  implements OnInit {
  maintananceCareData: any;
  msdsData: any;
  welsCertificate: any;
  ownersGuideDoc: any;
  technicalSpecificationDoc: any;
  // product$: Observable<Product> = this.currentProductService.getProduct(
  //   ProductScope.ATTRIBUTES
  // );
  specification$: Observable<Product> = this.currentProductService.getProduct(
    'SPECIFICATIONS'
  );
  constructor(protected currentProductService: CurrentProductService) {}

  ngOnInit(): void {
    this.specification$.subscribe((data: any) => {
      if(data?.maintenanceCare) {
        this.maintananceCareData = data?.maintenanceCare.split(',');
      }
      if(data?.msds) {
        this.msdsData = data?.msds.split(',');
      }
      if(data?.technicalSpecificationDoc) {
        this.technicalSpecificationDoc = data?.technicalSpecificationDoc.split(',');
      }
      if(data?.ownersGuideDoc) {
        this.ownersGuideDoc = data?.ownersGuideDoc.split(',');
      }
      if(data?.welsCertificate) {
        this.welsCertificate = data?.welsCertificate.split(',');
      }
    })
  }

}



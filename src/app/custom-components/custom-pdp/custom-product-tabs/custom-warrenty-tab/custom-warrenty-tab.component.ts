import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';
import { Product, ProductScope } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-custom-warrenty-tab',
  templateUrl: './custom-warrenty-tab.component.html',
  styleUrls: ['./custom-warrenty-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomWarrentyTabComponent implements OnInit {
  warrentyData: any;
  // product$: Observable<Product> = this.currentProductService.getProduct(
  //   ProductScope.ATTRIBUTES
  // );
  specification$: Observable<Product> = this.currentProductService.getProduct(
    'SPECIFICATIONS'
  );
  constructor(protected currentProductService: CurrentProductService) {}

  ngOnInit(): void {
    this.specification$.subscribe((data: any) => {
      if(data?.warrantyDownloads) {      
      this.warrentyData = data?.warrantyDownloads.split(',');
      }
    })
  }

}



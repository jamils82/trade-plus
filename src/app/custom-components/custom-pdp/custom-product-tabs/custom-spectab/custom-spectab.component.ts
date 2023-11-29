import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';
import { Product, ProductScope } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-custom-spectab',
  templateUrl: './custom-spectab.component.html',
  styleUrls: ['./custom-spectab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSpectabComponent  implements OnInit {
  videoData: any;
  // product$: Observable<Product> = this.currentProductService.getProduct(
  //   ProductScope.ATTRIBUTES
  // );
  specification$: Observable<Product> = this.currentProductService.getProduct(
    'SPECIFICATIONS'
  );
  constructor(protected currentProductService: CurrentProductService) {}

  ngOnInit(): void {
    this.specification$.subscribe((data: any) => {
      if(data?.video) {
        this.videoData = data?.video.split(',');
      }
    })
  }

}



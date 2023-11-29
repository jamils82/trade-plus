import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-price',
  templateUrl: './product-price.component.html',
  styleUrls: ['./product-price.component.scss']
})
export class ProductPriceComponent implements OnInit {

  @Input() myPrice:any;
  @Input() unit?: any;
  @Input() retailPrice:any;
  // @Input() unit?: any;
  @Input() plpGrid: boolean; // ?? need to revove instead screenName should use
  @Input() screenName: String;
  @Input() showEmptyPrice: boolean;
  isPricingPermission: boolean;
  constructor(private TPUserAccountDetailsService: FIUserAccountDetailsService,
    public ref: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.getPricingPermission();
  }
  async getPricingPermission() {
    this.isPricingPermission = await this.TPUserAccountDetailsService.isPricingPermission();
    this.ref.markForCheck();
  }
}
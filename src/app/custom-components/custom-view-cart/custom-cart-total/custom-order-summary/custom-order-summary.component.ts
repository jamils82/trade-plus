import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrderSummaryComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-custom-order-summary',
  templateUrl: './custom-order-summary.component.html',
  styleUrls: ['./custom-order-summary.component.scss']
})
export class CustomOrderSummaryComponent extends OrderSummaryComponent implements OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    
  }


}

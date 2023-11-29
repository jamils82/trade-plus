import { CommonUtils } from 'src/app/core/utils/utils';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActiveCartService, MultiCartService, SelectiveCartService, UserIdService } from '@spartacus/core';
import { CartItemListComponent } from '@spartacus/storefront';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-custom-cart-list',
  templateUrl: './custom-cart-list.component.html',
  styleUrls: ['./custom-cart-list.component.scss']
})
export class CustomCartListComponent extends CartItemListComponent implements OnInit {
  isMobile: boolean = false;
  viewMoreItems: any = [];
  viewMoreVisible: boolean = false;
  currentValue = 24;
  constructor(
    activeCartService: ActiveCartService,
    selectiveCartService: SelectiveCartService,
    userIdService: UserIdService,
    multiCartService: MultiCartService,
    public ref: ChangeDetectorRef
  ) {
    super(activeCartService, selectiveCartService, userIdService, multiCartService)
  }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.activeCartService
      .getEntries().subscribe((entries) => {
        this.viewMoreItems = this.isMobile && entries.length > 12 ? entries.slice(0, 12) : entries;
        if (entries.length > 12 && this.viewMoreItems.length != entries.length) {
          this.viewMoreVisible = true;
        }
        else {
          this.viewMoreVisible = false;
        }
        this.ref.markForCheck();
      });

  }

  viewMoreClick() {
    this.viewMoreItems = this.items.slice(0, this.currentValue);
    if (this.items.length > 12 && this.viewMoreItems.length != this.items.length) {
      this.viewMoreVisible = true;
    }
    else {
      this.viewMoreVisible = false;
    }
    this.currentValue += 12;
  }

}

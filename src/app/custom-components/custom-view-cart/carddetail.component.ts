import { CommonUtils } from 'src/app/core/utils/utils';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveCartService, AuthService, RoutingService, SelectiveCartService } from '@spartacus/core';
import { CartDetailsComponent } from '@spartacus/storefront';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonService } from 'src/app/core/service/CommonService/common.service';

@Component({
  selector: 'app-carddetail',
  templateUrl: './carddetail.component.html',
  styleUrls: ['./carddetail.component.scss']
})
export class CarddetailComponent extends CartDetailsComponent implements OnDestroy, AfterViewInit {
  noItemsScreen: boolean = true;
  infoMessage: string = '';
  successInd$ = new BehaviorSubject<boolean>(false);
  modalRef: any;
  isMobile: boolean = false;
  cartSubscription: Subscription;
  entriesSubscription: Subscription;
  cartEntries = [];
  public cartList: any;
  constructor(
    activeCartService: ActiveCartService,
    selectiveCartService: SelectiveCartService,
    authService: AuthService,
    routingService: RoutingService,
    public modalService: NgbModal,
    private commonService: CommonService
  ) {
    super(activeCartService, selectiveCartService, authService, routingService);
    this.isMobile = CommonUtils.isMobile();
    this.cart$ = this.activeCartService.getActive();
    this.activeCartService
      .getEntries()
      .pipe(filter((entries) => entries.length > 0)).subscribe(() => {
        this.noItemsScreen = false;
      });
      this.commonService.onLoadGTMMethod('other', 'Cart', '0', window.location.href);
  }
  ngAfterViewInit(): void {
    this.entriesSubscription = this.entries$.subscribe((data) => {
    })
  }
  openAddFromList(content) {
    this.modalRef = this.modalService.open(content, {
      windowClass: 'addFromListpopup',
      centered: true,
      size: 'lg',
    });
    this.modalRef.result.then(
      (result) => {
        if (result === 'success') {
        }
      },
      (name: any) => {
        if (name != '' && name != undefined) {
          this.cartLoaded$.subscribe((isloaded) => {
            if (isloaded) {
              this.infoMessage = 'Your items have been successfully added from your list';
              this.successInd$.next(true);
              setTimeout(() => {
                this.infoMessage = '';
                this.successInd$.next(false);
              }, 10000);
            }
          })

        }
      }
    );
  }
  successMessageEmitter() {
    this.infoMessage = 'Your items have been successfully added to list';
    this.successInd$.next(true);
    setTimeout(() => {
      this.infoMessage = '';
      this.successInd$.next(false);
    }, 10000);

  }

  clearCart() {
    this.cartSubscription = this.entries$.subscribe((result) => {
      this.cartList = result;
      this.cartList.forEach(cartItem => {
        setTimeout(() => {
          this.activeCartService.removeEntry(cartItem);
        }, 500);
      });
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription)
      this.cartSubscription.unsubscribe();
    if (this.entriesSubscription)
      this.entriesSubscription.unsubscribe();
  }
}

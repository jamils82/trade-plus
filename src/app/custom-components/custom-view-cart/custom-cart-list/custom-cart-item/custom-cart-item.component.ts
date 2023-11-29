import { CommonUtils } from 'src/app/core/utils/utils';
import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartItemComponent, CartItemContextSource } from '@spartacus/storefront';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { ActiveCartService } from '@spartacus/core';
import { SharedErrorMessageComponent } from 'src/app/shared-components/shared-error-message/shared-error-message.component';

@Component({
  selector: 'app-custom-cart-item',
  templateUrl: './custom-cart-item.component.html',
  styleUrls: ['./custom-cart-item.component.scss'],
})
export class CustomCartItemComponent extends CartItemComponent implements OnChanges, OnInit {
  modalRef: any;
  screenName = "cart"
  isMobile: boolean = false;
  stock: boolean = false;
  constructor(
    cartItemContextSource: CartItemContextSource,
    private modalService: NgbModal,
    private commonService: CommonService,
    public ref: ChangeDetectorRef, 
    public activeCartService: ActiveCartService) 
    {
      super(cartItemContextSource);
      this.ref.markForCheck()
      this.isMobile = CommonUtils.isMobile()
    }

    ngOnInit(): void {
     if(window.location.href.includes('/cart')){
      this.activeCartService
      .getEntries().subscribe((entries) => {
        for(var i=0; i<entries.length; i++){
          // console.log("Stock status:", entries[i].product.stock.stockLevelStatus)
          if((entries[i].product.stock.stockLevel < entries[i].quantity) && entries[i].product.stock.stockLevelStatus == 'inStock'){
           this.openModal();
          }
        }
      });
     }
    }

    openModal(){
      if(!this.modalService.hasOpenModals()){
        this.modalRef = this.modalService.open(SharedErrorMessageComponent, {
          windowClass: 'shared-error-message',
          centered: true,
          size: 'lg',
        });
    
        this.modalRef.result.then((result) => {
          
        })
      }
    }

  ngOnChanges(changes?: SimpleChanges): void {
  }

  deleteItem(content: any) {
    this.modalRef = this.modalService.open(content, {
      windowClass: 'deleteCartItem',
      centered: true,
      size: 'lg',
    });

    this.modalRef.result.then((result) => {
      if (result === 'success') {}
    }, (name) => {
      if (name == true) {
        this.commonService.show();
        this.removeItem();
        setTimeout(()=>{
          this.commonService.hide();
        }, 9000)
      }
    })
  }
}


import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/core/service/account.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonUtils } from 'src/app/core/utils/utils';
@Component({
  selector: 'order-info',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class orderDetailsComponent implements OnInit {
  @Input() deliveryData: any;

  @Input() guid: number;

  @Output() created = new EventEmitter<any>(true);

  emailId: any;
  resultData: any = {};

  public isDeliveryBox: boolean;
  isMobile: boolean = false;
  mobData: any;
  constructor(
    public accountService: AccountService,
    public ref: ChangeDetectorRef,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid
      }
    });
    this.accountService.getOrderDetail(this.guid).subscribe((res) => {
      if (res) {
        this.resultData = res;
        let phone = this.resultData?.deliveryAddress?.cellphone;
        if (phone) {
          this.resultData.deliveryAddress.cellphone = phone.substring(0, 4) + " " + phone.substring(4, phone.length);
        }
        // if (this.resultData.created != undefined) {
        //   const date = this.resultData.created.split('T');
        //   this.resultData.created = date[0] + 'T' + '00:00:00';
        // }
        // this.resultData.reqdatetime = this.resultData.placed;
        if (this.resultData.requestedDeliveryTime != undefined) {
          const date = this.resultData.requestedDeliveryDate.split(' ');
          this.resultData.requestedDeliveryDate = date[0] + 'T' + date[1];
        }
        this.isDeliveryBox = this.resultData.deliveryMode.code == "Delivery" ? true : false;
        this.resultData.classStatus = res.status;
        this.mobData = this.resultData.entries;
        this.getStatusName(this.resultData.status);
        // this.setAccountAddress();
        this.ref.markForCheck();
      }
    })
  }
  setAccountAddress() {
    this.resultData?.orgCustomer?.orgUnit?.children.forEach(element => {
      if (element.selected == true) {
        this.resultData.accountAddress = element?.selected_pos?.address?.formattedAddress
      }
    });
  }
  status(status) {
    let value = '';
    if (status == 'DISPATCHED') value = 'on_way';
    else if (status == 'READY TO COLLECT') value = 'ready_collect';
    else if (status == 'AWAITING_DISPATCH') value = 'await_dispatch';
    else if (status == 'ORDER_RECEIVED') value = 'received';
    else if (status == 'PARTLY_DISPATCHED') value = 'await_dispatch';
    else if (status == 'PARTLY_COMPLETED') value = 'part_order_complete';
    else if (status == 'COMPLETED') value = 'Complete';
    else if (status == 'PENDING') value = 'received';
    else if (status == 'BACK_ORDERED') value = 'back_order';
    else if (status == 'ORDER_PROCESSING')
      value = 'part_await_dispatch';
    else value = '';
    return value;
  }
  getStatusName(status: any) {
    if (status == 'DISPATCHED') this.resultData.status = 'DISPATCHED';
    else if (status == 'AWAITING_DISPATCH') this.resultData.status = 'AWAITING DISPATCH';
    else if (status == 'READY TO COLLECT') this.resultData.status = 'READY TO COLLECT';
    else if (status == 'PARTLY_DISPATCHED') this.resultData.status = 'PARTLY DISPATCHED';
    else if (status == 'PARTLY_COMPLETED') this.resultData.status = 'PARTLY COMPLETED';
    else if (status == 'COMPLETED') this.resultData.status = 'COMPLETED';
    else if (status == 'BACK_ORDERED') this.resultData.status = 'BACK ORDERED';
    else if (status == 'ORDER_RECEIVED') this.resultData.status = 'ORDER RECEIVED';
    else if (status == 'ORDER_PROCESSING')
      this.resultData.status = 'ORDER PROCESSING';
    else {
      this.resultData.status = status;
    }
  }
  proofOfDelivery(order: any) {
    const prodDetail: any = order;
    if (this.resultData.deliveryMode.code == 'Delivery' && (prodDetail.quantityStatus == 'COMPLETED' ||  prodDetail.quantityStatus == 'Completed') && prodDetail.consignmentEntries && prodDetail.consignmentEntries.length > 0) {
      let consignments = [];
      order.consignmentEntries.forEach(element => {
        let deliveryOrder = {
          deliveryId: element.deliveryId,
          branchId: element.fulfillmentLocationId,
          consignmentId: element.consignmentCode,
          shipmentId: element.shipmentId,
          customerAccountId: this.resultData?.accountId,
          userId: this.emailId,
          orderId: element.orderCode,
          deliveryCreateDate: element.requestedDeliveryDate,
          hybrisOrderId: this.resultData.code,
          accountName: this.resultData.accountName
        }
        consignments.push(deliveryOrder);
      });
      this.accountService.consignments = consignments;
      // if (this.resultData.deliveryMode.code == 'Delivery') {
      this.created.emit(true);
      // }
    }
  }
}

import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { KeyValue } from '@angular/common';
import { AccountService } from 'src/app/core/service/account.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonUtils } from 'src/app/core/utils/utils';
@Component({
  selector: 'app-custom-proof-of-delivery',
  templateUrl: './custom-proof-of-delivery.component.html',
  styleUrls: ['./custom-proof-of-delivery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomProofOfDeliveryComponent implements OnInit {

  public deliveryData: any = {};
  public signatureImage: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
  public mapImage: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
  public productImage: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
  public dates: any = [];
  deliveredTime: any;
  isMobile: boolean = false;
  selectInd: number = 0;
  emailId: string;
  customerAccountId: number;
  accountName: string = ' ';
  consignmentsIds = [];
  @Output() backedPOP = new EventEmitter<any>(true);
  public originalOrder: any = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }
  constructor(
    public accountService: AccountService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public commonService: CommonService,
    public ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.commonService.show();
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid
      }
    });
    this.accountService.consignments.forEach(element => {
      this.consignmentsIds.push(element.consignmentId);
      this.dates.push(element.deliveryCreateDate)
    });
    this.accountName = this.accountService.consignments[0].accountName;
    this.customerAccountId = this.accountService.consignments[0].customerAccountId;
    this.getProofOfDelivery(0);

  }
  getProofOfDelivery(index) {
    this.commonService.show();
    let deliveryOrder = this.accountService.consignments[index];
    this.accountService.getProofOfDelivery(deliveryOrder).subscribe((data) => {
      if (data && data.deliveries.length > 0) {
        this.commonService.hide();
        let summaryList = data.deliveries[0].deliveryLines;
        if (data.deliveries[0].outcome && data.deliveries[0].outcome.outcomeDate) {
          let dateTime = data.deliveries[0].outcome?.outcomeDate
          this.deliveredTime = dateTime.split('+')[0];
        }
        this.deliveryData = {
          DeliveredTo: this.accountName,
          DateDelivered: data.deliveryDate,
          CustomerOrder: data.jobRef,
          SalesOrderNo: data.deliveries[0].order.id,
          ItemSummary: summaryList,
          DeliveryAddress: data.deliveryAddress,
          TimeDelivered: data.deliveryTime,
          ReceivedBy: data.deliveries[0].receivedBy?.name,
          DriverID: data.deliveries[0].deliveredBy?.name,
          DeliveryInstructions: data.deliveryInstruction
        }
        if (data.deliveries[0].outcome?.images && data.deliveries[0].outcome?.images.length > 0) {
          // this.productImage = data.deliveries[0].outcome?.images[0].url || '';
          this.mapImage = data.deliveries[0].outcome?.maps[0].url || '';
          data.deliveries[0].outcome?.images.forEach(element => {
            if (element.type == 'POD') {
              this.signatureImage = element.url;
            }
            if (element.type == 'PHOTO') {
              this.productImage = element.url;
            }
          });
        }
        this.ref.markForCheck();
        this.commonService.hide();
      } else {
        this.commonService.hide();
      }
    }, (error) => {
      this.commonService.hide();
    })
  }
  onBackButtonClicked() {
    this.backedPOP.emit(false);
  }
}


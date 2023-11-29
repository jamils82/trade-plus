import { Component, OnInit } from '@angular/core';
import { invoiceAdjustmentService } from 'src/app/core/service/invoice_adjustments.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';

@Component({
  selector: 'app-print-list',
  templateUrl: './print-list.component.html',
  styleUrls: ['./print-list.component.scss'],
})
export class PrintListComponent implements OnInit {
  listViewData: any;
  totalEx: any = 0;
  totalGst: any = 0;
  totalInc: any = 0;
  localStorageListViewData: any;
  constructor(
    public service: invoiceAdjustmentService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.show();
    document.getElementsByTagName('header')[0].style.display = 'none';
    let styleElem = document.head.appendChild(document.createElement('style'));
    styleElem.innerHTML = '.stop-navigating::after {display: none !important;}';

    this.localStorageListViewData = JSON.parse(localStorage.getItem('InvoiceDocsForList'));

    this.localStorageListViewData.forEach((element) => {
      this.service.getInvoiceDetail(element.docNumber).subscribe((data) => {
        if (data) {
          this.listViewData = data.invoice;
          this.totalEx += data.invoice.totalEx;
          this.totalGst += data.invoice.totalGSTValue;
          this.totalInc += data.invoice.totalInc;
          this.commonService.hide();
        }
      });
    });
  }

  negativeConverter(value) {
    let val: any = parseFloat(value).toFixed(2);
    if (/\-/g.test(val)) {
      let isMinus = val.split('-')[1];
      let valReturn = '-$' + parseFloat(isMinus).toLocaleString(undefined, {minimumFractionDigits: 2});
      return valReturn;
    } else {
      let valReturn = '$' + parseFloat(value).toLocaleString(undefined, {minimumFractionDigits: 2});
      return valReturn;
    }
  }
}

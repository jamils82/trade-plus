import { Component, OnInit } from '@angular/core';
import { invoiceAdjustmentService } from 'src/app/core/service/invoice_adjustments.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';

@Component({
  selector: 'app-web-view',
  templateUrl: './web-view.component.html',
  styleUrls: ['./web-view.component.scss'],
})
export class WebViewComponent implements OnInit {
  public invoiceNo;
  public individualDataSource: any = [];
  constructor(
    public service: invoiceAdjustmentService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.show();
    var webViewInvoiceNumbers = JSON.parse(
      localStorage.getItem('InvoiceNumbers')
    );
    webViewInvoiceNumbers.forEach(async (element) => {
      await this.IndividualInvoice(element);
    });
    document.getElementsByTagName('header')[0].style.display = 'none';
    let styleElem = document.head.appendChild(document.createElement('style'));
    styleElem.innerHTML = '.stop-navigating::after {display: none !important;}';
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

  IndividualInvoice(invoiceNo) {
    this.service.getInvoiceDetail(invoiceNo).subscribe((data) => {
      if (data) {
        let tempDate = data.invoice.docDate.split('-');
        let temp = {
          ...data.invoice,
          docDate : tempDate[2] +'-'+ tempDate[1]  +'-'+ tempDate[0],
        }
        this.individualDataSource.push(temp);
        this.commonService.hide();
      }
    });
  }
}

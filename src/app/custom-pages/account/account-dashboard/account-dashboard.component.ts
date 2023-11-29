import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MultiDataSet, Label } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from 'src/app/core/service/account.service';
import { invoiceAdjustmentService } from 'src/app/core/service/invoice_adjustments.service';
import { QuotesService } from 'src/app/core/service/quotes.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';

@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDashboardComponent implements OnInit {
  emailId: string = '';
  accountSummaryData: any = {};
  paymentDues: any = [];
  paymentHistory: any = [];
  // Doughnut
  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: MultiDataSet = [[]];
  public doughnutChartType = 'doughnut';
  public doughnutChartColors: any[] = [
    {
      backgroundColor: ['#973937', '#FF7D39', '#00AFE2', '#0B961B'],
    },
  ];
  options = {
    cutoutPercentage: 60,
    elements: {
      arc: { borderWidth: 0 },
    },
    hover: { mode: null },
    tooltips: {
      enabled: false,
    },
  };
  quotesData: any = [];
  ordersData: any = [];
  InvoiceDataSource: any;
  accountSummary$ = new BehaviorSubject<boolean>(true);
  recentPayments$ = new BehaviorSubject<boolean>(true);
  paymentsDue$ = new BehaviorSubject<boolean>(true);
  invoices$ = new BehaviorSubject<boolean>(true);
  myOrders$ = new BehaviorSubject<boolean>(true);
  myQuotes$ = new BehaviorSubject<boolean>(true);
  constructor(
    private quotesService: QuotesService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public accountService: AccountService,
    public service: invoiceAdjustmentService
  ) { }

  ngOnInit(): void {
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.getDashboardData();
      }
    });

    let tempDate: any = new Date();
    let fromDate = new Date(tempDate.setDate(tempDate.getDate() - 30))
      .toISOString()
      .substring(0, 10)
      .split('-')
      .join('-');
    let toDate = new Date().toISOString().substring(0, 10).split('-').join('-');
    this.service.getInvoiceList(fromDate, toDate, 12, 1).subscribe(
      (data) => {
        if (data) {
          this.InvoiceDataSource =
            data.invoices.length > 5
              ? data.invoices.slice(0, 5)
              : data.invoices;
          this.invoices$.next(false);
        } else {
          this.invoices$.next(false);
        }
      },
      (error) => {
        this.invoices$.next(false);
      }
    );
  }

  negativeConverter(value) {
    let val: any = parseFloat(value).toFixed(2);
    if (/\-/g.test(val)) {
      let isMinus = val.split('-')[1];
      let valReturn = '-$' + parseFloat(isMinus).toLocaleString(undefined, { minimumFractionDigits: 2 });
      return valReturn;
    } else {
      let valReturn = '$' + parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 });
      return valReturn;
    }
  }

  accountBalanceNavigate() {
    sessionStorage.setItem('BalanceAccountLink', 'true');
  }
  getDashboardData() {
    const email = this.emailId;
    this.accountService.getAccountBalance(email).subscribe(
      (data) => {
        if (data  && data.ageingValues.length > 0) {
          this.accountSummaryData = data;
          this.doughnutChartData = [
            this.accountSummaryData.balanceOverDueInvoices,
            this.accountSummaryData.balanceDueInvoices,
            this.accountSummaryData.unappliedAmount,
            this.accountSummaryData.availableCreditAll,
          ];
          this.paymentDues =
          data.ageingValues.length > 5
            ? data.ageingValues.slice(0, 5)
            : data.ageingValues;
          this.accountSummary$.next(false);
        } else {
          this.accountSummary$.next(false);
        }
      },
      (error) => {
        this.accountSummary$.next(false);
      }
    );
    this.accountService.getPaymentHistory().subscribe(
      (data) => {
        if (data && data.paymentHistory && data.paymentHistory.length > 0) {
          this.paymentHistory =
            data.paymentHistory.length > 5
              ? data.paymentHistory.slice(0, 5)
              : data.paymentHistory;
          this.recentPayments$.next(false);
        } else {
          this.recentPayments$.next(false);
        }
      },
      (error) => {
        this.recentPayments$.next(false);
      }
    );
    this.quotesService.getQuotes().subscribe(
      (data) => {
        if (data && data.quotes && data.quotes.length > 0) {
          this.quotesData =
            data.quotes.length > 5 ? data.quotes.slice(0, 5) : data.quotes;
          this.myQuotes$.next(false);
        } else {
          this.myQuotes$.next(false);
        }
      },
      (error) => {
        this.myQuotes$.next(false);
      }
    );
    const data = '';
    const pagination = '&pageSize=' + 12;
    const currentPage = '&currentPage=' + 0;
    this.accountService
      .getOrderList(data, pagination, currentPage, '', '', '')
      .subscribe(
        (data) => {
          if (data && data.orders && data.orders.length > 0) {
            this.ordersData = data.orders.length > 5 ? data.orders.slice(0, 5) : data.orders;
            this.ordersData.forEach(element => {

              if (element.requestedDeliveryDate != undefined) {
                const date = element.requestedDeliveryDate.split(' ');
                element.requestedDeliveryDate = date[0] + 'T' + date[1];
              }
            });
            this.myOrders$.next(false);
          } else {
            this.myOrders$.next(false);
          }
        },
        (error) => {
          this.myOrders$.next(false);
        }
      );
  }
  // events
  chartClicked(e: any): void { }

  chartHovered(e: any): void { }
}

import { Component, OnInit } from '@angular/core';
import { AccountPrefService } from 'src/app/core/service/accountPref.service ';
import { BehaviorSubject } from 'rxjs';
import { Params, Router } from '@angular/router';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';

@Component({
  selector: 'app-price-files',
  templateUrl: './price-files.component.html',
  styleUrls: ['./price-files.component.scss'],
})
export class PriceFilesComponent implements OnInit {
  downloadedFormats: any = [];
  frequentlyOrderItemFlag: boolean = true;
  myBranchProductsFlag: boolean;
  myCompletePriceListFlag:boolean;
  scheduleMonthlyNotificationFlag: boolean;
  chooseFromMyList: boolean;
  scheduleMonthlyPrefEmail: any;
  selectedFormatItem: any = null;
  selectedListItem: any = null;
  emailId: any;
  selectedFormat: any;
  successInd$ = new BehaviorSubject<boolean>(false);
  infoMessage: String = ' ';
  preferenceData: any = {};
  produceData: any = {};
  myList = [];
  queryParams: Params = { priceChange: 'yes' };
  accountEmail: any;
  isListDisable: boolean;
  isDisabled: boolean = true;
  isListLoad: boolean;
  userId: any;
  itemFiler: string;

  constructor(
    public accountPrefService: AccountPrefService,
    private userAccountDetailsService: FIUserAccountDetailsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDownloadFormats();
    this.getOrgUsersData();
    this.getPreferenceData();
    this.userAccountDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.accountEmail = data.uid;
        this.emailId = data.uid;
         this.userId = data.uid;
        this.getMyList(data.uid);
      }
    });
  }

  getDownloadFormats() {
    const type = 'PRICE';
    this.accountPrefService.downloadFormatsGetAPI(type).subscribe((data) => {
      if (data && data.length > 0) {
        this.downloadedFormats = this.sortFormat(data);
      }
    });
  }
  sortFormat(data: any) {
    return data.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
  getMyList(userId: any) {
    this.isListLoad = false;
    this.accountPrefService.myListGetAPI(userId).subscribe((data) => {
      this.isListLoad = true;
      if (data.myList && data.myList.length > 0) {
        data.myList.forEach((item) => {
          this.myList.push(item.listName);
        });
        if (this.chooseFromMyList) {
          this.isListDisable = false;
        }
      }
    });
  }
  getOrgUsersData() {
    this.accountPrefService.getOrgUsersResponse().subscribe((data) => {
      var innerObjs = data['orgUnit'].children;
      this.emailId = data.email;
      innerObjs.forEach((element) => {
        if (element.selected) {
          if (element.chooseFromMyListFlag) {
            this.isListDisable = false;
            this.selectedListItem = element.myListName;
          } else {
            this.isListDisable = true;
            this.selectedListItem = null;
          }
          if (element.scheduleMonthlyPrefEmail) {
            this.scheduleMonthlyPrefEmail = element.scheduleMonthlyPrefEmail;
          } else {
            this.scheduleMonthlyPrefEmail = this.accountEmail;
          }
          this.scheduleMonthlyNotificationFlag =
            element.scheduleMonthlyNotificationFlag;
          if (!element.myBranchProductsFlag && !element.chooseFromMyListFlag && !element.myCompletePriceListFlag) {
            this.frequentlyOrderItemFlag = true;
          } else {
            this.frequentlyOrderItemFlag = element.frequentlyOrderItemFlag;
          }
          this.myBranchProductsFlag = element.myBranchProductsFlag;
          this.myCompletePriceListFlag = element.myCompletePriceListFlag;
          this.chooseFromMyList = element.chooseFromMyListFlag;
          if (element.downloadPriceFormat) {
            this.selectedFormatItem = element.downloadPriceFormat;
          } else {
            this.selectedFormatItem = null;
          }

          this.validateChange();
        }
      });
    });
  }

  getPreferenceData() {
    var currentUID = localStorage.getItem('selectedIUID');
    this.accountPrefService.statementsGetAPI(currentUID).subscribe((data) => {
      if (data && data.preferences && data.preferences.length > 0) {
        this.preferenceData = data['preferences'];
        this.preferenceData.forEach((element) => {
          if (element.preferenceType == 'STATEMENT') {
            this.emailId = element.email;
          }
        });
      }
    });
  }

  frequentlyOrderItemFlagChange() {
    this.frequentlyOrderItemFlag = true;
    this.myBranchProductsFlag = false;
    this.myCompletePriceListFlag = false;
    this.chooseFromMyList = false;
    this.selectedListItem = null;
    this.isListDisable = true;
    this.validateChange();
  }
  myBranchProductsFlagChange() {
    this.myBranchProductsFlag = true;
    this.myCompletePriceListFlag = false;
    this.chooseFromMyList = false;
    this.frequentlyOrderItemFlag = false;
    this.selectedListItem = null;
    this.isListDisable = true;
    this.validateChange();
  }

  completePriceListFlagChange() {
    this.myCompletePriceListFlag = true;
    this.chooseFromMyList = false;
    this.myBranchProductsFlag = false;
    this.frequentlyOrderItemFlag = false;
    this.selectedListItem = null;
    this.isListDisable = true;
    this.validateChange();
  }

  chooseFromMylistFlagChange() {
    if (this.isListLoad) {
      this.isListDisable = false;
    }
    this.chooseFromMyList = true;
    this.frequentlyOrderItemFlag = false;
    this.myBranchProductsFlag = false;
    this.myCompletePriceListFlag = false;
    // this.isListDisable = false;
    this.validateChange();
  }
  validateChange() {
    if (
      this.scheduleMonthlyPrefEmail.length > 0 &&
      this.selectedFormatItem.length > 0 &&
      (this.chooseFromMyList ||
        this.frequentlyOrderItemFlag ||
        this.myBranchProductsFlag || this.myCompletePriceListFlag)
    ) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  produce() {
    this.produceData.preferenceType = 'ONDEMANDPRICE';
    this.produceData.frequentlyOrderItemFlag = this.frequentlyOrderItemFlag;
    this.produceData.myBranchProductsFlag = this.myBranchProductsFlag;
    this.produceData.myCompletePriceListFlag = this.myCompletePriceListFlag;
    this.produceData.chooseFromMyListFlag = this.chooseFromMyList;
    if (this.selectedListItem != null) {
      this.produceData.myListName = this.selectedListItem;
    }
    const format_Ext = this.selectedFormatItem.split('.');
    (this.produceData.onDemandPriceFileFormat = {
      extension: format_Ext[1],
      name: format_Ext[0],
    }),
      (this.produceData.email = this.scheduleMonthlyPrefEmail);

    var accountId = localStorage.getItem('selectedIUID');
    /* ---- Item Filter conditions for GA4 ---- */
    if(this.myCompletePriceListFlag){
        this.itemFiler = 'Complete Price List';
    }
    else if (this.frequentlyOrderItemFlag){
      this.itemFiler = 'Frequently Ordered Items';
    }
    else if (this.myBranchProductsFlag){
      this.itemFiler = 'My Branch Products';
    }
    else{
      this.itemFiler = 'Choose from other list';
    }
    /* ---- End of Conditions ---- */
    this.accountPrefService
      .updatePreferencesSettings(this.accountEmail, accountId, this.produceData)
      .subscribe((status) => {
        this.isDisabled = true;
        this.infoMessage =
          'Your price file request has been received and you will receive an email once it is available to download.';
        this.successInd$.next(true);
        setTimeout(() => {
          this.successInd$.next(false);
        }, 11000);
      });
    // For Google analytics
    (<any>window).dataLayer.push({
      event: 'Price Files Click',
      eventCategory: 'Price Files',
      userId: this.userId,
      accountId: accountId,
      item_filter: this.itemFiler
    });
  }

  navigateToAccount() {
    this.router.navigate(['/preferencesPage'], {
      queryParams: this.queryParams,
      queryParamsHandling: 'merge',
    });
  }
}

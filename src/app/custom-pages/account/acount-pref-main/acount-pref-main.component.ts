import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FIUserAccountDetailsService } from './../../../core/service/userAccountDetails.service';
//import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AccountPrefService } from 'src/app/core/service/accountPref.service ';
//import { PendingChangesGuard } from 'src/app/core/guard/pending-changes.guard';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, CanDeactivate, Router, RoutesRecognized } from '@angular/router';
import { inputStateService } from 'src/app/shared/services/inputState.service';
import { saveByNavigationService } from 'src/app/shared/services/saveByNagvigation.service';
import { ThrowStmt } from '@angular/compiler';
import { SavePreferredEmailComponent } from '../save-preferred-email/save-preferred-email.component';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-acount-pref-main',
  templateUrl: './acount-pref-main.component.html',
  styleUrls: ['./acount-pref-main.component.scss'],
})
export class AcountPrefMainComponent {
  prefTypeNum = 1;
  selectedTab = '1true';
  emailId: any;
  statementEmailIdPrint: any;
  modalRef: any;
  fergusEnabled: boolean = false;
  MYOBEnabled: boolean = false;
  simProEnabled: boolean = false;
  xeroEnabled: boolean = false;
  connectionStatus: string;
  connectLabel: String = 'Connect to';
  FergusConnectLabel: String = 'Connect to';
  simPROchange: String = 'simPRO Invoice Help Guide';
  XeroConnectLabel: String = 'Connect to';
  isEmailUpdated: boolean = false;
  isEmailSaved: boolean = false;
  infoMessage: String = ' ';
  updatedEmail$ = new BehaviorSubject<any>('');
  successInd$ = new BehaviorSubject<boolean>(false);
  selectedStatement: boolean = false;
  textSelectionUpdated: boolean = false;
  showAccountingSection: boolean = false;
  errorInd: boolean = false;
  currentUID: string;
  dataResponse: any;
  phoneNumber: string;
  accountBalanceEmail: any;
  accountBalancePhoneNo: any;
  invoiceEmail: any;
  invoiceFlagData: any = {};
  accountBalanceAlertMethod: any = {};
  priceBuildOrderItemFlag: boolean = true;
  priceBuildProductsFlag: boolean = false;
  chooseFromMyList: boolean = false;
  scheduleMonthlyNotificationFlag: boolean;
  priceBuildEmail: any;
  accountingSoftwareFlag: boolean = false;
  invoiceSelectedOption: any;
  accountBalanceAlertRadioBtn: any;
  balanceSelectedOption: any;
  //@Output() passEntry: EventEmitter<any> = new EventEmitter();
  isVoiceAndAdjustmentsEmailUpdate: boolean = false;
  isaccountBalanceAlertEmailUpdate: boolean = false;
  accountSoftwareRadio: boolean = false;
  accountBalanceAlertRdUpdate: boolean = false;
  isCommunicationPreferenceEmailUpdate: boolean = false;
  isScheduledPriceBuildEmailUpdate: boolean = false;
  isCommunicationPreferenceRadioBtn: boolean = false;
  ismonthlyPriceBuildRadioBtn: boolean = false;
  isPriceBuildItemFlagRadioBtn: boolean = false;
  isBranchProductUpdateRadioBtn: boolean = false;
  navigationService: Subscription;
  clickedByNavigation: boolean = false;
  isPriceListUpdate: boolean = false;
  isFormatUpdate: boolean = false;
  isMyListUpdate: boolean = false;
  isdefaultDownloadFormatUpdate: boolean = false;
  selecteddefaultDownloadFormatItem: any = ''; 
  previousType: string = 'STATEMENT';
  previousprefTypeNum: string = '1';
  selectedInvoiceData: any = {};
  selectedAccountBlnceData: any = {};
  downloadedFormats = [];
  statementSendMethod: any;
  myList = [];
  userId: any;
  scheduleMonthlyPrefEmail: any;
  selectedListItem: any = null;
  selectedFormatItem: any = null;
  isDisabled: boolean = true;
  accountEmail: any;
  isEmailHide: boolean;
  isListDisable: boolean;
  isEmailValid: boolean = false;
  isPhonenoValid: boolean = false;
  showMyOBRefreshButton: boolean = false
  showFergusRefreshButton: boolean = false;
  isListLoad: boolean;
  isDataLoad: boolean;
  myCompletePriceListFlag:boolean;
  subscribedFlag: boolean;
  connectedAccSoftware: string;
  communicationPrefEmail: string;
  accDisconnected: boolean = false;

  constructor(
    private userAccountDetailsService: FIUserAccountDetailsService,
    private modalService: NgbModal,
    private accountPrefService: AccountPrefService,
    private inputStateService: inputStateService,
    private saveByNavigation: saveByNavigationService,
    public ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isDataLoad = true;
    this.route.queryParams.subscribe(params => {
      // console.log("Data:", JSON.stringify(params))
      if (params['invoice'] == 'yes') {
        this.perfChangeHandler(2);
      } else if (params['priceChange'] == 'yes') {
        this.perfChangeHandler(5);
      }
    });

    this.getPreferenceData();
    this.getOrgUsersData();
    this.getAccountConnection();
    this.getDownloadFormats();
    this.navigationService = this.saveByNavigation.stateUpdated$.subscribe(
      (result) => {
        if (result === true) {
          this.clickedByNavigation = true;
          if (this.clickedByNavigation == true) {
            this.saveByNavigation.saveByNavigation(false);
            this.savePreferencesSettings();
          }
        }
      }
    );
    this.accountPrefService.cloudIntIntialService().subscribe((data) => {
      if (data != undefined) {
        // Rewrite once all Provide will come  - varathan
        if (data.partners[0]?.partnerCode === 'XRO') {
          this.xeroEnabled = true;
          this.connectionStatus = data.partners[0]?.connectionStatus;
          this.accountPrefService.setConnectStatus(this.connectionStatus);
          if (this.connectionStatus === 'A') {
            this.connectLabel = 'Connect to';
          } else if (this.connectionStatus === 'D') {
            this.connectLabel = 'Disconnect from';
          }
        }
      }
    });

    this.userAccountDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.accountEmail = data.uid;
        this.getMyList(data.uid)
      }
    });

    if (sessionStorage.getItem('BalanceAccountLink') == "true") {
      setTimeout(() => {
        this.perfChangeHandler(3);
        sessionStorage.removeItem("BalanceAccountLink");
      }, 100);
    }

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
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
      if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
      return 0;
    })
  }
  getMyList(userId: any) {
    this.isListLoad = false;
    this.accountPrefService.myListGetAPI(userId).subscribe((data) => {
      if (data.myList && data.myList.length > 0) {
        data.myList.forEach((item) => {
          this.myList.push(item.listName);
        })
        this.isListLoad = true;
        // this.isListDisable = false;
        if (this.chooseFromMyList) {
          this.isListDisable = false;
        }
        this.ref.markForCheck();
      }
    });
  }
  setPreferenceData() {
    this.dataResponse.preferences.forEach((element) => {
      if (element.preferenceType == 'STATEMENT') {
        if (element.sendMethod == 'PRINT') {
          this.emailId = '';
        } else {
          this.emailId = element.email;
        }
        if (element.sendMethod) {
          this.statementSendMethod = element.sendMethod;
        } else {
          this.statementSendMethod = 'EMAIL';
        }
        this.phoneNumber = element.phoneNumber;
      } else if (element.preferenceType == 'INVOICE') {
        
        this.selecteddefaultDownloadFormatItem = element.downloadFormat == 'null' ? 'DEFAULT' : element.downloadFormat;
        this.invoiceEmail = element.email;
        if (element.sendMethod == 'PRINT') {
      
          this.isEmailHide = false;
        } else if (element.sendMethod == 'EMAIL' || element.sendMethod == 'EMAILMULTIPLE' || element.sendMethod == 'accounting') {

          this.isEmailHide = true;
        }
        if (this.connectionStatus == 'A' || this.connectionStatus == undefined) {
          this.invoiceFlagData = element;
          this.showAccountingSection = false;
          this.invoiceSelectedOption = element.sendMethod;
        } else {
          this.isEmailHide = false;
          this.invoiceSelectedOption = 'accounting';
          this.showAccountingSection = true;
          this.accountingSoftwareFlag = true;
        }
      } else if (element.preferenceType == 'ACCOUNTBALANCE') {
        this.accountBalanceEmail = element.email;
        this.accountBalancePhoneNo = element.phoneNumber.substring(1);
        if (element.sendMethod == undefined) {
          this.balanceSelectedOption = 'EMAIL';
        } else {
          this.balanceSelectedOption = element.sendMethod;
        }
        this.accountBalanceAlertMethod = this.balanceSelectedOption;
      }
      this.ref.markForCheck();
    });
    this.isDataLoad = false;
  }
  getOrgUsersData() {
    this.accountPrefService.getOrgUsersResponse().subscribe((data) => {
      var innerObjs = data['orgUnit'].children;
      if(data.subscribed){
        this.subscribedFlag = data.subscribed;
      }else{ 
        this.subscribedFlag = false;
      }
      innerObjs.forEach((element) => {
        if (element.selected) {
          if (element.chooseFromMyListFlag) {
            this.isListDisable = true;
            this.selectedListItem = element.myListName;
          } else {
            this.isListDisable = false;
            this.selectedListItem = null;
          }
          if(element.scheduleMonthlyPrefEmail){
            this.scheduleMonthlyPrefEmail = element.scheduleMonthlyPrefEmail
          }else{
            this.scheduleMonthlyPrefEmail = this.accountEmail;
          }
          if (element.scheduleMonthlyNotificationFlag == undefined) {
            this.scheduleMonthlyNotificationFlag = true;
          } else {
            this.scheduleMonthlyNotificationFlag = element.scheduleMonthlyNotificationFlag;
          }
          if (!element.myBranchProductsFlag && !element.chooseFromMyListFlag && !element.myCompletePriceListFlag) {
            this.priceBuildOrderItemFlag = true;
          } else {
            this.priceBuildOrderItemFlag = element.frequentlyOrderItemFlag;
          }
          this.priceBuildProductsFlag = element.myBranchProductsFlag;
          this.accountingSoftwareFlag = element.accountingSoftware;
          this.chooseFromMyList = element.chooseFromMyListFlag;
          this.myCompletePriceListFlag = element.myCompletePriceListFlag;
          if (element.downloadPriceFormat) {
            this.selectedFormatItem = element.downloadPriceFormat;
          } else {
            this.selectedFormatItem = null
          }
          // this.ref.markForCheck();
        }
      });
    });
  }
  priceBuildTextSelection() {
    this.inputStateService.setUpdatedState(true);
  }
  updateMethod(dataValue) {
    if (dataValue == 'SMS') {
      this.isEmailValid = false;
    } else {
      this.isPhonenoValid = false;
    }
    this.isDisabled = this.emailCheckForRadioClcik();
    this.inputStateService.setUpdatedState(true);
    this.accountBalanceAlertMethod = dataValue;
    this.accountBalanceAlertRadioBtn = true;
  }
  savePreferencesSettings() {
    var preferenceType,
      email,
      phoneNo = '';
    var jsonObject = {};
    var emailKey = 'email';
    var phoneKey = 'phoneNumber';
    var typeKey = 'preferenceType';
    var methodKey = 'sendMethod';
    var softwareKey = 'accountingSoftware';
    var listNameKey = 'myListName';
    var frequentlyOrderItemkey = 'frequentlyOrderItemFlag';
    var myBranchProductsFlagkey = 'myBranchProductsFlag';
    var downloadFormat = 'downloadFormat';
    if (this.prefTypeNum == 1) {
      preferenceType = 'STATEMENT';
      email = this.emailId;
      phoneNo = this.phoneNumber;
      if (this.statementSendMethod == 'EMAIL') {
        jsonObject[emailKey] = email;
      } else {
        jsonObject[emailKey] = '';
      }
      jsonObject[typeKey] = preferenceType;
      jsonObject[phoneKey] = phoneNo;
      jsonObject[methodKey] = this.statementSendMethod;
    } else if (this.prefTypeNum == 2) {
      preferenceType = 'INVOICE';
      email = this.invoiceEmail;
      phoneNo = '';
      if (this.invoiceSelectedOption == 'EMAIL' || this.invoiceSelectedOption == 'EMAILMULTIPLE' || this.invoiceSelectedOption == 'accounting') {
        jsonObject[emailKey] = this.invoiceEmail;
      } else {
        jsonObject[emailKey] = '';
      }
      jsonObject[phoneKey] = phoneNo;
      jsonObject[typeKey] = preferenceType;
      jsonObject[downloadFormat] = this.selecteddefaultDownloadFormatItem;
      if (!this.showAccountingSection) {
        jsonObject[methodKey] = this.invoiceSelectedOption;
      } else {
        jsonObject[softwareKey] = true;
        // jsonObject[methodKey] = '';
      }
    } else if (this.prefTypeNum == 3) {
      preferenceType = 'ACCOUNTBALANCE';
      jsonObject[typeKey] = preferenceType;
      jsonObject[emailKey] = this.accountBalanceEmail;
      jsonObject[phoneKey] = '0' + this.accountBalancePhoneNo;
      
      jsonObject[methodKey] = this.accountBalanceAlertMethod;
    } else if (this.prefTypeNum === 4) {
      jsonObject['preferenceType'] = 'COMMUNICATION';
      jsonObject['communicationPreference'] = this.subscribedFlag;

    } else if (this.prefTypeNum === 5) {
      jsonObject[typeKey] = 'PRICECHANGES';
      jsonObject['scheduleMonthlyPrefEmail'] = this.scheduleMonthlyPrefEmail;
      jsonObject['scheduleMonthlyNotificationFlag'] = this.scheduleMonthlyNotificationFlag;
      jsonObject['frequentlyOrderItemFlag'] = this.priceBuildOrderItemFlag;
      jsonObject['myBranchProductsFlag'] = this.priceBuildProductsFlag;
      jsonObject['chooseFromMyListFlag'] = this.chooseFromMyList;
      jsonObject['myCompletePriceListFlag'] = this.myCompletePriceListFlag;
      if (this.chooseFromMyList) {
        jsonObject['myListName'] = this.selectedListItem;
      }
      jsonObject['downloadPriceFormat'] = this.selectedFormatItem;
    }
    var accountId = localStorage.getItem('selectedIUID');
    this.accountPrefService
      .updatePreferencesSettings(this.accountEmail, accountId, jsonObject)
      .subscribe((status) => {
        // if(this.clickedByNavigation){
        //   this.clickedByNavigation = false;
        // }
        this.inputStateService.setUpdatedState(false);
        this.isDisabled = true;
        this.infoMessage = 'Changes have been made successfully';
        this.successInd$.next(true);
        this.resetFormValidations();
        setTimeout(() => {
          this.successInd$.next(false);
        }, 2000)
      });
  }
  getPreferenceData() {
    this.currentUID = localStorage.getItem('selectedIUID');
    this.accountPrefService
      .statementsGetAPI(this.currentUID)
      .subscribe((data) => {
        if (data && data.preferences && data.preferences.length > 0) {
          this.dataResponse = data;
          //displaying the response data
          this.setPreferenceData();
        }
        this.isDataLoad = false;
      },
      (error) => {
        this.isDataLoad = false;
      });
      this.ref.markForCheck();
  }

  openModal(num, preTypeNum) {
    this.modalRef = this.modalService.open(SavePreferredEmailComponent, {
      windowClass: 'savePreferenceEmail',
      centered: true,
      size: 'lg',
    });
    this.modalRef.componentInstance.selectedChoice = true;
    this.modalRef.componentInstance.num = num;
    this.modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      // this.prefTypeNum = receivedEntry;
      // this.selectedTab = receivedEntry + 'true';
      //this.ref.detectChanges();
      this.savePreferencesSettingsOnPopup(preTypeNum, receivedEntry);
      this.getPreferenceData();
      this.resetFormValidations();
      this.isDisabled = true;
    });
    this.modalRef.result.then((result) => {
      if (result == 'No') {
        this.tabSelectionafterModal(num);
        this.resetFormValidations();
        this.isDisabled = true;
      } else if (result == 'cross') {
        this.resetFormValidations();
        // this.isDisabled = true;
      }
      this.ref.markForCheck();
      return;
    });
  }
  resetFormValidations() {
    this.isEmailUpdated = false;
    this.textSelectionUpdated = false;
    this.isVoiceAndAdjustmentsEmailUpdate = false;
    this.isaccountBalanceAlertEmailUpdate = false;
    this.accountSoftwareRadio = false;
    this.accountBalanceAlertRdUpdate = false;
    this.accountBalanceAlertRadioBtn = false;
    this.isCommunicationPreferenceEmailUpdate = false;
    this.isCommunicationPreferenceRadioBtn = false;
    this.isScheduledPriceBuildEmailUpdate = false;
    this.isPriceBuildItemFlagRadioBtn = false;
    this.ismonthlyPriceBuildRadioBtn = false;
    this.isPriceListUpdate = false;
    this.isFormatUpdate = false;
    this.isMyListUpdate = false;
    this.isBranchProductUpdateRadioBtn = false;
    this.isdefaultDownloadFormatUpdate = false;
  }
  tabSelectionafterModal(num) {
    this.prefTypeNum = num;
    this.selectedTab = num + 'true';
  }
  perfChangeHandler(num) {
    this.isEmailValid = false;
    if (
      this.isEmailUpdated ||
      this.textSelectionUpdated ||
      this.isVoiceAndAdjustmentsEmailUpdate ||
      this.isaccountBalanceAlertEmailUpdate ||
      this.accountSoftwareRadio ||
      this.accountBalanceAlertRdUpdate ||
      this.accountBalanceAlertRadioBtn ||
      this.isCommunicationPreferenceEmailUpdate ||
      this.isCommunicationPreferenceRadioBtn ||
      this.isScheduledPriceBuildEmailUpdate ||
      this.ismonthlyPriceBuildRadioBtn ||
      this.isMyListUpdate ||
      this.isBranchProductUpdateRadioBtn ||
      this.isFormatUpdate ||
      this.isdefaultDownloadFormatUpdate ||
      this.isPriceBuildItemFlagRadioBtn ||
      this.isPriceListUpdate
    ) {
      this.openModal(num, this.previousprefTypeNum);
      this.previousprefTypeNum = num;
    } else {
      if (num == 2 || num == 5 || num == 4) {
        this.getOrgUsersData();
      }
      this.getPreferenceData();
      if(num == 2) {
        this.accDisconnected = false;
        this.getAccountConnection();
      }
      this.prefTypeNum = num;
      this.selectedTab = num + 'true';
      this.previousprefTypeNum = num;
      if (this.selectedTab == "2true") {
        document.getElementById('menu-items').scrollLeft = 85;
      }
      else if (this.selectedTab == "3true") {
        document.getElementById('menu-items').scrollLeft = 245;
      }
      else if (this.selectedTab == "4true") {
        document.getElementById('menu-items').scrollLeft = 400;
      }
      else if (this.selectedTab == "5true") {
        document.getElementById('menu-items').scrollLeft = 480;
      }
    }
    this.ref.markForCheck();
  }

  validateEmail(email: any) {
    const mailFormat = "^[a-z0-9._%+-]+@[a-z0-9._%+-]*$"
    if (email.match(mailFormat)) {
      this.isEmailValid = false;
      return false;
    } else {
      this.isEmailValid = true;
      return true;
    }
  }
  emailCheckForRadioClcik() {
    if (this.isEmailValid) {
      return true;
    } else {
      return false;
    }
  }

  emailChange(value: any) {
    this.isDisabled = this.validateEmail(value);
    this.isEmailUpdated = true;
    this.inputStateService.setUpdatedState(true);
  }

  selectStatement(value) {
    if (value == 'EMAIL') {
      this.isDisabled = this.emailCheckForRadioClcik();
    } else {
      this.isEmailValid = false;
      this.isDisabled = false;
    }
    this.textSelectionUpdated = true;
    this.inputStateService.setUpdatedState(true);
    this.statementSendMethod = value;
  }

  statementEmail(emailId) {
    this.isDisabled = false;
    this.isEmailUpdated = true;
    this.inputStateService.setUpdatedState(true);
  }

  accountBalanceAlertRd() {
    this.isDisabled = false;
    this.accountBalanceAlertRdUpdate = true;
    this.inputStateService.setUpdatedState(true);
  }
  inVoiceAndAdjustmentsEmail(emailId) {
    this.isDisabled = false;
    this.isVoiceAndAdjustmentsEmailUpdate = true;
    this.inputStateService.setUpdatedState(true);
  }

  // accountBalanceAlertEmail(emailId) {
  //   this.isDisabled = false;
  //   this.isaccountBalanceAlertEmailUpdate = true;
  //   this.inputStateService.setUpdatedState(true);
  // }
  validatePhoneNo(phoneNo: any) {
    const phoneFormat = "^((^4)|(^5){1})([0-9]{8})$";
    if (phoneNo.match(phoneFormat)) {
      this.isPhonenoValid = false;
      return false;
    } else {
      this.isPhonenoValid = true;
      return true;
    }
  }
  balanceNumber(phoneNo: any) {
    this.isDisabled = this.validatePhoneNo(phoneNo);
    // this.isDisabled = this.emailCheckForRadioClcik();
    this.isaccountBalanceAlertEmailUpdate = true;
    this.inputStateService.setUpdatedState(true);
  }
  communicationPreferenceEmail(emailId) {
    this.isDisabled = false;
    this.isCommunicationPreferenceEmailUpdate = true;
    this.inputStateService.setUpdatedState(true);
  }

  priceChangeNotificationEmail(emailId) {
  }

  scheduledMonthlyPriceBuildEmail(emailId) {
    this.isDisabled = false;
    this.isScheduledPriceBuildEmailUpdate = true;
    this.inputStateService.setUpdatedState(true);
  }

  connectToXEROButton(content) {
    this.modalRef = this.modalService.open(content, {
      windowClass: 'xeroConnectPopup',
      centered: true,
      size: 'lg',
    });
  }

  connectToMYOBButton() {
    let data: string = 'MYB';
    if (this.connectLabel == 'Connect to') {
      this.accountPrefService.myOBFergusConnect(data).subscribe((data) => {
        if (data != undefined) {
          const isError: boolean = data != undefined ? false : true;
          if (!isError) {
            window.open(data, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
            this.showMyOBRefreshButton = true;
            this.ref.markForCheck();
            this.getAccountConnection();
            this.accDisconnected = false;
          }
        }
      });
    } else {
      let data: string = '&partnerCode=MYB&partnerDesc=MYOB';
      this.accountPrefService.xeroCloudIntegration('D', this.accountEmail, data).subscribe((data) => {
        if (data != undefined) {
          const isError: boolean = data == '200' ? false : true;
          if(data == 'OK') {
          this.showMyOBRefreshButton = false;
          this.connectLabel = 'Connect to';
          this.ref.markForCheck();
          this.getAccountConnection();
          this.accDisconnected = true;
          }
        }
      });
    }
  }

  connecttoFergusButton() {
    let data: string = 'FER';
    if (this.FergusConnectLabel == 'Connect to') {
      this.accountPrefService.myOBFergusConnect(data)
        .subscribe((data) => {
          if (data != undefined) {
            this.showFergusRefreshButton = true;
            const url = 'https://app.fergus.com/integrations/connect/tradelink?token=' + data;
            window.open(url, '_blank');
            this.ref.markForCheck();
            this.getAccountConnection();
            this.accDisconnected = false;
          }
        });
    } else {
      let data: string = '&partnerCode=FER&partnerDesc=FERGUS';
      this.accountPrefService.xeroCloudIntegration('D', this.accountEmail, data).subscribe((data) => {
        if (data != undefined) {
          const isError: boolean = data == '200' ? false : true;
          if(data == 'OK') {
          this.showFergusRefreshButton = false;
          this.FergusConnectLabel = 'Connect to';
          this.ref.markForCheck();
          this.getAccountConnection();
          this.accDisconnected = true;
          }
        }
      });
    }
  }

  accountingSoftwareClicked(value) {
    if (value == 'EMAIL' || value == 'EMAILMULTIPLE') {
     
      if(this.invoiceEmail)
      this.isDisabled = this.validateEmail(this.invoiceEmail); // isDisabled = false
      else
      this.isDisabled = true;
    } else {
      this.isEmailValid = false;
      
    }
    // this.isDisabled = false;
    this.accountSoftwareRadio = true;
    this.inputStateService.setUpdatedState(true);
    if (value == 'accounting') {
     
      this.isEmailHide = false;
      this.isDisabled = true;
      // this.getAccountConnection();
      this.showAccountingSection = true;
      // this.showAccountingSection = false;
      this.invoiceSelectedOption = value;
      this.accountSoftwareRadio = false;
      this.isdefaultDownloadFormatUpdate = false;
      // this.savePreferencesSettings();
    } else if (value == 'PRINT') {
   
      this.isEmailHide = false;
      this.isDisabled = false;
      this.invoiceSelectedOption = value;
      this.showAccountingSection = false;
    } else {
 
      this.isEmailHide = true;
      this.inputStateService.setUpdatedState(true);
      this.invoiceSelectedOption = value;
      this.showAccountingSection = false;
    }
  }
  communicationPrefSub() {
    this.isDisabled = this.emailCheckForRadioClcik();
    this.isCommunicationPreferenceRadioBtn = true;
    this.inputStateService.setUpdatedState(true);
  }
  monthlyPriceRadioBtn() {
    this.isDisabled = this.emailCheckForRadioClcik();
    this.ismonthlyPriceBuildRadioBtn = true;
    this.inputStateService.setUpdatedState(true);
  }
  priceBuildItemFlagRadioBtn(value: boolean) {
    this.isDisabled = this.emailCheckForRadioClcik();
    this.priceBuildOrderItemFlag = true;
    this.priceBuildProductsFlag = false;
    this.chooseFromMyList = false;
    this.myCompletePriceListFlag = false;
    this.isPriceBuildItemFlagRadioBtn = true;
    this.selectedListItem = null;
    this.isListDisable = true;
    this.inputStateService.setUpdatedState(true);
  }

  completePriceListFlagChange(value: boolean) {
    this.isDisabled = this.emailCheckForRadioClcik();
    this.priceBuildOrderItemFlag = false;
    this.myCompletePriceListFlag = true;
    this.priceBuildProductsFlag = false;
    this.chooseFromMyList = false;
    this.isPriceBuildItemFlagRadioBtn = true;
    this.selectedListItem = null;
    this.isListDisable = true;
    this.inputStateService.setUpdatedState(true);
  }


  branchProductChange() {
    this.isDisabled = this.emailCheckForRadioClcik();
    this.priceBuildProductsFlag = true;
    this.chooseFromMyList = false;
    this.priceBuildOrderItemFlag = false;
    this.myCompletePriceListFlag = false;
    this.isBranchProductUpdateRadioBtn = true;
    this.selectedListItem = null;
    this.isListDisable = true;
    this.inputStateService.setUpdatedState(true);
  }
  chooseFromMylistFlagChange() {
    if (this.isListLoad) {
      this.isListDisable = false;
    }
    this.isDisabled = this.emailCheckForRadioClcik();
    this.chooseFromMyList = true;
    this.myCompletePriceListFlag = false;
    this.priceBuildProductsFlag = false;
    this.priceBuildOrderItemFlag = false;
    
    this.isPriceListUpdate = true;
    // this.isListDisable = false;
    this.inputStateService.setUpdatedState(true);
  }
  formatChange() {
    this.isDisabled = this.emailCheckForRadioClcik();
    this.isFormatUpdate = true;
    this.inputStateService.setUpdatedState(true);
  }
  myListChange() {
    this.isDisabled = this.emailCheckForRadioClcik();
    this.isMyListUpdate = true;
    this.inputStateService.setUpdatedState(true);
  }
  defaultDownloadFormatChange() {
    this.isDisabled = this.emailCheckForRadioClcik();
    this.isdefaultDownloadFormatUpdate = true;
    this.inputStateService.setUpdatedState(true);    
  }
  connectionChanged(value) {
    if (value == true) {
      this.infoMessage = 'Please disconnect other Accounts first.';
      this.errorInd = true;
      this.accDisconnected = false;
    } else {
      if (this.accountPrefService.getConnectStatus() == 'D') {
        this.infoMessage = 'Successfully cancelled Cloud connection.';
        this.errorInd = true;
        this.accDisconnected = true;
      }
    }
    setTimeout(() => {
      this.errorInd = false;
    }, 10000);
    this.getAccountConnection();
  }


  MYOBconnectionChanged(value) {
    if (value == true) {
      this.infoMessage = 'Please disconnect other Accounts first.';
      this.errorInd = true;
    } else {
      this.showMyOBRefreshButton = true;
      if (this.accountPrefService.getConnectStatus() == 'D') {
        this.infoMessage = 'Successfully cancelled Cloud connection.';
        this.errorInd = true;
      }
    }
    setTimeout(() => {
      this.errorInd = false;
    }, 10000);
    this.getAccountConnection();
  }
  getAccountConnection() {
    //partnerCode = FER,MYB,XRO,SMP
    // connectionStatus = C , A, D
    this.accountPrefService.cloudIntIntialService().subscribe((data) => {
      if (data != undefined) {
        this.connectionStatus = data.partners[0].connectionStatus == 'I' ? 'A' : data.partners[0].connectionStatus;
        this.accountPrefService.setConnectStatus(this.connectionStatus);
        this.connectedAccSoftware = data.partners[0].description;
        // Rewrite once all Provide will come  - varathan
        if (data.partners[0].description == 'MYOB') {
          this.xeroEnabled = true;
          if (this.connectionStatus == 'A') {
            this.connectLabel = 'Disconnect from';
            this.connectionStatus = 'D';
            this.accountPrefService.setConnectStatus('D');
            this.showMyOBRefreshButton = false;
          } else if (this.connectionStatus == 'D') {
            this.connectLabel = 'Connect to';
            this.connectionStatus = 'A';
            this.accountPrefService.setConnectStatus('A');
            this.connectedAccSoftware = 'MYOB';
          }
        }
        if (data.partners[0].description == 'XERO') {
          this.xeroEnabled = true;
          if (this.connectionStatus == 'A') {
            this.XeroConnectLabel = 'Disconnect from';
            this.connectionStatus = 'D';
            this.accountPrefService.setConnectStatus('D');
          } else if (this.connectionStatus == 'D') {
            this.XeroConnectLabel = 'Connect to';
            this.connectionStatus = 'A';
            this.accountPrefService.setConnectStatus('A');
            this.connectedAccSoftware = 'XERO';
          }
        }
        if (data.partners[0].description == 'SIMPRO') {
          if (this.connectionStatus == 'A') {
            this.connectionStatus = 'D';
            this.simPROchange = 'Disconnect from simPRO';
          } else if (this.connectionStatus == 'D') {
            this.connectionStatus = 'A';
            this.simPROchange = 'simPRO Invoice Help Guide';
          }
        }
        if (data.partners[0].description == 'FERGUS') {
          this.xeroEnabled = true;
          if (this.connectionStatus == 'A') {
            this.FergusConnectLabel = 'Disconnect from';
            this.connectionStatus = 'D';
            this.accountPrefService.setConnectStatus('D');
            this.showFergusRefreshButton = false;
          } else if (this.connectionStatus == 'D') {
            this.FergusConnectLabel = 'Connect to';
            this.connectionStatus = 'A';
            this.accountPrefService.setConnectStatus('A');
            this.connectedAccSoftware = 'FERGUS';
          }
        }
        if(this.accDisconnected == true) {
          this.getPreferenceData();
        }
        this.ref.markForCheck();
      }
    });
  }


  simProClick() {
    window.open('https://helpguide.simprogroup.com/Content/Service-and-Enterprise/automatic-supplier-invoice-import.htm', '_blank');
  }
  simProGuideClicked() {
    window.open('https://helpguide.simprogroup.com/Content/Service-and-Enterprise/automatic-catalogue-import.htm?Highlight=automatic', '_blank');
  }
  
  savePreferencesSettingsOnPopup(prevTypeNum: any, nextTab: any) {
    var preferenceType,
      email,
      phoneNo = '';
    var jsonObject = {};
    var emailKey = 'email';
    var phoneKey = 'phoneNumber';
    var typeKey = 'preferenceType';
    var methodKey = 'sendMethod';
    var softwareKey = 'accountingSoftware';
    var listNameKey = 'myListName';
    var frequentlyOrderItemkey = 'frequentlyOrderItemFlag';
    var myBranchProductsFlagkey = 'myBranchProductsFlag';
    var downloadFormat = 'downloadFormat';
    if (prevTypeNum == 1) {
      preferenceType = 'STATEMENT';
      email = this.emailId;
      phoneNo = this.phoneNumber;
      if (this.statementSendMethod == 'EMAIL') {
        jsonObject[emailKey] = email;
      } else {
        jsonObject[emailKey] = '';
      }
      jsonObject[typeKey] = preferenceType;
      jsonObject[phoneKey] = phoneNo;
      jsonObject[methodKey] = this.statementSendMethod;
    } else if (prevTypeNum == 2) {
      preferenceType = 'INVOICE';
      email = this.invoiceEmail;
      phoneNo = '';
      if (this.invoiceSelectedOption == 'EMAIL' || this.invoiceSelectedOption == 'EMAILMULTIPLE') {
        jsonObject[emailKey] = this.invoiceEmail;
      } else {
        jsonObject[emailKey] = '';
      }
      jsonObject[phoneKey] = phoneNo;
      jsonObject[typeKey] = preferenceType;
      jsonObject[downloadFormat] = this.selecteddefaultDownloadFormatItem;
      if (!this.showAccountingSection) {
        jsonObject[methodKey] = this.invoiceSelectedOption;
      } else {
        jsonObject[softwareKey] = true;
        jsonObject[methodKey] = '';
      }
    } else if (prevTypeNum == 3) {
      preferenceType = 'ACCOUNTBALANCE';
      jsonObject[typeKey] = preferenceType;
      jsonObject[emailKey] = this.accountBalanceEmail;
      jsonObject[phoneKey] = '0' + this.accountBalancePhoneNo;
      jsonObject[methodKey] = this.accountBalanceAlertMethod;
    }else if (this.prefTypeNum === 4) {
      jsonObject['preferenceType'] = 'COMMUNICATION';
      jsonObject['communicationPreference'] = this.subscribedFlag;

    } else if (prevTypeNum === 5) {
      
      jsonObject[typeKey] = 'PRICECHANGES';
      jsonObject['scheduleMonthlyPrefEmail'] = this.scheduleMonthlyPrefEmail;
      jsonObject['scheduleMonthlyNotificationFlag'] = this.scheduleMonthlyNotificationFlag;
      jsonObject['frequentlyOrderItemFlag'] = this.priceBuildOrderItemFlag;
      jsonObject['myBranchProductsFlag'] = this.priceBuildProductsFlag;
      jsonObject['chooseFromMyListFlag'] = this.chooseFromMyList;
      jsonObject['myCompletePriceListFlag'] = this.myCompletePriceListFlag;
      if (this.chooseFromMyList) {
        jsonObject['myListName'] = this.selectedListItem;
      }
      jsonObject['downloadPriceFormat'] = this.selectedFormatItem;
    }
    var accountId = localStorage.getItem('selectedIUID');
   
    this.accountPrefService
      .updatePreferencesSettings(this.accountEmail, accountId, jsonObject)
      .subscribe((status) => {
        // if(this.clickedByNavigation){
        //   this.clickedByNavigation = false;
        // }
        this.infoMessage = 'Changes have been made successfully';
        this.successInd$.next(true);
        this.resetFormValidations();
        setTimeout(() => {
          this.successInd$.next(false);
          this.prefTypeNum = nextTab;
          this.selectedTab = nextTab + 'true';
        }, 2000)
      });
  }
}
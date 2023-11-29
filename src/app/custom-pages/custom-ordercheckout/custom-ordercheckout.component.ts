import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './custom-dialog/dialog.component';
import { ActiveCartService, MultiCartService } from '@spartacus/core';
import { checkoutService } from 'src/app/core/service/checkout.service';
import { FIUserAccountDetailsService } from 'src/app/core/service/userAccountDetails.service';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbDate,
  NgbCalendar,
} from '@ng-bootstrap/ng-bootstrap';
import { startWith, map, filter } from 'rxjs/operators';
import { TimePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { FindStoreService } from 'src/app/core/service/findStore.service';
import { ProductHelpService } from 'src/app/core/service/helpwithproduct.service';

export interface AddressData {
  selected: boolean;
  value: string;
}

function padNumber(value: number | null) {
  if (!isNaN(value) && value !== null) {
    return `0${value}`.slice(-2);
  }
  return '';
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');

      let dateObj: NgbDateStruct = {
        day: <any>null,
        month: <any>null,
        year: <any>null,
      };
      const dateLabels = Object.keys(dateObj);

      dateParts.forEach((datePart, idx) => {
        dateObj[dateLabels[idx]] = parseInt(datePart, 10) || <any>null;
      });
      return dateObj;
    }
    return null;
  }

  static formatDate(date: NgbDateStruct | NgbDate | null): string {
    return date
      ? `${padNumber(date.day)}/${padNumber(date.month)}/${date.year || ''}`
      : '';
  }

  format(date: NgbDateStruct | null): string {
    return NgbDateCustomParserFormatter.formatDate(date);
  }
}

@Component({
  selector: 'app-custom-ordercheckout',
  templateUrl: './custom-ordercheckout.component.html',
  styleUrls: ['./custom-ordercheckout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  ],
})
export class CustomOrderCheckoutComponent implements OnInit {
  ccVal = new Date(2022, 0, 28, 10, 0, 0);
  ccminTime = new Date(2022, 0, 28, 6, 0, 0);
  ccmaxTime = new Date(2022, 0, 28, 22, 0, 0);
  title = 'trade-plus';
  name!: string;
  streets: string[] = [
    'Champs-Élysées',
    'Lombard Street',
    'Abbey Road',
    'Fifth Avenue',
  ];
  filteredStreet: Observable<string[]>;

  public infoMessage: string = `Due to the delay since you first selected ‘Checkout’ the pre-populated date and time may have updated to ensure we can meet our customer promise. You will be returned to the Cart where you can select Checkout once again to refresh this information.`;
  successInd$ = new BehaviorSubject<boolean>(false);
  errorInd: boolean = false;
  isDisabled: boolean = false;
  isLocationDisabled: boolean = false;
  getCheckoutQuoteData:any;
  getQuotaOrderJob:any;
  userActivity;
  userInactive: Subject<any> = new Subject();
  formatQuteVAL:any;

  //New for address section new code
  public checkoutData: any;
  @ViewChild('jobAccountAddr') jobAccountAddr;
  @ViewChild('forRadiobtn') forRadiobtn;
  //For validation Purpose
  @ViewChild('isAddrSelectedOrNot') isAddrSelectedOrNot;
  public orderRefDel: string = '';
  public orderRefCC: string = '';
  public delInstructionsDel = '';
  public delInstructionsCC = '';
  @ViewChild('deliverTimeObj', { static: false })
  deliverTimeObj: TimePickerComponent;
  @ViewChild('collectTimeObj', { static: false })
  collectTimeObj: TimePickerComponent;
  public maxTime: any;

  public homebranch: any;
  //accordian expand property
  public branchDetails: any;
  public selectState: string = localStorage.getItem('isPreState') || undefined;
  ACTIVE_ITEM: string = 'active-box';
  public isDeliveryBox: boolean;
  public selectedAddressDel: any = 'Confirmed Address';
  public selectedAddressCC: any = 'Confirmed Address';
  public isAddAddressManual: boolean;
  public isViewOrLess: boolean = true;
  public isExpandedAccPanel: boolean = true;
  public isExpandedRecPanel: boolean = false;
  public isExpandedAddPanel: boolean = false;
  public deliverTime: any;
  public minTime: any;
  public fixedMinDate: any;
  public fixedMaxDate: any;
  public dateInputValue: any;
  public collectTime: any;
  public fixedDate: any;
  public tempDate: any;
  public ngbMinDate: any;
  // Accordian expand collapse for Delivery
  isFirstAccDel = false;
  isSecondAccDel = false;
  isThirdAccDel = false;
  isFourthAccDel = false;
  isFifthAccDel = false;
  // Accordian expand collapse for Click & collect
  isFirstAccCC = false;
  isSecondAccCC = false;
  isThirdAccCC = false;
  isFourthAccCC = false;
  isLoader = false;
  deliveryMode: any;
  selectboxval: boolean = true;
  pkID: any;

  public states: any = ['state1', 'state2', 'state3'];
  public isAgree: boolean = true;
  public stateList: any;
  public dayName: string;
  public currentDay: string;
  public dataDateValue: any;
  public streetTypeData: any;
  public defaultRequestTime: any;
  public manualAddressData: any = {
    streetName: '',
    lotNumber: '',
    streetType: undefined,
    crossStreet: '',
    suburb: '',
    postCode: '',
  };
  public DummyManualAddressData: any = {
    streetName: '',
    lotNumber: '',
    streetType: '',
    crossStreet: '',
    suburb: '',
    postCode: '',
  };
  public fields: Object = { text: 'value', value: 'value' };
  public watermark: string = 'Select Job Account Number';
  contactDetails: any;
  cartItemsData: any;
  quoteItemsData: any;
  previousUrl: string;
  cartDataObj: any;
  quoteDataObj:any;
  emailId: any;
  control = new FormControl();
  branchListData: any;
  tempBranchListData: any;
  public jobValue: any;
  coreLogicToken: any;
  tempOptionDisabled: boolean = false;
  public deliveryDisableDates: any;
  public ccDisableDates: any;
  public address: any;
  public checkedBox: boolean = false;
  public routerURL: any;
  addressId: any;

  formGroup = new FormGroup({});
  selectedAddressDel_Quote: any;
  getQuotecode: any;
  cartId: any;
  getViewQdpcode: any;
  getquotePagename: any;
  currentUrl: any;
  url: any;
  ngDate: any;
  ngTime: any;
  // selectedAddressTempData: any;
  constructor(
    public dialog: MatDialog,
    public router: Router,
    protected activeCartService: ActiveCartService,
    public checkoutService: checkoutService,
    private userProfileDetailsService: FIUserAccountDetailsService,
    public commonService: CommonService,
    public datePipe: DatePipe,
    public ref: ChangeDetectorRef,
    public FindStoreService: FindStoreService,
    private dateAdapter: NgbDateAdapter<string>,
    private calendar: NgbCalendar,
    private multiCartService: MultiCartService,
    private productHelpService: ProductHelpService
  ) {
    this.setTimeout();
    this.userInactive.subscribe(() => {
      this.errorInd = true;
      this.isDisabled = true;
      this.ref.markForCheck();
    });
    // this.commonService.show();    'Commenting this line as it shows loader continuously'
    this.deliveryDisableDates = (date: NgbDateStruct) => {
      return [6, 7].includes(
        calendar.getWeekday(new NgbDate(date.year, date.month, date.day))
      );
    };
    this.ccDisableDates = (date: NgbDateStruct) => {
      return [7].includes(
        calendar.getWeekday(new NgbDate(date.year, date.month, date.day))
      );
    };
    this.formGroup.addControl(
      'test',
      new FormControl({ day: 1, month: 4, year: 1969 })
    ); //nice
    this.jobValue = '';
    let defaultValue = this.checkoutService.getDefaultValue();
    this.orderRefCC = defaultValue.orderRefCC || '';
    this.orderRefDel = defaultValue.orderRefDel || '';
    this.selectedAddressDel = defaultValue.addressIdDel;
    this.selectedAddressCC = defaultValue.addressIdCC;
    this.delInstructionsDel = defaultValue.delInstructionsDel;
    this.delInstructionsCC = defaultValue.delInstructionsCC;
    this.branchDetails = defaultValue.branchDetails;
    if (defaultValue.deliverMode != null) {
      this.isDeliveryBox = defaultValue.deliverMode;
    } else {
      this.isDeliveryBox = true;
    }
    this.getBranchDetails();
    
    this.checkoutService.getStates().subscribe((data) => {
      if (data != undefined) {
        this.stateList = data.regions;
      }
    });
    // this.checkoutService.getCoreLogicToken().subscribe((data) => {
    //   if (data != undefined) {
    //     this.coreLogicToken = data.access_token;
    //   }
    // });
  }
  setTimeout() {
    this.userActivity = setTimeout(
      () => this.userInactive.next(undefined),
      300000
    );
  }
  closeSuccessMsg() {
    this.errorInd = false;
    this.router.navigateByUrl('cart');
  }
  public mobAccIcon = true;
  public timerId: any;
  coreLogicSearch(textEvent) {
    let temps = textEvent.target.value.toLowerCase();
    if (temps.length >= 3) {
      this.isLoader = true;
      temps =
        temps.substr(0, 3) == 'lot' && temps[3] != ' '
          ? temps.replace('lot', 'lot ')
          : temps;
      temps =
        temps.substr(0, 4) == 'lots' && temps[3] != ' '
          ? temps.replace('lots', 'lots ')
          : temps;
      if (this.timerId) {
        this.timerId.unsubscribe();
      }
      this.timerId = this.checkoutService
        .getCoreLogicSearch(textEvent.target.value)
        .subscribe((data) => {
          if (data.suggestions) {
            this.tempOptionDisabled =
              data.suggestions.length == 0 ? true : false;
            this.filteredStreet = data.suggestions.map((value) => {
              return {
                // streetId: value.streetId,
                propertyId: value.propertyId,
                suggestion: value.suggestion,
              };
            });
            this.ref.markForCheck();
          }
          this.isLoader = false;
        });
    } else {
      this.filteredStreet = undefined;
      this.isLoader = false;
      if (this.timerId) { 
        this.timerId.unsubscribe();
      }
    }
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
        this.previousUrl = null;
        this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
          this.previousUrl = this.currentUrl;
          this.currentUrl = event.urlAfterRedirects;
          console.log("prev: ", this.previousUrl)
          console.log("curr: ", this.currentUrl)
            })  
  //  console.log("Hello Prev URL:", this.previousUrl)
   this.getquotePagename = this.commonService.getQlpFlag();
    this.getQuotecode = this.commonService.getQuoteValue();
    this.getViewQdpcode = localStorage.getItem("deliveryModeName");
    console.log("this.getViewQdpcode ",JSON.stringify(this.getViewQdpcode ));
    this.filteredStreet = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    let isManualCheck = JSON.parse(localStorage.getItem('isManual'));
    if (isManualCheck) {
      this.manualAddressData = isManualCheck;
    }
    this.dropdownColorChange();
    
   // console.log(JSON.stringify(this.getCheckoutQuoteData));
   

   this.previousUrl = this.commonService.getUrl();
   
   if(this.previousUrl.includes('/quotesPage')){
    this.url = 'quotesPage'
    this.isDisabled = true;
    this.checkedBox = true;
    
    this.getCheckoutQuoteData = this.commonService.getCheckoutData();
    this.cartId = this.getCheckoutQuoteData.code
    this.commonService.setAddressData(this.getCheckoutQuoteData);
    this.deliveryMode = this.getCheckoutQuoteData.deliveryMode;
    
    if(this.deliveryMode?.code == 'Delivery' ){
      this.selectBox(true);
      this.selectboxval = true;
      this.isLocationDisabled = false;
    }
    else{
      this.selectBox(false);
      this.selectboxval = false;
      this.isLocationDisabled = true;
    }

    this.commonService.setData(this.deliveryMode)
  // alert(this.getCheckoutQuoteData.deliveryAddress.id)
  if(this.getCheckoutQuoteData.deliveryAddress.address4 != undefined){
    this.address = this.getCheckoutQuoteData.deliveryAddress.formattedAddress.split(',')[0] + ',' + this.getCheckoutQuoteData.deliveryAddress.line2 + "," + this.getCheckoutQuoteData.deliveryAddress.address3 + "," +
    this.getCheckoutQuoteData.deliveryAddress.address4 + "," + this.getCheckoutQuoteData.deliveryAddress.town + "," +
    this.getCheckoutQuoteData.deliveryAddress.postalCode + "," + this.getCheckoutQuoteData.deliveryAddress.region.name;   
  }
  else{
    this.address = this.getCheckoutQuoteData.deliveryAddress.formattedAddress.split(',')[0] + ',' + this.getCheckoutQuoteData.deliveryAddress.line2 + "," + this.getCheckoutQuoteData.deliveryAddress.address3 + "," +
    '' + "," + this.getCheckoutQuoteData.deliveryAddress.town + "," +
    this.getCheckoutQuoteData.deliveryAddress.postalCode + "," + this.getCheckoutQuoteData.deliveryAddress.region.name;   

  }
    // this.address = this.getCheckoutQuoteData.deliveryAddress.formattedAddress;
    this.commonService.setAddressVal(this.address);
    this.orderRefDel =this.getCheckoutQuoteData.purchaseOrderNumber;
    localStorage.setItem('orderRefCC', this.orderRefCC);
    this.selectedAddressDel_Quote = this.address;
    if(this.getquotePagename == 'QLP'){
      this.delInstructionsDel = this.commonService.getCheckoutData().customerInstructions;
      this.delInstructionsCC = this.commonService.getCheckoutData().customerInstructions;
      console.log("this.delInstructionsDel QLP",this.delInstructionsDel);
    }
    else if (this.getquotePagename == 'QDP'){
      this.delInstructionsDel = localStorage.getItem('comments');
   //   alert(this.delInstructionsDel);
      this.delInstructionsCC = localStorage.getItem('comments');
    //  alert(typeof(this.delInstructionsDel));
      if(this.delInstructionsDel == 'undefined'){
        this.delInstructionsDel = '';
        console.log("if this.delInstructionsDel QDP",this.delInstructionsDel);
      }
     
    }
   
   
    this.orderRefCC = this.commonService.getCheckoutData().purchaseOrderNumber;
    localStorage.setItem('orderRefCC', this.orderRefCC);
    localStorage.setItem('previousUrl', this.previousUrl);
    this.getQuoteCartData();
   }
   else if(this.previousUrl.includes('/cart')){
      this.getCartData();
      this.deliveryMode = true;
      this.selectboxval = true;
      // this.checkedBox = false;
      let defaultValue = this.checkoutService.getDefaultValue();
      this.selectedAddressDel = defaultValue.addressIdDel;
      localStorage.setItem('previousUrl', this.previousUrl);
   }
   this.commonService.onLoadGTMMethod('other', 'Fulfillment', '0', window.location.href);
   }

  ngAfterViewInit() {
    setTimeout(() => {
      var today = new Date().toISOString().split('T')[0];
      document.getElementsByName('txtDate')[0].setAttribute('min', today);
    });
  }
  private _filter(value: string): string[] {
    return this.checkoutData?.deliveryAddresses;
  }

  clearCart() {
    this.commonService.show();
    this.activeCartService.getActiveCartId().subscribe(data => {
      let obj = {
        cartId: data
      }
      this.productHelpService.clearAllCart(obj).subscribe(data => {
        if(data)  {
          // this.activeCartService.getActive()
          this.multiCartService.reloadCart(data);
          this.activeCartService.isStable().subscribe((data) => {
            if (data) { 
              this.commonService.hide();
            }
          })    
        }
      })
    })
    // this.cartSubscription = this.entries$.subscribe((result) => {
    //   this.cartList = result;
    //   this.cartList.forEach(cartItem => {
    //     setTimeout(() => {
    //       this.activeCartService.removeEntry(cartItem);
    //     }, 500);
    //   });
    // });
    // this.removeCartList
    // forkJoin(this.removeCartList);
  }

  updateData() {
    if (this.checkoutData) {
      var closingDateTime = this.checkoutData.requestedDate + ' ' + '4:00 PM';
      this.maxTime = new Date(closingDateTime.replace(/-/g, '/'));
      this.fixedMaxDate = this.maxTime;
    }
  }

  onOpen() {
    console.log("Checkoutdata:", JSON.stringify(this.checkoutData))
    var isToday =
      new Date(this.checkoutData.requestedDate.replace(/-/g, '/')).setHours(
        0,
        0,
        0,
        0
      ) == new Date().setHours(0, 0, 0, 0);
    if (isToday) {
      this.updateData();
    } else {
      this.updateStaticTime(this.isDeliveryBox);
    }
  }
  getBranchDetails() {
    let homeBranchInfo: any = JSON.parse(
      localStorage.getItem('homeBranchInfo')
    );
    if (this.branchDetails == undefined) {
      this.checkoutService
        .getBranches(
          homeBranchInfo.geoPoint.latitude,
          homeBranchInfo.geoPoint.longitude
        )
        .subscribe((data: any) => {
          if (data.stores != undefined) {
            this.branchListData = (data as any).stores;
            this.branchListData.forEach((element) => {
              if (
                element.buOpeningSchedule &&
                element.buOpeningSchedule.length > 0
              ) {
                element.buOpeningSchedule.forEach((data) => {
                  if (
                    data.weekDayOpeningList &&
                    data.weekDayOpeningList.length > 0
                  ) {
                    data.weekDayOpeningList.push(
                      data.weekDayOpeningList.shift()
                    );
                  }
                });
              }
            });
            this.tempBranchListData = homeBranchInfo;
            this.tempBranchListData.buOpeningSchedule.forEach((data) => {
              if (
                data.weekDayOpeningList &&
                data.weekDayOpeningList.length > 0
              ) {
                data.weekDayOpeningList.push(data.weekDayOpeningList.shift());
              }
            });
          }
        });
    } else {
      this.checkoutService
        .getBranches(
          homeBranchInfo.geoPoint.latitude,
          homeBranchInfo.geoPoint.longitude
        )
        .subscribe((data: any) => {
          if (data.stores != undefined) {
            this.branchListData = (data as any).stores;
          }
        });
      this.tempBranchListData = this.branchDetails;
    }
  }
  getRoundMinTime(minTime) {
    var coff = 1000 * 60 * 30;
    return new Date(Math.ceil(minTime.getTime() / coff) * coff);
  }
  getCheckoutInfo() {
    const dataInfo = {
      email: this.emailId,
      deliveryMode: this.isDeliveryBox ? 'Delivery' : 'Pick Up',
    };
    this.commonService.setData(dataInfo);
    // Before data fetching set value as null
    setTimeout(() => {
      this.setValueUpdate(null, null);
    });
    this.dateInputValue = null;

    this.checkoutService.getCheckoutInfo(dataInfo).subscribe((data) => {
      // console.log("Testing",JSON.stringify(data));
      if (data != undefined) {
        this.checkoutData = data;
        if (
          !(
            this.checkoutData.jobAccounts &&
            this.checkoutData.jobAccounts.length > 0
          )
        ) {
          this.checkoutData.jobAccounts = ['No job accounts available'];
        }
        let tempDateParser: any = data.requestedDate.split('/');
        this.checkoutData.requestedDate = this.datePipe.transform(
          new Date(tempDateParser[2], tempDateParser[1] - 1, tempDateParser[0]),
          'yyyy-MM-dd'
        );
        this.streetTypeData = data.streetTypes;
        this.defaultRequestTime = data.requestedTime.slice();
        this.checkoutData.requestedTime = data.requestedTime;
        this.fixedDate = this.checkoutData.requestedDate;
        var ttValue =
          this.checkoutData.requestedDate +
          ' ' +
          this.checkoutData.requestedTime;
        var checkoutDateValue = new Date(ttValue.replace(/-/g, '/'));
        this.dateInputValue = {
          day: checkoutDateValue.getDate(),
          month: checkoutDateValue.getMonth() + 1,
          year: checkoutDateValue.getFullYear(),
        };
        var currentDateSplit = this.checkoutData.currentDate.split(/[/]/);
        this.ngbMinDate = {
          day: Number(currentDateSplit[0]),
          month: Number(currentDateSplit[1]),
          year: Number(currentDateSplit[2]),
        };
        // this.deliverTime = this.collectTime = checkoutDateValue;

        var isToday =
          new Date(this.checkoutData.requestedDate.replace(/-/g, '/')).setHours(
            0,
            0,
            0,
            0
          ) == new Date().setHours(0, 0, 0, 0);
        if (isToday) {
          this.updateRequestedTime();
        } else {
          this.updateStaticTime(this.isDeliveryBox);
          this.setValueUpdate(this.collectTime, this.deliverTime);
        }
        this.checkoutData && this.checkoutData.requestedDate;

        this.contactDetails = data.siteContacts[0];
        this.filteredStreet = this.control.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
        this.commonService.hide();
      }
      // this.collectTimeObj && this.collectTimeObj.refresh();
      // this.deliverTimeObj && this.deliverTimeObj.refresh();
    });
  }
  updateRequestedTime() {
    
    console.log("local storage:",localStorage.getItem('prevBrowseUrl'))
    if(localStorage.getItem('prevBrowseUrl') == '/orderSummaryPage?isDelivery=true' || localStorage.getItem('prevBrowseUrl') == '/orderSummaryPage?isDelivery=false'){
      var ttValue =
      this.checkoutData.requestedDate + ' ' + this.checkoutData.currentTime;
      console.log('ttvalue prev:', ttValue)
      var checkoutDateValue = new Date(ttValue.replace(/-/g, '/'));
      console.log('checkoutdate prev:', checkoutDateValue)
      this.fixedMinDate = this.minTime = checkoutDateValue;
      this.minTime = this.getRoundMinTime(this.minTime);
      console.log('Min prev:', this.minTime)
      this.deliverTime = this.collectTime = localStorage.getItem('updatedTime');
      
    }
    else if (localStorage.getItem('prevBrowseUrl') != '/orderSummaryPage?isDelivery=true' || localStorage.getItem('prevBrowseUrl') != '/orderSummaryPage?isDelivery=false'){
      var ttValue =
      this.checkoutData.requestedDate + ' ' + this.defaultRequestTime;
      console.log('ttvalue cur:', ttValue)
      var checkoutDateValue = new Date(ttValue.replace(/-/g, '/'));
      console.log('checkoutdate cur:', checkoutDateValue)
      this.fixedMinDate = this.minTime = checkoutDateValue;
      this.minTime = this.getRoundMinTime(this.minTime);
      console.log('Min cur:', this.minTime)
      this.deliverTime = this.collectTime = this.minTime; // for round-off value added
      console.log("Default tym after now", this.defaultRequestTime)
    }
    // this.deliverTime = this.collectTime = this.minTime; // for round-off value added
    this.setValueUpdate(this.collectTime, this.deliverTime);
    this.updateData();
  }
  // data fetching set value
  setValueUpdate(collectTimeArg, deliverTimeArg) {
    let collectTime = collectTimeArg;
    let deliverTime = deliverTimeArg;
    if (this.collectTimeObj) {
      this.collectTimeObj.value = collectTime;
      this.collectTimeObj.dataBind();
    }
    if (this.deliverTimeObj) {
      this.deliverTimeObj.value = deliverTime;
      this.deliverTimeObj.dataBind();
    }
  }

  timeClick(args, timeObj) {
    if (timeObj && timeObj.inputWrapper) {
      timeObj.inputWrapper.container &&
        timeObj.inputWrapper.container.classList.remove('e-disabled');
      timeObj.inputWrapper.buttons &&
        timeObj.inputWrapper.buttons[0] &&
        timeObj.inputWrapper.buttons[0].classList.remove('e-disabled');
      timeObj.show();
    }
  }

  // contactNumber(number) {
  //   let h = number?.replace(/\s/g, '');
  //   return h.substr(0, 2) + ' ' + h.substr(2, 4) + ' ' + h.substr(6, h.length);
  // }
  datechange(args: any, isDeliveryBox: boolean) {
    this.tempDate = args.year + '-' + args.month + '-' + args.day;
    const changeValue: Date = new Date(this.tempDate);
    this.checkoutData.requestedDate = this.tempDate;
    var isToday =
      new Date(this.checkoutData.requestedDate.replace(/-/g, '/')).setHours(
        0,
        0,
        0,
        0
      ) == new Date().setHours(0, 0, 0, 0);
    if (isToday) {
      this.updateRequestedTime();
    } else {
      this.updateStaticTime(isDeliveryBox);
      this.setValueUpdate(this.collectTime, this.deliverTime);
    }
  }

  updateStaticTime(isDeliveryBox: boolean) {
    if (this.checkoutData && this.checkoutData.requestedDate) {
      var isSaturday =
        new Date(
          this.checkoutData.requestedDate.replace(/-/g, '/')
        ).toLocaleDateString('en-US', { weekday: 'long' }) === 'Saturday';
      var dateTimeStr =
        this.checkoutData.requestedDate +
        ' ' +
        (isDeliveryBox || isSaturday ? '8:30 AM' : '7:30 AM');
      this.minTime = this.collectTime = new Date(
        dateTimeStr.replace(/-/g, '/')
      );
      // if(localStorage.getItem('prevBrowseUrl') == '/orderSummaryPage?isDelivery=true'){
      //   console.log("IFF")
      //   this.deliverTime = this.collectTime = localStorage.getItem('updatedTime')
      // }
      // else if (localStorage.getItem('prevBrowseUrl') != '/orderSummaryPage?isDelivery=true'){
      //   console.log("Else")
        this.deliverTime =
        this.collectTime =
        this.minTime =
          this.getRoundMinTime(this.minTime);
      // }
      console.log("Collect:", this.collectTime)
      var isSaturday =
        this.collectTime.toLocaleDateString('en-US', { weekday: 'long' }) ===
        'Saturday';
      var closeDateTimeStr =
        this.checkoutData.requestedDate +
        ' ' +
        (isSaturday ? '11:00 AM' : '4:00 PM');
      this.maxTime = new Date(closeDateTimeStr.replace(/-/g, '/'));
      if(localStorage.getItem('prevBrowseUrl') == '/orderSummaryPage?isDelivery=true' || localStorage.getItem('prevBrowseUrl') == '/orderSummaryPage?isDelivery=false'){
        this.deliverTime = this.collectTime = localStorage.getItem('updatedTime')
      }
      // this.deliverTime = this.collectTime = localStorage.getItem('updatedTime') // WN-475 update the time once selected from edit back to checkout screen
    }
  }

  getCartData() {
    this.activeCartService.getActive().subscribe((data) => {
      this.cartItemsData = data.entries;
     console.log(JSON.stringify("Cart:",this.cartItemsData));
      this.cartDataObj = data;
      // console.log("Cart data:", JSON.stringify(this.cartDataObj))
    });
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.getCheckoutInfo();
      }
    });
  }


  getQuoteCartData() {
    // this.activeCartService.getActive().subscribe((data) => {
    //   this.cartItemsData = data.entries;
    //   console.log("cart page data",JSON.stringify(this.cartItemsData));
    //   this.cartDataObj = data;
    // });
    this.cartItemsData = this.getCheckoutQuoteData.entries;
   console.log(JSON.stringify(this.cartItemsData.product ));
    this.cartDataObj = this.getCheckoutQuoteData;
   // console.log(this.cartDataObj);
    this.formatQuteVAL = this.cartDataObj.productDiscounts?.formattedValue;
   
    this.userProfileDetailsService.getUserAccount().subscribe((data) => {
      if (data != undefined) {
        this.emailId = data.uid;
        this.getCheckoutInfo();
      }
     });
  }
  save_continue_Del_Quote(): void{
    clearTimeout(this.userActivity);
    
    // console.log("Selected Address:", this.selectedAddressDel)
    // console.log("Selected add Quote:", this.selectedAddressDel_Quote)
    if (this.selectedAddressDel == undefined) {
      this.isSecondAccDel = true;
      this.addressId = this.getCheckoutQuoteData.deliveryAddress.id + '|' + this.selectedAddressDel_Quote;
      // return;
    }
    else{
      this.addressId = this.selectedAddressDel;
    }
    let isPreState = localStorage.getItem('isPreState');
    const data = {
      ...this.checkoutData,
      email: this.emailId,
      deliveryMode: 'Delivery',
      addressId: this.addressId,
      cartId: this.cartId,
      manualAddress:
        this.manualAddressData.streetName != ''
          ? {
              ...this.manualAddressData,
              isoCOde: this.selectState,
              town: this.stateList.filter((data: any) => {
                if (isPreState) {
                  return data;
                } else if (data.isocode === this.selectState) {
                  return data;
                }
              })[0].name,
            }
          : null,
      siteContacts: this.contactDetails,
      instructions: this.delInstructionsDel,
      orderRef: this.orderRefDel,
      branchID: '',
      branchName: '',
      branchRegionalCode: '',
      requestedDate: this.tempDate || this.checkoutData.requestedDate,
      isManual: this.manualAddressData.streetName,
    };
    
    this.commonService.show();
    this.checkoutService.updateCheckoutData(data).subscribe((data) => {
      let value = {
        orderRefDel: this.orderRefDel,
        addressIdDel: this.addressId,
        instructionsDel: this.delInstructionsDel,
        branchDetails: this.tempBranchListData,
        deliverMode: true,
      };
      localStorage.setItem('orderRefDel', this.orderRefDel);
      localStorage.setItem(
        'contactDetails',
        JSON.stringify(this.contactDetails)
      );
      localStorage.setItem(
        'deliveryFormatAddress',
        this.addressId.split('|')[1]
      );
      localStorage.setItem('branchID', this.tempBranchListData.branchID);
      this.checkoutService.setDefaultValue(value);
      localStorage.setItem("updatedTime", data.requestedDeliveryTime)
      console.log("My Checkout time:", localStorage.getItem('updatedTime'))
      this.commonService.hide();
      this.router.navigate(['/orderSummaryPage'], {
        queryParams: {
          isDelivery: this.isDeliveryBox,
        },
      });
    });
  }

  save_continue_Del(): void {
    console.log("Delivery clicked")
    clearTimeout(this.userActivity);
    if (this.selectedAddressDel == undefined) {
      this.isSecondAccDel = true;
      return;
    }
    let isPreState = localStorage.getItem('isPreState');
    const data = {
      ...this.checkoutData,
      email: this.emailId,
      deliveryMode: 'Delivery',
      addressId: this.selectedAddressDel,
      manualAddress:
        this.manualAddressData.streetName != ''
          ? {
              ...this.manualAddressData,
              isoCOde: this.selectState,
              town: this.stateList.filter((data: any) => {
                if (isPreState) {
                  return data;
                } else if (data.isocode === this.selectState) {
                  return data;
                }
              })[0].name,
            }
          : null,
      siteContacts: this.contactDetails,
      instructions: this.delInstructionsDel,
      orderRef: this.orderRefDel,
      branchID: '',
      branchName: '',
      branchRegionalCode: '',
      requestedDate: this.tempDate || this.checkoutData.requestedDate,
      isManual: this.manualAddressData.streetName,
    };
    this.commonService.show();
    this.checkoutService.updateCheckoutData(data).subscribe((data) => {
      let value = {
        orderRefDel: this.orderRefDel,
        addressIdDel: this.selectedAddressDel,
        instructionsDel: this.delInstructionsDel,
        branchDetails: this.tempBranchListData,
        deliverMode: true,
      };
      localStorage.setItem('orderRefDel', this.orderRefDel);
      localStorage.setItem(
        'contactDetails',
        JSON.stringify(this.contactDetails)
      );
      localStorage.setItem(
        'deliveryFormatAddress',
        this.selectedAddressDel.split('|')[1]
      );
      localStorage.setItem('branchID', this.tempBranchListData.branchID);
      this.checkoutService.setDefaultValue(value);
      localStorage.setItem("updatedTime", data.requestedDeliveryTime)
      console.log("My Checkout time:", localStorage.getItem('updatedTime'))
      this.commonService.hide();
      this.router.navigate(['/orderSummaryPage'], {
        queryParams: {
          isDelivery: this.isDeliveryBox,
        },
      });
      const confirmationData = JSON.parse(localStorage.getItem('cart-data'));
      console.log("GA4 confirmation data tt", confirmationData);
      // this.updateDataLayer(confirmationData);
      this.updateGAFourDataLayer(confirmationData);
    });
  }
  save_continue_CC(): void {
    console.log("CC clicked")
    clearTimeout(this.userActivity);
    const data = {
      ...this.checkoutData,
      email: this.emailId,
      deliveryMode: 'Pick Up',
      addressId: this.selectedAddressCC || this.tempBranchListData.address.id,
      manualAddress:
        this.manualAddressData.streetName != '' ? this.manualAddressData : null,
      siteContacts: this.contactDetails,
      instructions: this.delInstructionsCC,
      orderRef: this.orderRefCC,
      branchID: this.tempBranchListData.branchID,
      branchName: this.tempBranchListData.name,
      requestedDate: this.tempDate || this.checkoutData.requestedDate,
      branchRegionalCode: this.tempBranchListData.branchRegionalCode,
    };
    this.commonService.show();
    this.checkoutService.updateCheckoutData(data).subscribe((data) => {
      let value = {
        orderRefCC: this.orderRefCC,
        addressIdCC: this.selectedAddressCC,
        instructionsCC: this.delInstructionsCC,
        branchDetails: this.tempBranchListData,
        deliverMode: false,
      };
      localStorage.setItem('orderRefCC', this.orderRefCC);
      localStorage.setItem(
        'contactDetails',
        JSON.stringify(this.contactDetails)
      );
      localStorage.setItem('branchID', this.tempBranchListData.branchID);
      this.checkoutService.setDefaultValue(value);
      localStorage.setItem("updatedTime", data.requestedDeliveryTime)
      console.log("My Checkout time:", localStorage.getItem('updatedTime'))
      this.commonService.hide();
      this.router.navigate(['/orderSummaryPage'], {
        queryParams: {
          isDelivery: this.isDeliveryBox,
        },
      });
      const confirmationData = JSON.parse(localStorage.getItem('cart-data'));
      this.updateGAFourDataLayer(confirmationData);
    });
  }

  jobAccountAddress(value: any, ccOrDel) {
    if (ccOrDel == 'del') {
      this.selectedAddressDel = value;
      this.forRadiobtn.checked = false;
    } else {
      this.selectedAddressCC = value;
    }
    this.isExpandedRecPanel = false;
    this.isExpandedAddPanel = false;
    this.manualAddressData = this.DummyManualAddressData;
    localStorage.removeItem('isManual');
    localStorage.removeItem('isPreState');
  }

  addManualAddress(drop, form) {
    if (form.valid) {
      let lotNumber: string = this.manualAddressData.lotNumber
        ? this.manualAddressData.lotNumber + ', '
        : '';
      let streetName: string = this.manualAddressData.streetName
        ? this.manualAddressData.streetName + ', '
        : '';
      let streetType: string =
        this.manualAddressData.streetType &&
        this.manualAddressData.streetType !== 'undefined'
          ? this.manualAddressData.streetType + ', '
          : '';
      let crossStreet: string = this.manualAddressData.crossStreet
        ? this.manualAddressData.crossStreet + ', '
        : '';
      let suburb: string = this.manualAddressData.suburb
        ? this.manualAddressData.suburb + ', '
        : '';
      let postCode: string = this.manualAddressData.postCode
        ? this.manualAddressData.postCode + ', '
        : '';
      let temp: string = this.stateList.filter((data) => {
        if (data.isocode === this.selectState) {
          return data.name;
        }
      })[0].name;
      let state: string =
        this.selectState && this.selectState !== 'undefined' ? temp : '';
      this.selectedAddressDel =
        lotNumber +
        streetName +
        streetType +
        crossStreet +
        suburb +
        postCode +
        state;
      localStorage.setItem('isManual', JSON.stringify(this.manualAddressData));
      localStorage.setItem('isPreState', this.selectState);
      localStorage.setItem('manualAddress', this.selectedAddressDel);
      this.isExpandedAccPanel = false;
      this.isExpandedRecPanel = false;
      this.isAddAddressManual = false;
    }
  }

  onAccountChange(value: any, expandVal: string) {
    this.selectedAddressDel = value;
    this.jobAccountAddr.nativeElement.value =
    this.jobAccountAddr.nativeElement.options[0].value;
    this.isExpandedAccPanel = false;
    this.isExpandedAddPanel = false;
    this.manualAddressData = this.DummyManualAddressData;
    localStorage.removeItem('isManual');
    localStorage.removeItem('isPreState');
  }
  addAddressManual(args: any) {
    this.isExpandedAccPanel = false;
    this.isExpandedRecPanel = true;
    this.isAddAddressManual = true;
  }
  public coreLogicData: any;
  autocompleteChange(event: any) {
    let tempValue: any = event.option._element.nativeElement['data-value'];
    this.checkoutService
      .getPropertyInfo(tempValue.propertyId)
      .subscribe((data) => {
        if (data) {
          this.manualAddressData.lotNumber = data.line1;
          this.manualAddressData.streetName = data.line2;
          this.streetTypeData.forEach(element => {
            if(element.name == data.address3) {
              this.manualAddressData.streetType = element.code;
            }
          });
          this.manualAddressData.crossStreet = data.address4;
          this.manualAddressData.suburb = data.region.isocode;
          this.selectState = data.region.isocode;
          this.manualAddressData.postCode = data.postalCode;
          // this.coreLogicData = {
          //   country: {
          //     isocode: 'AU',
          //   },
          //   line1: data.street.nameAndNumber,
          //   line2: data.locality.singleLine,
          //   postCode: data.postcode.name,
          //   shippingAddress: true,
          //   visibleInAddressBook: true,
          //   region: {
          //     countryIso: 'AU',
          //     isocode: data.state,
          //   },
          //   town: this.stateList.filter((value: any) => {
          //     if (value.isocode === data.state) {
          //       return data;
          //     }
          //   })[0].name,
          // };
    // if (event.option && event.option.viewValue == 'Add Address Manually') {
    //   this.isAddAddressManual = true;
    // } else {
    //   this.selectedAddressDel = event.option
    //     ? tempValue.streetId + '|' + event.option.value
    //     : '';
    //   this.isAddAddressManual = false;
    //   this.isExpandedAccPanel = false;
    //   this.isExpandedRecPanel = false;
    //   this.isExpandedAddPanel = true;
    // }
    let inputEle: any = document.getElementById('auto-input-ele');
    inputEle.blur();
    // this.manualAddressData = this.DummyManualAddressData;
    // localStorage.removeItem('isManual');
    // localStorage.removeItem('isPreState');
    let lotNumber: string = this.manualAddressData.lotNumber
        ? this.manualAddressData.lotNumber + ', '
        : '';
      let streetName: string = this.manualAddressData.streetName
        ? this.manualAddressData.streetName + ', '
        : '';
      let streetType: string =
        this.manualAddressData.streetType &&
        this.manualAddressData.streetType !== 'undefined'
          ? this.manualAddressData.streetType + ', '
          : '';
      let crossStreet: string = this.manualAddressData.crossStreet
        ? this.manualAddressData.crossStreet + ', '
        : '';
      let suburb: string = this.manualAddressData.suburb
        ? this.manualAddressData.suburb + ', '
        : '';
      let postCode: string = this.manualAddressData.postCode
        ? this.manualAddressData.postCode + ', '
        : '';
      let temp: string = this.stateList.filter((data) => {
        if (data.isocode === this.selectState) {
          return data.name;
        }
      })[0].name;
      let state: string =
      this.selectState && this.selectState !== 'undefined' ? temp : '';
      this.selectedAddressDel =
        lotNumber +
        streetName +
        streetType +
        crossStreet +
        suburb +
        postCode +
        state;
      localStorage.setItem('isManual', JSON.stringify(this.manualAddressData));
      localStorage.setItem('isPreState', this.selectState);
      localStorage.setItem('manualAddress', this.selectedAddressDel);
      this.isExpandedAccPanel = false;
      this.isExpandedRecPanel = false;
      this.isAddAddressManual = false;
    }
  });
  }

  backClick() {
    this.router.navigateByUrl('cart');
  }
  backQuoteClick() {
    this.checkoutService.backToQuote(this.getQuotecode).subscribe(data => {
     
    });

    this.router.navigateByUrl('quotesPage');
  }

  openDialog(tempName?: string): void {
    // if (this.selectboxval == true){
      let temp: any = tempName;
    if (tempName === 'deliveryAddress_Template') {
      temp = this.isDeliveryBox ? tempName : 'addBranch_Template';
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '45%',
      panelClass:
        temp == 'addBranch_Template' ? 'custom-add-branch' : 'contact-template',
      data: {
        templateName: temp,
        name: this.name,
        contactData: this.contactDetails,
        allBranchList: this.branchListData,
        autoFocus: false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.address && result.address != '') {
          // this.addressData.push({ selected: false, value: result.address });
        }
        if (result.contactList) {
          this.contactDetails = result.contactList;
          this.ref.markForCheck();
        }
        if (result.branchData) {
          this.tempBranchListData = result.branchData;
          this.ref.markForCheck();
        }
      }
    });
    // }
    // else {

    // }
  }

  dropdownColorChange() {
    if (this.isDeliveryBox == true) {
      setTimeout(() => {
        var isDeliveryValue = (
          document.getElementById(
            'deliverySelectJobAccount'
          ) as HTMLInputElement
        ).value;
        var isStateValue = (
          document.getElementById('stateSelect') as HTMLInputElement
        )?.value;
        var streetSelect2 = (
          document.getElementById('streetSelect2') as HTMLInputElement
        )?.value;

        if (isDeliveryValue != 'undefined') {
          document
            .getElementById('deliverySelectJobAccount')
            .setAttribute('style', 'color : #495a64 !important');
        }
        // if (isStateValue != 'undefined') {
        //   document
        //     .getElementById('stateSelect')
        //     .setAttribute('style', 'color : #495a64 !important');
        // }
        // if (streetSelect2 != 'undefined') {
        //   document
        //     .getElementById('streetSelect2')
        //     .setAttribute('style', 'color : #495a64 !important');
        // }
      });
    } else {
      setTimeout(() => {
        var isDeliveryValue = (
          document.getElementById('ccSelectJobAccount') as HTMLInputElement
        ).value;
        if (isDeliveryValue != 'undefined') {
          document
            .getElementById('ccSelectJobAccount')
            .setAttribute('style', 'color : #495a64 !important');
        }
      });
    }
  }

  selectBox(isDelivery: boolean) {
    this.commonService.show();
    this.isDeliveryBox = isDelivery;
    this.isExpandedAccPanel = true;
    this.isExpandedRecPanel = false;
    this.isExpandedAddPanel = false;
    this.getCheckoutInfo();
    this.dropdownColorChange();
  }

  numberOnly(event, isDeliveryBox): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 43 &&
      charCode !== 32
    ) {
      return false;
    }
    if (isDeliveryBox == 'Delivery') {
      this.orderRefDel = event.target.value;
    } else if (isDeliveryBox == 'Click & Collect') {
      this.orderRefCC = event.target.value;
    }
    return true;
  }

  alphaNumericsOnly(e) {
    // Accept only alpha numerics, no special characters
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!['$', '>'].includes(str)) {
      return true;
    }
    e.preventDefault();
    return false;
  }

  isViewOrLessToggle() {
    this.isViewOrLess = this.isViewOrLess ? false : true;
  }
  updateGAFourDataLayer(confirmationData) {
    // alert("datalayer");
     let GAtempdata = [];
     console.log("GA4 confirmation data tt", confirmationData);
     let branchInfo = JSON.parse(localStorage.getItem("homeBranchInfo"));
     let ccbranchInfo = JSON.parse(localStorage.getItem("branchDetails"));
     let userInfo = JSON.parse(localStorage.getItem("userInfo"));
     var userEmail = userInfo.email.split("@");
     console.log("userInfo tt", userInfo.email)
     confirmationData.entries.forEach((val) => {
       GAtempdata.push({
         // List of productFieldObjects.
         item_name: val?.product?.name, // Name
         item_id: val?.product?.code, //SKU ID
         price: val?.product?.price?.value,
         item_brand: val?.product?.brand, //brand of product
         'item_category': val?.product?.tlCategories[0]?.name,
         'item_category_2': val?.product?.tlCategories[1]?.name,
         'item_category_3': val?.product?.tlCategories[2]?.name,
         'item_category_4': val?.product?.tlCategories[3]?.name ? val?.product?.tlCategories[3]?.name : '',  // question to be asked.
         'item_variant': '', // If Variant Exists else left blank
         quantity: val.quantity.toString(),
       
         // 'item_totalQuantity': val.quantity.toString(),
         // 'item_stock': val.product.stock.stockLevelStatus,
        // 'added_from': 'PDP’,
        // 'item_list_name': 'PDP'
       });
     });
 
     let productDL = {
       'event': 'begin_checkout',
       'step': 2,
       'step_label': 'Order Checkout - Click',
       'feature_type':'checkout flow',
       'fulfillment': this.isDeliveryBox == false ? 'Click & Collect' : 'Delivery', //Delivery, Pickup, Courier,
       'parent_branch': branchInfo.branchID, 
      'fulfillment_branch': this.isDeliveryBox == false ? ccbranchInfo.branchID: '',
       'userId': userInfo.uid,
       'accountId': localStorage.getItem('selectedIUID'),
       ecommerce: {
         'items': {
           'transaction_id': null, //Transaction ID
           'value': confirmationData.totalPriceWithTax.value, // Revenue after discount
           'tax': confirmationData.totalTax.value,
         //  'shipping': '',
           'currency':'AUD',
           'items' : GAtempdata,
         },
       },
     };
     // For GA4 analytics
     (<any>window).dataLayer = (<any>window).dataLayer || [];
     console.log(productDL, 'productDL');
    // (<any>window).dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
     (<any>window).dataLayer.push(productDL);
     // (<any>window).dataLayer.push({
     //   event: 'Order Fulfillment',
     //   eventCategory: 'Fulfillment',
     //   isConversion: '1',
     //   eventAction: this.mode == 'false' ? 'Click & Collect' : 'Delivery', //Pass the respective Delivery Method
     // });
  }
}

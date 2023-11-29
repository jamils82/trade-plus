import { Subscription } from 'rxjs';
import { FindStoreService } from './../../../core/service/findStore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '@spartacus/storefront';
import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/service/CommonService/common.service';

@Component({
  selector: 'app-in-stock-availability',
  templateUrl: './in-stock-availability.component.html',
  styleUrls: ['./in-stock-availability.component.scss']
})
export class InStockAvailabilityComponent implements OnInit {

  @Input() productCode;
  accordions: any;
  //  = [{
  //   "name":"SilverWater",
  //   "address":"1-3 Slough Avenue",
  //   "distance":"1.3km",
  //   "stockAvailablity": "In stock"
  // },
  // {
  //   "name":"SilverWater",
  //   "address":"1-3 Slough Avenue",
  //   "distance":"1.3km",
  //   "stockAvailablity": "In stock"
  // },
  // {
  //   "name":"SilverWater",
  //   "address":"1-3 Slough Avenue",
  //   "distance":"1.3km",
  //   "stockAvailablity": "In stock"
  // }];
  homeBranchData: any;
  noBranchAvaialble : boolean = false;
  homeBranchSubscription: Subscription;
  geoPointSubscription: Subscription;
  constructor(
    private modalService: NgbModal,
    private findStoreService: FindStoreService,
    private commonService: CommonService
    ) { 
      this.commonService.show()
    }

  ngOnInit(): void {
    this.homeBranchSubscription = this.findStoreService.getHomeBranchData().subscribe(
      result => {
        this.homeBranchData = result;
      })
    this.geoPointSubscription = this.findStoreService.getGeoPoint().subscribe(
      result => {
        const branchData = {
          lat: result.geoPoint.latitude,
          long: result.geoPoint.longitude
        }
        this.getAllStoresAPICall(branchData);
      })
  }

  closePopUp() {
    this.modalService.dismissAll();
  }

  getAllStoresAPICall(branchData) {
    this.findStoreService.getAllStores(branchData, this.productCode).subscribe(data => {
      // console.log("Stores:", JSON.stringify(data.stores))
      data.stores.forEach(element => {
        let phone = '';
        if(element.address?.phone) {
        phone = element.address?.phone;
        phone = phone.replace(/\s/g, "");
        element.address.phone = phone.substring(0, 2) + ' ' + phone.substring(2, 6) + ' ' + phone.substring(6, phone.length);
        }
        // element.address.phone = phone.match(/.{1,7}/g);
        // element.address.phone = element.address.phone.join(" ");

        if (element.buOpeningSchedule) {
          element.buOpeningSchedule.find(v => v.code.includes('Trade')).code = 'Trade';
          element.buOpeningSchedule.find(v => v.code.includes('Showroom')).code = 'Showroom';
          if (element.buOpeningSchedule[0].weekDayOpeningList && element.buOpeningSchedule[0].weekDayOpeningList.length > 1) {
            element.buOpeningSchedule[0].weekDayOpeningList.push(element.buOpeningSchedule[0].weekDayOpeningList.shift());
          }
          if (element.buOpeningSchedule[1].weekDayOpeningList && element.buOpeningSchedule[1].weekDayOpeningList.length > 1) {
            element.buOpeningSchedule[1].weekDayOpeningList.push(element.buOpeningSchedule[1].weekDayOpeningList.shift());
          }
        }
      });
      this.accordions = data.stores.filter(x => x.name != this.homeBranchData?.name);
      // this.accordions = data.stores.filter(x => x.name)
      // console.log("Accor:", JSON.stringify(this.accordions))
      this.commonService.hide();
    });
  }

  storeLocation(value) {
    this.commonService.show();
    this.findStoreService.getGeoLocationforHybris(value).subscribe(
      geoLocation => {
        if(geoLocation.status == 'OK'){
       
        const branchData1 = {
          lat: geoLocation.results[0].geometry.location.lat,
          long: geoLocation.results[0].geometry.location.lng
        }
        
        this.findStoreService.getAllStoresSearch(branchData1, this.productCode).subscribe(data => {
          data.stores.forEach(element => {
            if (element.buOpeningSchedule) {
              element.buOpeningSchedule.find(v => v.code.includes('Trade')).code = 'Trade';
              element.buOpeningSchedule.find(v => v.code.includes('Showroom')).code = 'Showroom';
              if (element.buOpeningSchedule[0].weekDayOpeningList && element.buOpeningSchedule[0].weekDayOpeningList.length > 1) {
                element.buOpeningSchedule[0].weekDayOpeningList.push(element.buOpeningSchedule[0].weekDayOpeningList.shift());
              }
              if (element.buOpeningSchedule[1].weekDayOpeningList && element.buOpeningSchedule[1].weekDayOpeningList.length > 1) {
                element.buOpeningSchedule[1].weekDayOpeningList.push(element.buOpeningSchedule[1].weekDayOpeningList.shift());
              }
            }
          });
          // this.accordions = data.stores;
          this.accordions = data.stores.filter(x => x.name != this.homeBranchData?.name);
          this.noBranchAvaialble = false;
          this.commonService.hide();
        });
        }
        else{
          this.noBranchAvaialble = true;
          this.commonService.hide();
        }
      })
  }


  phoneNumberClicked() {
    (<any>window).dataLayer.push({
      'event':'Phone Click',
      'eventCategory':'Phone',
    //  'eventAction':window.location.href, //Pass the URL of the screen from where user clicked on the Phone
    });
  }  

  ngOnDestroy() {
    if (this.homeBranchSubscription)
      this.homeBranchSubscription.unsubscribe();
    if (this.geoPointSubscription)
      this.geoPointSubscription.unsubscribe();
  }
}

import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader } from '@agm/core';
import { ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FindStoreService } from 'src/app/core/service/findStore.service';
import { DIRECTION_URL } from 'src/app/core/service/endPointURL';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChnageQuotePopupComponent } from '../request-quote-mod/requestquote/chnage-quote-popup/chnage-quote-popup.component';


@Component({
  selector: 'app-find-store',
  templateUrl: './find-store.component.html',
  styleUrls: ['./find-store.component.scss']

})
export class FindStoreComponent implements OnInit,OnDestroy {
  latitude: number;
  longitude: number;
  zoom: number;
  @ViewChild('search') searchElementRef: ElementRef;
  address: string;
  name: string;
  zip_code: string;
  private geoCoder;
  viewMode = 'tab1';
  stores: any;
  tradeStores: any;
  tradeCivilStores: any;
  showRoomStores: any;
  MAPstores: any;
  MAPtradeCivilStores: any;
  MAPshowRoomStores: any;
  geoPointSubscription: Subscription;
  homeBranchSubscription: Subscription;
  homeBranchData: any;
  viewMore: boolean = true;
  viewMoreLabel: string = 'View More';
  public iconUrl = '../../../assets/images/Branch_Trade.svg';
  previousUrl: any;
  currentUrl: string;
  pageState: any;
  modalRef: any;
  myData: any;
  constructor(private modalService: NgbModal, public mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: HttpClient,
    private findStoreService: FindStoreService,
    public commonService: CommonService,
    private router: Router,) { }

  ngOnInit(): void {

    this.homeBranchSubscription = this.findStoreService.getHomeBranchData().subscribe(result => {
        this.homeBranchData = result;
        let phone = '';
        if(this.homeBranchData?.address?.phone) {
        phone = this.homeBranchData?.address?.phone;
        phone = phone.replace(/\s/g, "");
        this.homeBranchData.address.phone = phone.substring(0, 2) + ' ' + phone.substring(2, 6) + ' ' + phone.substring(6, phone.length);
        }
        if(this.homeBranchData.buOpeningSchedule) {
          this.homeBranchData.buOpeningSchedule.find(v => v.code.includes('Trade')).code = 'Trade';
          this.homeBranchData.buOpeningSchedule.find(v => v.code.includes('Showroom')).code = 'Showroom';
          this.homeBranchData.buOpeningSchedule.forEach(element => {
            if(  element.weekDayOpeningList && element.weekDayOpeningList.length > 0 ) {
              element.weekDayOpeningList.push(element.weekDayOpeningList.shift()); 
            }
          });  
        }
        // this.homeBranchData.address.phone = phone.match(/.{1,7}/g);
        this.currentUrl = this.router.url;
        this.previousUrl = null;
        this.router.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
        // console.log("prev: ", this.previousUrl)
        // console.log("curr: ", this.currentUrl)
          })
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

  allTabClicked(gm) {
    this.viewMode = 'tab1';
    gm.lastOpen = null;
  }
  tradeTabClicked(gm) {
    this.viewMode = 'tab2';
    gm.lastOpen = null;
  }
  tradeAndCivilTabClicked(gm) {
    this.viewMode = 'tab3';
    gm.lastOpen = null;
  }
  showroomTabClicked(gm) {
    this.viewMode = 'tab4';
    gm.lastOpen = null;
  }
  onMouseOver(infoWindow, gm) {
    // infoWindow.open();
    if (gm.lastOpen != null) {
      gm.lastOpen.close();
  }

  gm.lastOpen = infoWindow;

  infoWindow.open();
}

phoneNumberClicked() {
  (<any>window).dataLayer.push({
    'event':'Phone Click',
    'eventCategory':'Phone',
  //  'eventAction':window.location.href, //Pass the URL of the screen from where user clicked on the Phone
  });
}

close_window(gm){
    gm.lastOpen.close()
  }
onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
}
  getAllStoresAPICall(branchData) {
    this.findStoreService.getAllStores(branchData).subscribe(data => {
      data.stores.forEach(element => {
        let phone = '';
        if(element?.address?.phone) {
        phone = element?.address?.phone;
        phone = phone.replace(/\s/g, "");
        element.address.phone = phone.substring(0, 2) + ' ' + phone.substring(2, 6) + ' ' + phone.substring(6, phone.length);
        }
        // element.address.phone = phone.match(/.{1,7}/g);
        // element.address.phone = element.address.phone.join(" ");
  
        if(element.buOpeningSchedule) {
          element.buOpeningSchedule.find(v => v.code.includes('Trade')).code = 'Trade';
          element.buOpeningSchedule.find(v => v.code.includes('Showroom')).code = 'Showroom';  
          element.buOpeningSchedule.forEach(element => {
            if(  element.weekDayOpeningList && element.weekDayOpeningList.length > 0 ) {
              element.weekDayOpeningList.push(element.weekDayOpeningList.shift()); 
            }
          });
        }
        if(element.isShowroomBranch && !element.isTradeAndCivilBranch ) {
          element.iconUrl = '../../../assets/images/Branch_Trade_Showroom.svg';
        }  
        if(element.isTradeAndCivilBranch && !element.isShowroomBranch) {
          element.iconUrl = '../../../assets/images/Branch_Trade_Civil.svg';
        }
        if(!element.isTradeAndCivilBranch && !element.isShowroomBranch) {
          element.iconUrl =  '../../../assets/images/Branch_Trade.svg'
        }   
        if(element.isTradeAndCivilBranch && element.isShowroomBranch) {
          element.iconUrl =  '../../../assets/images/Branch_Trade_Civil_Showroom.svg'
        }
        if((element.isShowroomBranch && !element.isTradeAndCivilBranch) && element.name == this.homeBranchData?.name) {
          element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
        }  
        if((element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
          element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
        }
        if((!element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
          element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
        }   
        if((element.isTradeAndCivilBranch && element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
          element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
        }       
      });
      this.stores = data.stores.filter(x=> x.name != this.homeBranchData?.name);
      this.tradeCivilStores =  data.stores.filter(x => x.isTradeAndCivilBranch == true && x.name != this.homeBranchData?.name);
      this.showRoomStores = data.stores.filter(x => x.isShowroomBranch == true && x.name != this.homeBranchData?.name);

      this.MAPstores = data.stores;
      this.MAPtradeCivilStores =  data.stores.filter(x => x.isTradeAndCivilBranch == true || x.name == this.homeBranchData?.name);
      this.MAPshowRoomStores = data.stores.filter(x => x.isShowroomBranch == true || x.name == this.homeBranchData?.name);

      let homeBranchExists = true;
          this.MAPstores = data.stores;
          this.MAPstores.forEach(element => {
            if(element.name == this.homeBranchData.name) {
              homeBranchExists = false;
            }
          });
          if(homeBranchExists) {
            this.MAPstores.push(this.homeBranchData)
            this.MAPstores.forEach(element => {
              if(element.isShowroomBranch && !element.isTradeAndCivilBranch ) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Showroom.svg';
              }  
              if(element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Civil.svg';
              }
              if(!element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade.svg'
              }   
              if(element.isTradeAndCivilBranch && element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade_Civil_Showroom.svg'
              }
              if((element.isShowroomBranch && !element.isTradeAndCivilBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }  
              if((element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }
              if((!element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              }   
              if((element.isTradeAndCivilBranch && element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              } 
            })
          }
          this.MAPtradeCivilStores =  data.stores.filter(x => x.isTradeAndCivilBranch == true || x.name == this.homeBranchData?.name);
          this.MAPtradeCivilStores.forEach(element => {
            if(element.name == this.homeBranchData.name) {
              homeBranchExists = false;
            }
          });
          if(homeBranchExists) {
            this.MAPtradeCivilStores.push(this.homeBranchData)
            this.MAPtradeCivilStores.forEach(element => {
              if(element.isShowroomBranch && !element.isTradeAndCivilBranch ) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Showroom.svg';
              }  
              if(element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Civil.svg';
              }
              if(!element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade.svg'
              }   
              if(element.isTradeAndCivilBranch && element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade_Civil_Showroom.svg'
              }
              if((element.isShowroomBranch && !element.isTradeAndCivilBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }  
              if((element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }
              if((!element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              }   
              if((element.isTradeAndCivilBranch && element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              } 
            })
          }
          this.MAPshowRoomStores = data.stores.filter(x => x.isShowroomBranch == true || x.name == this.homeBranchData?.name);
          this.MAPshowRoomStores.forEach(element => {
            if(element.name == this.homeBranchData.name) {
              homeBranchExists = false;
            }
          });
          if(homeBranchExists) {
            this.MAPshowRoomStores.push(this.homeBranchData)
            this.MAPshowRoomStores.forEach(element => {
              if(element.isShowroomBranch && !element.isTradeAndCivilBranch ) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Showroom.svg';
              }  
              if(element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Civil.svg';
              }
              if(!element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade.svg'
              }   
              if(element.isTradeAndCivilBranch && element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade_Civil_Showroom.svg'
              }
              if((element.isShowroomBranch && !element.isTradeAndCivilBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }  
              if((element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }
              if((!element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              }   
              if((element.isTradeAndCivilBranch && element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              } 
            })
          }
          this.commonService.hide()
    });


    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation(branchData);
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 5;
        });
      });
    });
  }

  storeLocation(value, gm) {
    gm.lastOpen = null;
    if(value == null || value == undefined || value == "") {
      value = this.homeBranchData.name
    }
    this.findStoreService.getGeoLocationforHybris(value).subscribe(
      geoLocation => {
        const branchData1 = {
          lat: geoLocation.results[0].geometry.location.lat,
          long: geoLocation.results[0].geometry.location.lng
        }
        this.setCurrentLocation(branchData1);
        this.findStoreService.getAllStores(branchData1).subscribe(data => {
          data.stores.forEach(element => {
            let phone = '';
            if(element?.address?.phone) {
            phone = element?.address?.phone;
            // let phone = element.address?.phone;
            phone = phone.replace(/\s/g, "");
            element.address.phone = phone.substring(0, 2) + ' ' + phone.substring(2, 6) + ' ' + phone.substring(6, phone.length);
            }
            // element.address.phone = phone.match(/.{1,7}/g);
            // element.address.phone = element.address.phone.join(" ");
    
            if(element.buOpeningSchedule) {
              element.buOpeningSchedule.find(v => v.code.includes('Trade')).code = 'Trade';
              element.buOpeningSchedule.find(v => v.code.includes('Showroom')).code = 'Showroom';   
              element.buOpeningSchedule.forEach(element => {
                if(  element.weekDayOpeningList && element.weekDayOpeningList.length > 0 ) {
                  element.weekDayOpeningList.push(element.weekDayOpeningList.shift()); 
                }
              });         
            }
            if(element.isShowroomBranch && !element.isTradeAndCivilBranch ) {
              element.iconUrl = '../../../assets/images/Branch_Trade_Showroom.svg';
            }  
            if(element.isTradeAndCivilBranch && !element.isShowroomBranch) {
              element.iconUrl = '../../../assets/images/Branch_Trade_Civil.svg';
            }
            if(!element.isTradeAndCivilBranch && !element.isShowroomBranch) {
              element.iconUrl =  '../../../assets/images/Branch_Trade.svg'
            }   
            if(element.isTradeAndCivilBranch && element.isShowroomBranch) {
              element.iconUrl =  '../../../assets/images/Branch_Trade_Civil_Showroom.svg'
            }
            if((element.isShowroomBranch && !element.isTradeAndCivilBranch) && element.name == this.homeBranchData?.name) {
              element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
            }  
            if((element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
              element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
            }
            if((!element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
              element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
            }   
            if((element.isTradeAndCivilBranch && element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
              element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
            }       
          });
          this.stores = data.stores.filter(x=> x.name != this.homeBranchData?.name);
          this.tradeCivilStores = data.stores.filter(x => x.isTradeAndCivilBranch == true && x.name != this.homeBranchData?.name);
          this.showRoomStores = data.stores.filter(x => x.isShowroomBranch == true && x.name != this.homeBranchData?.name);

          let homeBranchExists = true;
          this.MAPstores = data.stores;
          this.MAPstores.forEach(element => {
            if(element.name == this.homeBranchData.name) {
              homeBranchExists = false;
            }
          });
          if(homeBranchExists) {
            this.MAPstores.push(this.homeBranchData)
            this.MAPstores.forEach(element => {
              if(element.isShowroomBranch && !element.isTradeAndCivilBranch ) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Showroom.svg';
              }  
              if(element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Civil.svg';
              }
              if(!element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade.svg'
              }   
              if(element.isTradeAndCivilBranch && element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade_Civil_Showroom.svg'
              }
              if((element.isShowroomBranch && !element.isTradeAndCivilBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }  
              if((element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }
              if((!element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              }   
              if((element.isTradeAndCivilBranch && element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              } 
            })
          }
          this.MAPtradeCivilStores =  data.stores.filter(x => x.isTradeAndCivilBranch == true || x.name == this.homeBranchData?.name);
          this.MAPtradeCivilStores.forEach(element => {
            if(element.name == this.homeBranchData.name) {
              homeBranchExists = false;
            }
          });
          if(homeBranchExists) {
            this.MAPtradeCivilStores.push(this.homeBranchData)
            this.MAPtradeCivilStores.forEach(element => {
              if(element.isShowroomBranch && !element.isTradeAndCivilBranch ) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Showroom.svg';
              }  
              if(element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Civil.svg';
              }
              if(!element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade.svg'
              }   
              if(element.isTradeAndCivilBranch && element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade_Civil_Showroom.svg'
              }
              if((element.isShowroomBranch && !element.isTradeAndCivilBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }  
              if((element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }
              if((!element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              }   
              if((element.isTradeAndCivilBranch && element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              } 
            })
          }
          this.MAPshowRoomStores = data.stores.filter(x => x.isShowroomBranch == true || x.name == this.homeBranchData?.name);
          this.MAPshowRoomStores.forEach(element => {
            if(element.name == this.homeBranchData.name) {
              homeBranchExists = false;
            }
          });
          if(homeBranchExists) {
            this.MAPshowRoomStores.push(this.homeBranchData)
            this.MAPshowRoomStores.forEach(element => {
              if(element.isShowroomBranch && !element.isTradeAndCivilBranch ) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Showroom.svg';
              }  
              if(element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl = '../../../assets/images/Branch_Trade_Civil.svg';
              }
              if(!element.isTradeAndCivilBranch && !element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade.svg'
              }   
              if(element.isTradeAndCivilBranch && element.isShowroomBranch) {
                element.iconUrl =  '../../../assets/images/Branch_Trade_Civil_Showroom.svg'
              }
              if((element.isShowroomBranch && !element.isTradeAndCivilBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }  
              if((element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl = '../../../assets/images/HomeBranch_icon.svg';
              }
              if((!element.isTradeAndCivilBranch && !element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              }   
              if((element.isTradeAndCivilBranch && element.isShowroomBranch) && element.name == this.homeBranchData?.name) {
                element.iconUrl =  '../../../assets/images/HomeBranch_icon.svg'
              } 
            })
          }
          // this.stores = data.stores;
        });
      })
  }

  viewMoreClicked(i) {
    this.viewMore = !this.viewMore
    let more = document.getElementById("viewMore." + i);
    let less = document.getElementById("viewLess." + i);
      less.innerHTML = 'View Less';
      less.style.display = 'block';
      more.style.display = 'none';
  }

  viewLessClicked(i) {
    this.viewMore = !this.viewMore
    let more = document.getElementById("viewMore." + i);
    let less = document.getElementById("viewLess." + i);
      more.innerHTML = 'View More';
      more.style.display = 'block';
      less.style.display = 'none';
  }

  homeBranchViewMoreClicked() {
    this.viewMore = !this.viewMore
    let more = document.getElementById("homeBranchViewMore");
    let less = document.getElementById("homeBranchViewLess");
      less.innerHTML = 'View Less';
      less.style.display = 'block';
      more.style.display = 'none';
  }

  homeBranchViewLessClicked() {
    this.viewMore = !this.viewMore
    let more = document.getElementById("homeBranchViewMore");
    let less = document.getElementById("homeBranchViewLess");
      more.innerHTML = 'View More';
      more.style.display = 'block';
      less.style.display = 'none';
  }
  openMap(lat, long) {
    window.open(DIRECTION_URL.url + lat + ',' + long, '_blank');
  }

  onBranchChange(data) {
    this.myData = data;
    this.pageState = this.commonService.getPage();
    if(this.currentUrl == '/tpRequestQuotePage' && this.pageState == true){
      this.openModalQuote();
    }
    else{
      this.findStoreService.changeBranch(data.name).subscribe(
        (result) => {
          localStorage.setItem('branchDetails', JSON.stringify(data));
          window.location.reload();
        },
        (error) => {
          window.location.reload();
        })
    }
  }

  openModalQuote(){
  
    this.modalRef = this.modalService.open(ChnageQuotePopupComponent, {
      windowClass: 'ChnageQuotePopup',
      centered: true,
      size: 'lg',
    });
    this.modalRef.componentInstance.selectedChoice = true;
    this.modalRef.result.then((result) => {
      // console.log("Result Quote:", result)
      if(result){
        this.findStoreService.changeBranch(this.myData.name).subscribe(
          (result) => {
            localStorage.setItem('branchDetails', JSON.stringify(this.myData));
            window.location.reload();
          },
          (error) => {
            window.location.reload();
          })
      }
    })
  }

  private setCurrentLocation(branchData) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = branchData.lat;
        this.longitude = branchData.long;
        this.zoom = 10;
      });
    }
  }
  closePopUp() {
    this.modalService.dismissAll()
  }

  ngOnDestroy() {
    if(this.homeBranchData.buOpeningSchedule) {
      this.homeBranchData.buOpeningSchedule.forEach(element => {
        if(  element.weekDayOpeningList && element.weekDayOpeningList.length > 0 ) {
          element.weekDayOpeningList.unshift(element.weekDayOpeningList.pop()); 
        }
      });
    }
    if(this.geoPointSubscription)
      this.geoPointSubscription.unsubscribe();
    if(this.homeBranchSubscription)
      this.homeBranchSubscription.unsubscribe();
  }

}

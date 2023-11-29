import { Component, OnInit } from '@angular/core';
import { OutletPosition } from '@spartacus/storefront';
import { DataService } from '../../../core/service/customerQuotes/data.service';
import { UserDataService } from '../../../core/service/customerQuotes/userdata.service';
import { AccountDataService } from '../../../core/service/customerQuotes/accountdata.service';
import { headerLabels } from 'src/app/core/constants/general';
import { CmsService, MultiCartService, RoutingService } from '@spartacus/core';
import { QuotesService } from 'src/app/core/service/customerQuotes/quotes.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomChangeAccountPopupComponent } from '../custom-change-account-popup/custom-change-account-popup.component';

@Component({
  selector: 'app-custom-job-dropdown',
  templateUrl: './custom-job-dropdown.component.html',
  styleUrls: ['./custom-job-dropdown.component.scss'],
})
export class CustomJobDropdownComponent implements OnInit {
  outletPosition = OutletPosition;
  headerLabels = headerLabels;
  showDropdown = false;
  quoteDetails: any;
  modalRef: any;

  constructor(
    private userDataService: UserDataService,
    public dataService: DataService,
    private cmsService: CmsService,
    public accountDataService: AccountDataService,
    private multiCartService: MultiCartService,
    private QuotesService: QuotesService,
    private routingService: RoutingService,
    private location: Location,
    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {

  }

  checkCurrentCart(id: any, e: Event,type) {
    e.stopPropagation();
    this.userDataService.getUserCurrentCart().subscribe((res) => {
      if (res.carts.length > 0 && (res.carts[0].totalItems > 0 && res.carts[0].totalItems != undefined)) {
        this.openChangeAccModal(id, e, type);
      } else {
        if (type == 'clear') {
          this.clearJobOption(e);
        } else {
          this.changeJobAcc(id,e);
        }
      }
    });
  }

  openChangeAccModal(id: any, e: Event, type) {
    let Id = id;
    let ev = e;
    this.modalRef = this.modalService.open(CustomChangeAccountPopupComponent,{ centered: true,keyboard : false,
    backdrop: 'static',windowClass: 'changeAccountPopup',size: 'lg' }).closed.subscribe(res => {
      if (type == 'clear') {
        this.clearJobOption(ev);
      } else {
        this.changeJobAcc(Id,ev);
      }
    });
  }

  changeJobAcc(id: any, e: Event) {
    this.accountDataService.setSelectedJobAcc(id).subscribe((data) => {
      //window.location.reload();
      this.dataService.selectedJobAcc[0] = id;
      localStorage.setItem('selectedJobAccount',id.jobId);
      this.toggleJobDropdown(e);
      if (this.location.path() == '/placemakers/en/NZD/quotes') {
        this.cmsService.refreshLatestPage();
      } else {
        this.routingService.go('/quotes');
      }
      let cartId = JSON.parse(localStorage.getItem('spartacus⚿placemakers⚿cart') || '').active;
        if (cartId != '') {
          this.multiCartService.reloadCart(cartId);
        }
        this.showDropdown = false;
        // getLatestQuoteList on quoteDashboard 
        this.QuotesService.getLatestQuotes.next(true);
    });
  }

  toggleJobDropdown(e: Event) {
    //e.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  onDropClick(e: Event) {
    e.stopPropagation();
    this.showDropdown = false;
  }

  clearJobOption(e: Event) {
    this.showDropdown = false;
    this.accountDataService.setSelectedTradeAcc(this.dataService.selectedTradeAcc).subscribe((data) => {
      //window.location.reload();
      this.dataService.selectedJobAcc = [];
      localStorage.setItem('selectedJobAccount','');
      this.dataService.userTradeData.lastSelectedJobAccount = '';
      if (this.location.path() == '/placemakers/en/NZD/quotes') {
        this.cmsService.refreshLatestPage();
      } else {
        this.routingService.go('/quotes');
      }
      let cartId = JSON.parse(localStorage.getItem('spartacus⚿placemakers⚿cart') || '').active;
        if (cartId != '') {
          this.multiCartService.reloadCart(cartId);
        }
        this.showDropdown = false;
        // getLatestQuoteList on quoteDashboard 
        this.QuotesService.getLatestQuotes.next(true); 
    });
  }

}

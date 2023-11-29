import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CmsService } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { inputStateService } from 'src/app/shared/services/inputState.service';
import { ChnageQuotePopupComponent } from '../request-quote-mod/requestquote/chnage-quote-popup/chnage-quote-popup.component';

@Component({
  selector: 'app-custom-footer',
  templateUrl: './custom-footer.component.html',
  styleUrls: ['./custom-footer.component.scss']
})
export class CustomFooterComponent implements OnInit {
  siteLogoData: any;
  footerBannerData: any;
  contactInfo: any;
  isLoading$ = new BehaviorSubject<boolean>(false);
  navigateUrl: any;
  quoteFlag: boolean;
  pageState: any;
  previousUrl: string;
  currentUrl: string;
  modalRef: any;

  constructor(private cmsService: CmsService,
    public commonService: CommonService,
    public route: Router,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.isLoading$.next(true);
    this.currentUrl = this.route.url;
    this.previousUrl = null;
    this.route.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
        })  
      }

      routeURL(url) {
        this.navigateUrl = url;
        this.quoteFlag = false;
        this.commonService.setFlag(this.quoteFlag)
        this.pageState = this.commonService.getPage();
        sessionStorage.removeItem("dateFilter");
        if(this.currentUrl == '/tpRequestQuotePage' && this.pageState == true){
          this.openModalQuote();
        }
          else {
            if (this.route.url == url) {
              this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.route.navigate([url]));
                // window.open(url, "_self");
            } else {
              this.route.navigateByUrl(url);
              // window.open(url, "_self");
            }
          }
    
      }
    
      openModalQuote(){
        // alert("1st popup")
        this.modalRef = this.modalService.open(ChnageQuotePopupComponent, {
          windowClass: 'ChnageQuotePopup',
          centered: true,
          size: 'lg',
        });
        this.modalRef.componentInstance.selectedChoice = true;
        this.modalRef.result.then((result) => {
          if(result){
            this.route.navigateByUrl(this.navigateUrl);
          }
        })
      }
}

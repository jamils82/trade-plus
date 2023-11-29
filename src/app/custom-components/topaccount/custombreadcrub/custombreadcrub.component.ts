
import { CmsComponentData, PageTitleComponent } from '@spartacus/storefront';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  CmsBreadcrumbsComponent,
  CmsService,
  PageMetaService,
  TranslationService,
} from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChnageQuotePopupComponent } from '../../request-quote-mod/requestquote/chnage-quote-popup/chnage-quote-popup.component';


@Component({
  selector: 'app-custombreadcrub',
  templateUrl: './custombreadcrub.component.html',
  styleUrls: ['./custombreadcrub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})




export class CustombreadcrubComponent extends PageTitleComponent implements OnInit {
  crumbs$: Observable<any[]>;
  pageState: any;
  previousUrl: string;
  currentUrl: string;
  navigateUrl: any;
  modalRef: any;
  formData: any;

  constructor(
    public component: CmsComponentData<CmsBreadcrumbsComponent>,
    protected pageMetaService: PageMetaService,
    public commonService: CommonService,
    private translation: TranslationService,
    private modalService: NgbModal,
    public route: Router,
    private cms: CmsService,
    private common : CommonService
    ) {
    super(component, pageMetaService);
    }

  ngOnInit(): void {
    super.ngOnInit();
    this.setCrumbs();
    this.currentUrl = this.route.url;
    this.previousUrl = null;
    this.route.events.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) =>{
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.urlAfterRedirects;
      // console.log("prev: ", this.previousUrl)
      // console.log("curr: ", this.currentUrl)
        })
        this.formData = this.common.getFormData();
       
  }
  private setCrumbs(): void {

    this.crumbs$ = combineLatest([
      this.cms.getCurrentPage(),
      this.pageMetaService.getMeta(),
      this.translation.translate('common.home'),
    ]).pipe(
      map(([pageData, meta, textHome]) =>
      {
    const urlParams:any = window.location.href.split("/")
      let urlValue: any = urlParams[urlParams.length -1].split("?")
      if(window.location.href.includes('/search')){
        meta.title = urlValue[0]
        let imageLoad = document.getElementsByTagName("cx-media")[0];
        imageLoad.addEventListener('click', function() {
          window.location.href = '/';
        });
      }
      else if(window.location.href.includes('/c/')){
        meta.title = "Products"
        let imageLoad = document.getElementsByTagName("cx-media")[0];
        imageLoad.addEventListener('click', function() {
          window.location.href = '/';
        });
      }
      else if(window.location.href.includes('/quotesPage')) {
        meta.title = "My Quotes"
      }
      else if(window.location.href.includes('/tpRequestQuotePage')) {
        meta.title = "Quote Request"
      }
      else if(window.location.href.includes('/my-orders-deliveries')) {
        meta.title = "Orders & Deliveries"
      }

      else if(window.location.href.includes('/quoteDetails')) {
        meta.breadcrumbs = [
          { label: textHome, link: '/' },
          { label: 'Customer Quotes', link: '/customerQuotes' }]
        if(sessionStorage.getItem('jobName') !== '' && sessionStorage.getItem('jobName') !== undefined &&
           sessionStorage.getItem('jobName') !== null) {
          meta.title = sessionStorage.getItem('jobName');
        }
        else {
          meta.title = 'Quotes Details';
        }

      }
      else if(window.location.href.includes('/create-new-quotes-popup')) {
        meta.breadcrumbs = [
          { label: textHome, link: '/' },
          { label: 'Customer Quotes', link: '/customerQuotes' }]
          meta.title = 'New Customer Quote';

      }
      else if(window.location.href.includes('/quoteMaterials')) {
        // if(sessionStorage.getItem('jobName') !== '' && sessionStorage.getItem('jobName') !== undefined &&
        //    sessionStorage.getItem('jobName') !== null) {
        //   meta.title = sessionStorage.getItem('jobName');
        // }
        // else {
        //   meta.title = 'Materials';
        // }
        meta.breadcrumbs = [
          { label: textHome, link: '/' },
          { label: 'Customer Quotes', link: '/customerQuotes' },
          { label: sessionStorage?.getItem('jobName'), link: '/quoteDetails/'+ sessionStorage?.getItem('jobCode') }]
          meta.title = 'Materials';

      }
      else if(window.location.href.includes('/quoteCosts')) {
        meta.breadcrumbs = [
          { label: textHome, link: '/' },
          { label: 'Customer Quotes', link: '/customerQuotes' },
          { label: sessionStorage?.getItem('jobName'), link: '/quoteDetails/'+ sessionStorage?.getItem('jobCode') }]
          meta.title = 'Labour / Other Costs';
      }
      else if(window.location.href.includes('/quoteReview')) {
        meta.breadcrumbs = [
          { label: textHome, link: '/' },
          { label: 'Customer Quotes', link: '/customerQuotes' },
          { label: sessionStorage?.getItem('jobName'), link: '/quoteDetails/'+ sessionStorage?.getItem('jobCode') }]
          meta.title = 'Review';
      }
      else if(window.location.href.includes('/quoteView')) {
        meta.breadcrumbs = [
          { label: textHome, link: '/' },
          { label: 'Customer Quotes', link: '/customerQuotes' },
          { label: sessionStorage?.getItem('jobName'), link: '/quoteDetails/'+ sessionStorage?.getItem('jobCode') },
          { label: 'Reviews', link: '/quoteReview/'+ sessionStorage?.getItem('jobCode') }
        ]
          meta.title = 'View';
      }
      else if(window.location.href.includes('/downloadFilesPage/create')) {
        meta.breadcrumbs = [
          { label: textHome, link: '/' },
          { label: 'Download Formats', link: '/downloadFilesPage' }]
          meta.title = 'Create Downloadformats';
      }
      else if(window.location.href.includes('/downloadFilesPage/edit')) {
        meta.breadcrumbs = [
          { label: textHome, link: '/' },
          { label: 'Download Formats', link: '/downloadFilesPage' }]
          meta.title = 'Edit Downloadformats';
      }
       return  meta?.breadcrumbs ? meta.breadcrumbs : [{ label: textHome, link: '/' }]
      }
      )
    );
  }

  goToHome(url){
    // console.log(url)
    // alert(sessionStorage.getItem('submitQuote'))
    // console.log("EVENTTTT::", localStorage.getItem("breadEvent"))
    this.navigateUrl = url;
    this.pageState = this.commonService.getPage();
    if(this.currentUrl == '/tpRequestQuotePage' && this.pageState == true){
      this.openModalQuote();
      // alert(this.currentUrl)
    }
    else{
    //  alert(url)
      if( (this.navigateUrl.includes('quoteDetails') && localStorage.getItem("breadEvent") == 'create')  || (this.navigateUrl.includes('quoteCosts') && localStorage.getItem("breadEvent") == 'create')){
        this.route.navigate(['/create-new-quotes-popup'])
        // console.log("IFF")
      }
      else if ( (this.navigateUrl.includes('quoteCosts') && localStorage.getItem("breadEvent") == 'edit')){
        this.route.navigate([url])
        // console.log("else IFF")
        // console.log("navigate URL:", this.navigateUrl)
      }
      else if (this.navigateUrl.includes('quoteDetails') && localStorage.getItem("breadEvent") == 'edit'){
        this.route.navigate([url])
      }
      else{
        this.route.navigate([url])
        // console.log("Else")
      }
      
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
        this.route.navigate([this.navigateUrl]);
      }
    })
  }
}
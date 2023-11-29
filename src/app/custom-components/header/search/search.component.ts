import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CmsSearchBoxComponent, RoutingService, WindowRef } from '@spartacus/core';
import { CmsComponentData, SearchBoxComponent, SearchBoxComponentService } from '@spartacus/storefront';
import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { PermissionService } from 'src/app/core/service/permissions.services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends SearchBoxComponent {

  permissionAllowed: boolean;
  constructor(searchBoxComponentService: SearchBoxComponentService,
    componentData: CmsComponentData<CmsSearchBoxComponent>, winRef: WindowRef,
    routingService: RoutingService, private router: Router,
    private commonService: CommonService,
    private permissionUtil: PermissionService) {
    super(searchBoxComponentService, componentData, winRef, routingService)
  }
  
  config = {
    displaySuggestions: true,
    displayProducts: true,
    displayProductImages: true,
    maxProducts: 120,
    maxSuggestions: 10,
    minCharactersBeforeRequest: 2
  };
  
  ngOnInit() {
    this.routingService?.getRouterState();
   // this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbProductsGroup");
  }
  
  routeProduct() {
    if (window.location.pathname.includes('search')) {
      this.router.navigate(['/my-products/all'])
    }
  }

  searchCheck() {
    this.permissionAllowed = this.permissionUtil.isPermissionAllowed("fbProductsGroup");
  }

  searchGTMEventPixel(query: string): void { 
    this.commonService.onGlobalSearchClickEventGTM('', query)
    sessionStorage.setItem('searchTermVal', query)
  }
  resultGTMClick(q, aq) {
    this.commonService.onGlobalSearchClickEventGTM('SuggestedSearch', q, aq)
  }
  
}


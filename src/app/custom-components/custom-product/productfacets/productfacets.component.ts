import { CommonService } from 'src/app/core/service/CommonService/common.service';
import { Component, HostBinding, Input, Output, QueryList, EventEmitter, Renderer2, ViewChildren, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointService, FacetCollapseState, FacetService, FocusDirective, ProductFacetNavigationComponent } from '@spartacus/storefront';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from 'src/app/core/utils/utils';
import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Facet, FacetValue } from '@spartacus/core';

@Component({
  selector: 'app-productfacets',
  templateUrl: './productfacets.component.html',
  styleUrls: ['./productfacets.component.scss']
})
export class ProductfacetsComponent extends ProductFacetNavigationComponent {
 

  constructor (   breakpointService: BreakpointService,
    private router: Router,
    public commonService: CommonService)  {
    super(breakpointService);
    this.commonService.show();
   }

   resetFacets(){

    this.router.navigate(
      [], 
      );
   }
  

}
import { Router } from '@angular/router';
import { CommonUtils } from './../../../../core/utils/utils';
import { Component, ElementRef, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { FacetListComponent, FacetService, ProductListComponentService } from '@spartacus/storefront';
import { BehaviorSubject, Subscription, SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-custom-facet-list',
  templateUrl: './custom-facet-list.component.html',
  styleUrls: ['./custom-facet-list.component.scss']
})


export class CustomFacetListComponent extends FacetListComponent implements OnDestroy{

    facetListNew$ = new BehaviorSubject<any>([])
    facetSubscribe: Subscription;
    isMobile: boolean = false;
  constructor(facetService: FacetService,
    elementRef: ElementRef,
     renderer: Renderer2,
     private ProductListComponentService:ProductListComponentService,
     private router: Router){ 

    super(facetService,elementRef,renderer)
  }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
    this.facetSubscribe = this.ProductListComponentService.model$.subscribe((data)=>{
      let temp = {...data};
      temp.facets = [...data.facets].sort((a, b) => (a.priority > b.priority ? -1 : 1))
      this.facetListNew$.next(temp);
    })
  }
  clear(){
    this.router.navigate(
      [], 
      );
      setTimeout(() => {
        window.location.reload();
      });
   }
  ngOnDestroy() {
    if(this.facetSubscribe)
    this.facetSubscribe.unsubscribe();
  }
}

import { Injectable } from '@angular/core';
import { Facet } from '@spartacus/core';
import { FacetCollapseState, FacetGroupCollapsedState, FacetService } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomfacetserviceService extends FacetService {
  protected facetState = new Map<string, BehaviorSubject<FacetCollapseState>>();
  protected initialize(facet: Facet): void {
    const topFacets =
      facet.topValueCount > 0 ? facet.topValueCount : facet.values?.length || 0;
    if (!this.hasState(facet)) {
      this.facetState.set(
        facet.name,
        new BehaviorSubject({
          topVisible: topFacets,
          maxVisible: topFacets,
         toggled:
         this.facetState.size < 1
              ? FacetGroupCollapsedState.EXPANDED
              : FacetGroupCollapsedState.COLLAPSED,
        } as FacetCollapseState)
      );
    }
  }
}

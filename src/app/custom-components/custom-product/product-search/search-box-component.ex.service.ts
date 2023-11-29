import { Injectable } from '@angular/core';
import {
  EventService,
  ProductSearchPage,
  RoutingService,
  SearchboxService,
  TranslationService,
  WindowRef,
} from '@spartacus/core';
import { SearchBoxComponentService, SearchBoxConfig, SearchResults } from '@spartacus/storefront';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';


const HAS_SEARCH_RESULT_CLASS1 = 'has-searchbox-results111';

@Injectable({
  providedIn: 'root',
})
export class SearchBoxComponentExtService extends  SearchBoxComponentService {
  constructor(
    public searchService: SearchboxService,
    protected routingService: RoutingService,
    protected translationService: TranslationService,
    protected winRef: WindowRef,
    protected eventService: EventService
  ) {
    super(searchService,routingService,translationService,winRef,eventService)
  }

  
  getProductResults(config: SearchBoxConfig): Observable<SearchResults> {
    return combineLatest([
      this.getProductResults(config),
      this.getProductSuggestions(config),
      this.getSearchMessage(config),
    ]).pipe(
      map(([productResults, suggestions, message]) => {
        return {
          products: productResults ? productResults.products : null,
          suggestions,
          message,
        };
      }),
      tap((results) =>
        this.toggleBodyClass(HAS_SEARCH_RESULT_CLASS1, this.hasResults(results))
      )
    );
  }

  
}

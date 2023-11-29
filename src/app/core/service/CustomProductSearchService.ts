import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProductActions, ProductSearchService, SearchConfig, StateWithProduct } from "@spartacus/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ADD_ALL_TO_CART_API, CLEAR_ALL_CART_API, POST_PRODUCT_INQUIRY } from "./endPointURL";

@Injectable()
export class CustomProductSearchService extends ProductSearchService {
    constructor(
      store: Store<StateWithProduct>,
      private route: ActivatedRoute,) {
      super(store);
    }

    search(query: string, searchConfig?: SearchConfig): void {
      console.dir(query);
      sessionStorage.setItem('searchTermVal', query);
      const customSearchConfig: any = searchConfig
      // const perfCurrentPageSize:any = localStorage.getItem('PLPPreference')?localStorage.getItem('PLPPreference'):searchConfig.pageSize;
      customSearchConfig.pageSize = sessionStorage.getItem('PLPCurrentPageSize')?sessionStorage.getItem('PLPCurrentPageSize'):12;//this.route.snapshot.queryParams.pageSize|| parseInt(perfCurrentPageSize);
      console.dir(customSearchConfig);
      this.store.dispatch(
        new ProductActions.SearchProducts({
          queryText: query,
          searchConfig: customSearchConfig,
        })
      );
    }



}//

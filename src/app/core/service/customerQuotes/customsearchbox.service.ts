import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { GET_SEARCH_RESULT_SUGGESTIONS, GET_SEARCH_PRODUCT_RESULTS } from '../endPointURL';

@Injectable({
  providedIn: 'root'
})
export class CustomSearchBoxService {

  searchResults: any;
  
  constructor(
    private http: HttpClient,
  ) { }

  getSearchSuggestion(term: any): Observable<any> {
    let apiUrl = GET_SEARCH_RESULT_SUGGESTIONS.url;
    return this.http.get<any>(apiUrl+term);
  }

  getSearchProducts(term: any,page: any): Observable<any> {
    let apiUrl = GET_SEARCH_PRODUCT_RESULTS.url;
    return this.http.get<any>(apiUrl+'?fields=products(unit,code,name,summary,manufacturer,productSupplierCode,showEmptyPrice,configurable,configuratorType,m2Price(FULL),price(FULL),images(DEFAULT),stock(FULL),averageRating,variantOptions),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch,currentQuery,categories&query='+term+'&currentPage='+page+'&pageSize=5');
  }
}

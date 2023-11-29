import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GET_AVAILABLE_USERS } from '../../core/service/endPointURL';
@Injectable()
export class MyTeamService {

  permissionsQueryString = [];
  isApplyPermissionsQuery: boolean = false;

  teamsSearchQuery = '';
  isApplySearchQuery: boolean = true;

  constructor(private http: HttpClient) {

  }

  getUserData(currentPage, pageSize, sort, permissions): Observable<any> {
    let params = new HttpParams();
    let apiUrl = GET_AVAILABLE_USERS.url;

    params = params.set("currentPage", currentPage);
    params = params.set("fields", "DEFAULT");
    params = params.set("sort", sort);
    params = params.set("pageSize", pageSize);

    if(this.isApplyPermissionsQuery){
      if(this.permissionsQueryString){

        let query = ''
        for (var key in this.permissionsQueryString) {
          if (this.permissionsQueryString.hasOwnProperty(key)) {  
            
            if(query.length > 0){
              query = key + ':' + this.permissionsQueryString[key] + ':' +query;
            }
            else{
              query = key + ':' + this.permissionsQueryString[key] + query;
            }
              
            
            params = params.set("query", query);
          }
        } 
      }
    }
    else if(this.isApplySearchQuery && this.teamsSearchQuery.length > 0){
      params = params.set("query", 'freeTextSearch='+this.teamsSearchQuery);
    }
    return this.http.get<any>(apiUrl, { params: params });
  }

  removeTeamMember(id):Observable<any> {
    return id;
  }
  
}
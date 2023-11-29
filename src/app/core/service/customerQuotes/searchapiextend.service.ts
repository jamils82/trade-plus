import { Injectable } from '@angular/core';
import { SearchboxService, SearchConfig } from '@spartacus/core';

@Injectable({
  providedIn: 'root'
})
export class SearchapiextendService extends SearchboxService {
  search(query: string, config?: SearchConfig): void {
    super.search(query, { ...config, foo: 'bar' } as SearchConfig);
  }
}

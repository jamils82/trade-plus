import { Component, Input, OnInit } from '@angular/core';
import { quoteConstants } from 'src/app/core/constants/general';
import { MaterialService } from 'src/app/core/service/customerQuotes/material.service';

@Component({
  selector: 'app-custom-load-more',
  templateUrl: './custom-load-more.component.html',
  styleUrls: ['./custom-load-more.component.scss']
})
export class CustomLoadMoreComponent implements OnInit {
  currentPaginationData: any;
  quoteConstants = quoteConstants;
  
  @Input() paginationData: any;
  @Input() productType: any;
  
  constructor(
    private materialService: MaterialService
  ) {}

  ngOnInit(): void {
  }


  loadMoreProducts(e: any, currentPage: any) {
    this.currentPaginationData = this.paginationData;
    if (this.productType == 'search') {
      this.materialService.loadMoreSearch.next(currentPage+1);
    } else if (this.productType == 'materials') {
      // call retreive products api
      this.materialService.loadMoreMaterials.next(currentPage+1);
    }
  }

}

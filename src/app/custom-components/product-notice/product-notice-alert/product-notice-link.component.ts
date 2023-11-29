import { Component, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';

@Component({
  selector: 'app-product-notice-link',
  templateUrl: './product-notice-link.component.html',
  styleUrls: ['./product-notice-link.component.scss']
})
export class CustomProductNoticeLinkComponent implements OnInit {

  noticeAlertVisible:boolean;

  constructor() { }

  ngOnInit(): void {
    let getNoticeAlertStatus = sessionStorage.getItem('productNoticeAlert')
    this.noticeAlertVisible = getNoticeAlertStatus == 'false'? false : true;
  }

  hideNoticeAlert() {
    sessionStorage.setItem('productNoticeAlert', 'false')
    this.noticeAlertVisible = false;
  }
}

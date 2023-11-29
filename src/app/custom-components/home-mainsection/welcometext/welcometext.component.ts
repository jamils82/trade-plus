import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/service/CommonService/common.service';

@Component({
  selector: 'app-welcometext',
  templateUrl: './welcometext.component.html',
  styleUrls: ['./welcometext.component.scss']
})
export class WelcometextComponent implements OnInit {

  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.onLoadGTMMethod('homepage', 'homepage', '0', window.location.href);
  }

}

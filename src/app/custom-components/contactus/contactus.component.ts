import { Component, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/utils';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  isMobile: boolean = false;
  isOpen: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.isMobile = CommonUtils.isMobile();
  }
  onDropdownClick() {
    this.isOpen = !this.isOpen;
  }
}

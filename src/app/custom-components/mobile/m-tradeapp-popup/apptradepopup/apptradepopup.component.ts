import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-apptradepopup',
  templateUrl: './apptradepopup.component.html',
  styleUrls: ['./apptradepopup.component.scss']
})
export class ApptradepopupComponent implements OnInit {

 
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
   
  }

  switchToApp() {
    const itunesLink = environment.iosAppRedirectURL;
		const playStoreLink = environment.androidAppRedirectURL;
		const webLink = environment.UIsiteURl;
		if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
      window.location.href = itunesLink;

		} else if (navigator.userAgent.match(/Android/i)) {
      window.location.href = playStoreLink;
		} else {
      window.location.href = webLink;
		}
  }

  openModalCancelPopup() {
    this.modalService.dismissAll();
  }

}

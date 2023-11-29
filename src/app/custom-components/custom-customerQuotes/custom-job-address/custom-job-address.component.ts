import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { quoteConstants } from 'src/app/core/constants/general';
import { JobDetailsService } from 'src/app/core/service/customerQuotes/job-details.service';


@Component({
  selector: 'app-custom-job-address',
  templateUrl: './custom-job-address.component.html',
  styleUrls: ['./custom-job-address.component.scss']
})
export class CustomJobAddressComponent implements OnInit {
  quoteConstants = quoteConstants;
  @ViewChild('auto') auto;
  @Input() setEditAddress: any;
  @Input() placeholderCustom:any;
  @Output() getAdressName = new EventEmitter();
  @Output() clearSearchField = new EventEmitter();
  @Output() inputFieldJobaddress = new EventEmitter();

  constructor(
    private jobDetailService: JobDetailsService,
  ) { }
  ngOnInit(): void {
    //this.setEditAddress=this.setEditAddress !=undefined?this.setEditAddress:'';
  }
  keyword = '';
  data: any;
  isLoadingResult: boolean;
  addressName:any;
  errorMsg: string;
  selectEvent(item) {
    this.addressName=item;
    this.getAdressName.emit(this.addressName);
    this.isLoadingResult = false;
  }

  getcoreLogicAddress(event) {
    this.inputFieldJobaddress.emit(event);
    if(event.length >= 3){
      this.isLoadingResult = true;
      this.jobDetailService.fetchCoreLogicAPIAdress(event).subscribe(data => {
        let result=[];
        let results=data.suggestions.map(a => a.text);
        results.forEach(function(data){
          result.push(data);
        })
        this.data = result;
        this.isLoadingResult = false;
      });
    }
  }
  onFocused($event){
    this.isLoadingResult = false;
  //   if($event.target.value ==""){
       //this.inputFieldJobaddress.emit($event);
  // }
    this.auto.close();
  }
  searchCleared() {
    this.isLoadingResult = false;
    this.data =[];
    this.clearSearchField.emit()
   }
 
}

  
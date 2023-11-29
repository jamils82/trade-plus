import { DatePipe } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  Input,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/service/CommonService/common.service';


@Component({
  selector: 'app-ngb-date-rangepicker',
  templateUrl: './ngb-date-rangepicker.component.html',
  styleUrls: ['./ngb-date-rangepicker.component.scss']
})
export class NgbDateRangepickerComponent implements AfterViewInit {
  @Input() disableDate: boolean;
  @ViewChild('datepickerComp') datepicker: any;
  hoveredDate: NgbDate | null = null;

  @Input() fromDate: NgbDate | null;
  @Input() toDate: NgbDate | null;
  @Output() rangeSelected: EventEmitter<any> = new EventEmitter();
  @Output() dateRangeEmitter = new EventEmitter<string>();
  @Input() endDate?: any;
  @Input() startDate?: any;
  @Input() pageName: any;
  param1: string;
  param2: string;
  minDate: any;
  navigation = 'select';
  @ViewChild('parent') parent: ElementRef;
  form: any;
  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    public datePipe: DatePipe,
    private route: ActivatedRoute,
    public router : Router,
    public commonService: CommonService,
    private fb: FormBuilder
   
  ) {
    this.form = this.fb.group({
      due_date: [''],
    });
    if(this.router.url.includes('fromDate')){
      this.route.queryParams.subscribe(params => {
        this.param1 = params['fromDate'];
        this.param2 = params['toDate'];
    });
     var year = this.param1.toString().split('-')[0];
     var month = this.param1.toString().split('-')[1];
     var day = this.param1.toString().split('-')[2];
    let myDate = new NgbDate(Number(year), Number(month), Number(day) )
    this.fromDate = calendar.getPrev(myDate, 'm', 0)
    this.toDate = calendar.getPrev(new NgbDate(Number(this.param2.toString().split('-')[0]), Number(this.param2.toString().split('-')[1]), Number(this.param2.toString().split('-')[2]) ), 'm', 0)
    }
    else{
      this.fromDate = calendar.getPrev(calendar.getToday(), 'm', 1);
      this.toDate = calendar.getToday();
     
    }
  
  }

  ngOnInit() {
    

    // this.minDate.year = "{year: 2010, month: 1, day: 1}"
    if (this.pageName == 'MyTeam') {
      this.minDate = this.calendar.getToday();
      this.fromDate = this.calendar.getToday();
      this.toDate = this.calendar.getNext(this.calendar.getToday(), 'm', 1);
    }
    if(this.pageName == 'MyQuotes') {
     
      if(this.router.url.includes('fromDate')){
        this.route.queryParams.subscribe(params => {
          this.param1 = params['fromDate'];
          this.param2 = params['toDate'];
      });
       var year = this.param1.toString().split('-')[0];
       var month = this.param1.toString().split('-')[1];
       var day = this.param1.toString().split('-')[2];
      let myDate = new NgbDate(Number(year), Number(month), Number(day) )
      this.fromDate = this.calendar.getPrev(myDate, 'm', 0)
      this.toDate = this.calendar.getPrev(new NgbDate(Number(this.param2.toString().split('-')[0]), Number(this.param2.toString().split('-')[1]), Number(this.param2.toString().split('-')[2]) ), 'm', 0)
      }
      else{
        this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'm', 1);
        this.toDate = this.calendar.getToday();
      }
    }   
    if (this.pageName == "statement"){
      if(!this.router.url.includes('fromDate')){
      this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'y', 1);
    }
  }


    // if(this.pageName == "order"){
    //   if(this.router.url.includes('fromDate')){
    //     this.route.queryParams.subscribe(params => {
    //       this.param1 = params['fromDate'];
    //       this.param2 = params['toDate'];
    //   });
    //    var year = this.param1.toString().split('-')[0];
    //    var month = this.param1.toString().split('-')[1];
    //    var day = this.param1.toString().split('-')[2];
    //   let myDate = new NgbDate(Number(year), Number(month), Number(day) )
    //   this.fromDate = this.calendar.getPrev(myDate, 'm', 0)
    //   this.toDate = this.calendar.getPrev(new NgbDate(Number(this.param2.toString().split('-')[0]), Number(this.param2.toString().split('-')[1]), Number(this.param2.toString().split('-')[2]) ), 'm', 0)
    //   }
    // }
  }

  setNavigation() {
    this.datepicker.navigation = 'select';
  }
  ngAfterViewInit() {
    document.addEventListener('click', (evt) => {
      const flyoutElement = document.getElementById('flyout-example');
      let targetElement = evt.target; // clicked element

      do {
        if (targetElement == flyoutElement) {
          return;
        }
        // Go up the DOM
        targetElement = (<HTMLElement>targetElement).parentElement;
      } while (targetElement);

      this.datepicker.close();
    });

    if (this.startDate != undefined && this.endDate != undefined) {
      let fromDate: any = {
        day: Number(this.startDate.split('/')[0]),
        month: Number(this.startDate.split('/')[1]),
        year: Number(this.startDate.split('/')[2]),
      };
      let toDate: any = {
        day: Number(this.endDate.split('/')[0]),
        month: Number(this.endDate.split('/')[1]),
        year: Number(this.endDate.split('/')[2]),
      };
      this.fromDate = fromDate;
      this.toDate = toDate;
    }
    if(this.pageName == 'MyQuotes') {
      
      this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'm', 1);
      this.toDate = this.calendar.getToday();

      if(this.router.url.includes('fromDate')){
        this.route.queryParams.subscribe(params => {
          this.param1 = params['fromDate'];
          this.param2 = params['toDate'];
      });
       var year = this.param1.toString().split('-')[0];
       var month = this.param1.toString().split('-')[1];
       var day = this.param1.toString().split('-')[2];
      let myDate = new NgbDate(Number(year), Number(month), Number(day) )
      this.fromDate = this.calendar.getPrev(myDate, 'm', 0)
      this.toDate = this.calendar.getPrev(new NgbDate(Number(this.param2.toString().split('-')[0]), Number(this.param2.toString().split('-')[1]), Number(this.param2.toString().split('-')[2]) ), 'm', 0)
      }
      
        
      
    }
  }
  get formatFromDate() {
    return `${this.pad(this.fromDate?.day)}/${this.pad(this.fromDate?.month)}/${this.fromDate?.year}`;
  }

  get formatToDate() {
    if (this.toDate?.day) {
      return `${this.pad(this.toDate?.day)}/${this.pad(this.toDate?.month)}/${this.toDate?.year}`;
    } else {
      return `${this.pad(this.fromDate?.day)}/${this.pad(this.fromDate?.month)}/${this.fromDate?.year}`;
    }
  }

  public pad(d) {
    return d < 10 ? '0' + d.toString() : d.toString();
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      (date.after(this.fromDate) || date.equals(this.fromDate))
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.formatFromDate && this.toDate) {
      this.datepicker.toggle();
      this.rangeSelected.emit({
        start:
          this.fromDate.day +
          '/' +
          this.fromDate.month +
          '/' +
          this.fromDate.year,
        end: this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year,
      });
      let dateRange =
        '&createdAfter=' +
        this.datePipe.transform(
         // new Date(
            this.fromDate.year +
              '-' +
              this.fromDate.month +
              '-' +
              this.fromDate.day,
         // ),
          'dd-MM-yyyyT00:00:00'
        ) +
        '&createdBefore=' +
        this.datePipe.transform(
        //  new Date(
            this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day,
         // ),
          'dd-MM-yyyyT23:59:59'
        );
      this.dateRangeEmitter.emit(dateRange);
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
}

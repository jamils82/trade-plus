import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-filter-popup',
  templateUrl: './date-filter-popup.component.html',
  styleUrls: ['./date-filter-popup.component.scss']
})
export class DateFilterPopupComponent implements OnInit {
  toDate;
  fromDate;
  @Input() endDate?: any;
  @Input() startDate?: any;
  hoveredDate: NgbDate | null = null;
  @ViewChild('datepickerComp') datepicker: any;
  @Output() dateRangeEmitter = new EventEmitter<string>();
  minDate: any;
  navigation = 'arrows';
  displayMonths = 2;
  showWeekNumbers = false;
  outsideDays = 'visible';

  constructor(public calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    public datePipe : DatePipe,
    private modalService: NgbModal) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'm', 1);
    this.minDate = calendar.getToday();
  }

  ngOnInit(): void {
  }


  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  closePopup() {
    this.modalService.dismissAll();
  }
  applyDateFilters() {
    if (this.fromDate && this.toDate) {
      let dates = `${this.fromDate?.month}/${this.fromDate?.day}/${this.fromDate?.year}` + '-' + `${this.toDate?.month}/${this.toDate?.day}/${this.toDate?.year}`;
      let dateRange = '&createdBefore='+ this.datePipe.transform( new Date(`${this.fromDate?.day}-${this.fromDate?.month}-${this.fromDate?.year}`) , 'dd-MM-yyyyThh:mm:ss') + '&createdAfter=' + this.datePipe.transform(new Date(`${this.toDate?.day}-${this.toDate?.month}-${this.toDate?.year}`), 'dd-MM-yyyyThh:mm:ss');
      this.dateRangeEmitter.emit(dateRange); 
      this.modalService.dismissAll(dates);
    }
  }
}

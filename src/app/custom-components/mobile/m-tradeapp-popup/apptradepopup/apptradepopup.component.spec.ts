import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptradepopupComponent } from './apptradepopup.component';

describe('ApptradepopupComponent', () => {
  let component: ApptradepopupComponent;
  let fixture: ComponentFixture<ApptradepopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptradepopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptradepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChnageQuotePopupComponent } from './chnage-quote-popup.component';

describe('ChnageQuotePopupComponent', () => {
  let component: ChnageQuotePopupComponent;
  let fixture: ComponentFixture<ChnageQuotePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChnageQuotePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChnageQuotePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

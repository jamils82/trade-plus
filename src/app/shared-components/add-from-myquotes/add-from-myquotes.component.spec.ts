import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFromMyquotesComponent } from './add-from-myquotes.component';

describe('AddFromMyquotesComponent', () => {
  let component: AddFromMyquotesComponent;
  let fixture: ComponentFixture<AddFromMyquotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFromMyquotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFromMyquotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

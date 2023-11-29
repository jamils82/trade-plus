import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultidownloadFormatComponent } from './multidownload-format.component';

describe('MultidownloadFormatComponent', () => {
  let component: MultidownloadFormatComponent;
  let fixture: ComponentFixture<MultidownloadFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultidownloadFormatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultidownloadFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

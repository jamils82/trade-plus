import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFromMylistComponent } from './add-from-mylist.component';

describe('AddFromMylistComponent', () => {
  let component: AddFromMylistComponent;
  let fixture: ComponentFixture<AddFromMylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFromMylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFromMylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

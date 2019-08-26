import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewYearComponent } from './new-year.component';

describe('NewYearComponent', () => {
  let component: NewYearComponent;
  let fixture: ComponentFixture<NewYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

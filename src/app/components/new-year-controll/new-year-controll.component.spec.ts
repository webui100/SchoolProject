import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewYearControllComponent } from './new-year-controll.component';

describe('NewYearControllComponent', () => {
  let component: NewYearControllComponent;
  let fixture: ComponentFixture<NewYearControllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewYearControllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewYearControllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

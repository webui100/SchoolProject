import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledMarksComponent } from './disabled-marks.component';

describe('DisabledMarksComponent', () => {
  let component: DisabledMarksComponent;
  let fixture: ComponentFixture<DisabledMarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabledMarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

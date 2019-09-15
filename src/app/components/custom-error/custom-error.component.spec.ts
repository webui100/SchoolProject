import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomErrorComponent } from './custom-error.component';

describe('CustomErrorComponent', () => {
  let component: CustomErrorComponent;
  let fixture: ComponentFixture<CustomErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

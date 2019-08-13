import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountBarComponent } from './count-bar.component';

describe('CountBarComponent', () => {
  let component: CountBarComponent;
  let fixture: ComponentFixture<CountBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

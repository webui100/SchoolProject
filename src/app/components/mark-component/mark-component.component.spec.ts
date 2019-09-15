import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkComponentComponent } from './mark-component.component';

describe('MarkComponentComponent', () => {
  let component: MarkComponentComponent;
  let fixture: ComponentFixture<MarkComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

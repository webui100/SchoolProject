import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarkComponent } from './add-mark.component';

describe('AddMarkComponent', () => {
  let component: AddMarkComponent;
  let fixture: ComponentFixture<AddMarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

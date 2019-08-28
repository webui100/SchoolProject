import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferedClassesTableComponent } from './transfered-classes-table.component';

describe('TransferedClassesTableComponent', () => {
  let component: TransferedClassesTableComponent;
  let fixture: ComponentFixture<TransferedClassesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferedClassesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferedClassesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

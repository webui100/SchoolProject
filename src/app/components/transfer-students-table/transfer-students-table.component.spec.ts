import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferStudentsTableComponent } from './transfer-students-table.component';

describe('TransferStudentsTableComponent', () => {
  let component: TransferStudentsTableComponent;
  let fixture: ComponentFixture<TransferStudentsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferStudentsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferStudentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

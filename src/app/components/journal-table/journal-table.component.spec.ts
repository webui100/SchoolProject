import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalTableComponent } from './journal-table.component';

describe('JournalTableComponent', () => {
  let component: JournalTableComponent;
  let fixture: ComponentFixture<JournalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

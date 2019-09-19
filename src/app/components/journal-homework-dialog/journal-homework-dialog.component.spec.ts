import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalHomeworkDialogComponent } from './journal-homework-dialog.component';

describe('JournalHomeworkDialogComponent', () => {
  let component: JournalHomeworkDialogComponent;
  let fixture: ComponentFixture<JournalHomeworkDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalHomeworkDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalHomeworkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

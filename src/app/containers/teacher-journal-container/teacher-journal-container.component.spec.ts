import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherJournalContainerComponent } from './teacher-journal-container.component';

describe('TeacherJournalContainerComponent', () => {
  let component: TeacherJournalContainerComponent;
  let fixture: ComponentFixture<TeacherJournalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherJournalContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherJournalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSubjectsComponent } from './teacher-subjects.component';

describe('TeacherSubjectsComponent', () => {
  let component: TeacherSubjectsComponent;
  let fixture: ComponentFixture<TeacherSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

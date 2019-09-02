import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDetailContainerComponent } from './teacher-detail-container.component';

describe('TeacherDetailContainerComponent', () => {
  let component: TeacherDetailContainerComponent;
  let fixture: ComponentFixture<TeacherDetailContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherDetailContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherDetailContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

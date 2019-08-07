import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCreateComponent } from './teacher-create.component';

describe('TeacherCreateComponent', () => {
  let component: TeacherCreateComponent;
  let fixture: ComponentFixture<TeacherCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherCardComponent } from './teacher-card.component';
import { MaterialComponents } from 'src/app/modules/material/material.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

describe('TeacherCardComponent', () => {
  let component: TeacherCardComponent;
  let fixture: ComponentFixture<TeacherCardComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialComponents,
                HttpClientTestingModule],
      declarations: [ TeacherCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCardComponent);
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a form with 7 controls', () => {
    expect(component.editTeacher.contains('firstname')).toBeTruthy();
    expect(component.editTeacher.contains('lastname')).toBeTruthy();
    expect(component.editTeacher.contains('patronymic')).toBeTruthy();
    expect(component.editTeacher.contains('dateOfBirth')).toBeTruthy();
    expect(component.editTeacher.contains('email')).toBeTruthy();
    expect(component.editTeacher.contains('phone')).toBeTruthy();
    expect(component.editTeacher.contains('login')).toBeTruthy();
  });

  it('should make controls validation', () => {
    const control = component.editTeacher.get('firstname');

    control.setValue('Dmutro');

    expect(control.valid).toBeFalsy();
  });
});

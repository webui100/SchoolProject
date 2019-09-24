import { ITeacher } from 'src/app/models/teacher.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCardComponent } from './teacher-card.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

describe('TeacherCardComponent', () => {
  let component: TeacherCardComponent;
  let fixture: ComponentFixture<TeacherCardComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const teacher: ITeacher = {
    firstname: 'Антуан',
    lastname: 'Хуан',
    patronymic: 'Балабан',
    dateOfBirth: '25-05-1985',
    login: 'huan4ik',
    email: '',
    phone: '',
    newPass: '',
    oldPass: '',
    avatar: '',
    id: 0
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherCardComponent ],
      imports: [MaterialModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule],
      providers: [ provideMockStore({})]
    })
    .compileComponents().then(() => {
        fixture = TestBed.createComponent(TeacherCardComponent);
        component = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
    });
  }));

  beforeEach( async(() => {
    component.teacher = teacher;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the submitEdit method', async () => {
      spyOn(component, 'submitEdit');
      el = fixture.debugElement.query(By.css('button')).nativeElement;
      el.click();
      expect(component.submitEdit).toHaveBeenCalledTimes(0);
  });

  it('form should be invalid', async () => {
    component.editTeacher.controls.firstname.setValue('петро');
    component.editTeacher.controls.lastname.setValue('іванов');
    component.editTeacher.controls.patronymic.setValue('степонович');
    component.editTeacher.controls.dateOfBirth.setValue('22-05-2015');
    component.editTeacher.controls.email.setValue('');
    component.editTeacher.controls.phone.setValue('');
    component.editTeacher.controls.login.setValue('');
    expect(component.editTeacher.valid).toBeFalsy();
    });

  it('form should be valid', async () => {
    component.editTeacher.controls.firstname.setValue('Петро');
    component.editTeacher.controls.lastname.setValue('Іванов');
    component.editTeacher.controls.patronymic.setValue('Степонович');
    component.editTeacher.controls.dateOfBirth.setValue('1995-05-25');
    component.editTeacher.controls.email.setValue('gmail@gmail.com');
    component.editTeacher.controls.phone.setValue('');
    component.editTeacher.controls.login.setValue('petrovi4');
    expect(component.editTeacher.valid).toBeTruthy();
});
});



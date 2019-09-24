import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCreateComponent } from './teacher-create.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('TeacherCreateComponent', () => {
  let component: TeacherCreateComponent;
  let fixture: ComponentFixture<TeacherCreateComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherCreateComponent ],
      imports: [MaterialModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule],
      providers: [ provideMockStore({})]
    })
    .compileComponents().then(() => {
        fixture = TestBed.createComponent(TeacherCreateComponent);
        component = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
    });
  }));

  beforeEach( async () => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the submitAdd method', async () => {
      spyOn(component, 'submitAdd');
      el = fixture.debugElement.query(By.css('button')).nativeElement;
      el.click();
      expect(component.submitAdd).toHaveBeenCalledTimes(0);
  });

  it('form should be invalid', async () => {
    component.addTeacher.controls.firstname.setValue('петро');
    component.addTeacher.controls.lastname.setValue('іванов');
    component.addTeacher.controls.patronymic.setValue('степонович');
    component.addTeacher.controls.dateOfBirth.setValue('22-05-2015');
    component.addTeacher.controls.email.setValue('');
    component.addTeacher.controls.phone.setValue('');
    component.addTeacher.controls.login.setValue('');
    expect(component.addTeacher.valid).toBeFalsy();
    });

  it('form should be valid', async () => {
    component.addTeacher.controls.firstname.setValue('Петро');
    component.addTeacher.controls.lastname.setValue('Іванов');
    component.addTeacher.controls.patronymic.setValue('Степонович');
    component.addTeacher.controls.dateOfBirth.setValue('1995-05-25');
    component.addTeacher.controls.email.setValue('gmail@gmail.com');
    component.addTeacher.controls.phone.setValue('');
    component.addTeacher.controls.login.setValue('petrovi4');
    expect(component.addTeacher.valid).toBeTruthy();
});
});

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherJournalComponent } from './teacher-journal.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('TeacherJournalComponent', () => {
  let component: TeacherJournalComponent;
  let fixture: ComponentFixture<TeacherJournalComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const bindData = {
    teacherId: 123,
    journalList: {123: {className: '6-У', subjectName: 'Українська література'}},
    subjectList: [{subjectName: 'Всесвітня Історія'}, {subjectName: 'Зарубіжна література'}],
    classList: [{className: '5-Б'}, {className: '6-А'}],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherJournalComponent ],
      imports: [MaterialModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule],
      providers: [ provideMockStore({})]
    })
    .compileComponents().then(() => {
        fixture = TestBed.createComponent(TeacherJournalComponent);
        component = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
    });
  }));

  beforeEach( async(() => {
    component.bindData = bindData;
    fixture.detectChanges();
  }));

  it('should be create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the submitJournalBind method', async () => {
      spyOn(component, 'submitJournalBind');
      el = fixture.debugElement.query(By.css('button')).nativeElement;
      el.click();
      expect(component.submitJournalBind).toHaveBeenCalledTimes(0);
  });

  it('form should be invalid', async () => {
    component.bindTeacherJournal.controls.subjectsControl.setValue('');
    component.bindTeacherJournal.controls.classesControl.setValue('');
    expect(component.bindTeacherJournal.valid).toBeFalsy();
    });

  it('should been call getBindingList method', async () => {
    spyOn(component, 'getBindingList').and.callThrough();
    const res = component.getBindingList();
    expect(component.getBindingList).toHaveBeenCalledTimes(1);
    expect(res['className']).toBe('6-У');
    expect(res['subjectName']).toBe('Українська література');
  });


});

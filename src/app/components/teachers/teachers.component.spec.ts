import { ITeacher } from './../../models/teacher.model';
import { TeacherJournalComponent } from './teacher-journal/teacher-journal.component';
import { TeacherCardComponent } from './teacher-card/teacher-card.component';
import { TeacherDetailContainerComponent } from './../../containers/teacher-detail-container/teacher-detail-container.component';
import { SortButtonComponent } from './../sort-button/sort-button.component';
import { LocaleHeaderPipe } from './../../pipes/locale-header.pipe';
import { TeacherCreateComponent } from './teacher-create/teacher-create.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TeachersComponent } from './teachers.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TeachersComponent', () => {
  let component: TeachersComponent;
  let fixture: ComponentFixture<TeachersComponent>;
  const mockTeacherData: ITeacher[] = [{
    avatar: '',
    dateOfBirth: '25-05-1996',
    email: 'email@email.com',
    firstname: 'Джовані',
    id: 0,
    lastname: 'Макгрегор',
    login: 'kovani',
    patronymic: 'Петрович',
    phone: '',
    newPass: '',
    oldPass: ''
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachersComponent,
                      TeacherCreateComponent,
                      LocaleHeaderPipe,
                      SortButtonComponent,
                      TeacherDetailContainerComponent,
                      TeacherCardComponent,
                      TeacherJournalComponent ],
      imports: [MaterialModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ],
      providers: [ provideMockStore({})]
    })
    .compileComponents().then(() => {
        fixture = TestBed.createComponent(TeachersComponent);
        component = fixture.componentInstance;
    });
  }));

  beforeEach( async(() => {
    component.teachersData = mockTeacherData;
    fixture.detectChanges();
  }));

  it('should be create', () => {
    expect(component).toBeTruthy();
  });

});

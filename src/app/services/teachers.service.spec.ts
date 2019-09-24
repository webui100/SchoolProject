import { MaterialModule } from './../modules/material/material.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TeachersService } from './teachers.service';
import { ITeacher } from '../models/teacher.model';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';



const mockTeachers: ITeacher[] = [
    {
      firstname: 'Петров',
      lastname: 'Іванов',
      patronymic: 'Степанович',
      dateOfBirth: '1955-10-05',
      id: 0,
      email: 'gmail@gmail.com',
      avatar: '',
      login: 'petya',
      phone: '0503564585',
      newPass: '',
      oldPass: ''
    },
    {
      firstname: 'Антон',
      lastname: 'Чоловіков',
      patronymic: 'Степанич',
      dateOfBirth: '1985-02-15',
      id: 1,
      email: 'mail@mail.ru',
      avatar: '',
      login: 'antoha',
      phone: '',
      newPass: '',
      oldPass: ''
    }
  ];

const mockTeacher: ITeacher = {
    firstname: 'Петров',
    lastname: 'Іванов',
    patronymic: 'Степанович',
    dateOfBirth: '1955-10-05',
    id: 0,
    email: 'gmail@gmail.com',
    avatar: '',
    login: 'petya',
    phone: '0503564585',
    newPass: '',
    oldPass: ''
}


describe('TeachersService', () => {
  const initialState = { teachers: [] };
  let service: TeachersService;
  let store: MockStore<{ teachers: ITeacher[] }>;

  beforeEach( async () =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialModule],
      providers: [ provideMockStore({ initialState })]
    })
  );
  beforeEach(inject([TeachersService, HttpTestingController], (s, h) => {
    service = s;
    store = TestBed.get<Store<ITeacher>>(Store);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request', () => {
    spyOn(service, 'getTeachers');
    service.getTeachers();
    expect(service.getTeachers).toHaveBeenCalledTimes(1);
  });

  it('should make POST request', () => {
    spyOn(service, 'addTeacher');
    service.addTeacher(mockTeacher);
    expect(service.addTeacher).toHaveBeenCalledTimes(1);
  });

  it('should make GET request for journal binding', () => {
    spyOn(service, 'getTeacherBind');
    service.getTeacherBind(121);
    expect(service.getTeacherBind).toHaveBeenCalledTimes(1);
  });

});

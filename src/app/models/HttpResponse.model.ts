import { IBindTeacher } from 'src/app/models/teacher.model';
import { ITeacher } from './teacher.model';
export interface IHttpGetResponseList {
  data: ITeacher[];
  status: string;
}
export interface IHttpGetBindTeacher {
  data: IBindTeacher[];
  idTeacher: number;
  idSubject: number;
  idClass: number;
  subjectName: string;
  className: string;
  academicYear: number;
  bindTeacher;
}

export interface IHttpPostPutResponse {
  headers: object;
  status: number;
  statusText: string;
  url: string;
  body: object;
  data: ITeacher;
}

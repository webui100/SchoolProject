import { ITeacher } from './teacher.model';
export interface IHttpGetResponse {
    data: ITeacher[];
    status: string;
  }

export interface IHttpPostPutResponse {
    headers: object;
    status: number;
    statusText: string;
    url: string;
    body: object;
    data: ITeacher;
}

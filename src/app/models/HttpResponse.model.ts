import { Teacher } from './teacher.model';
export interface HttpGetResponse {
    data: Teacher[] | Array<object>;
    status: string;
  }

export interface HttpPostPutResponse {
    headers: object;
    status: number;
    statusText: string;
    url: string;
    body: object;
    data: Teacher | object;
}

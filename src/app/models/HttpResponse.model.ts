export interface HttpGetResponse {
    data: Array<object>;
    status: string;
  }

export interface HttpPostPutResponse {
    headers: object;
    status: number;
    statusText: string;
    url: string;
    body: object;
    data: Array<object>;
}

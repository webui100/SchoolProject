export interface HttpGetReponse {
    data: Array<object>;
    status: string;
  }

export interface HttpPostPutReponse {
    headers: object;
    status: number;
    statusText: string;
    url: string;
    body: object;
    data: Array<object>;
}

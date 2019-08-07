export interface Chart {
  options: object;
  labels: Array<string>;
  type: string;
  legend: boolean;
  data: Array<number>;
  colors: Array<object>;
}

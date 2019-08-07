import {Observable} from 'rxjs';

export default interface ChartObject {
  data$: Observable<Array<number>>;
  labels$: Observable<Array<string>>;
  colors$: Observable<Array<object>>;
  chartType$: Observable<string>;
  options$: Observable<object>;
  legend$: Observable<boolean>;
}

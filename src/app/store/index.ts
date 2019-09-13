import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { environment } from '../../environments/environment';
import { loginReducer, State as LoginState } from './login/login.reducer';
import { errorReducer, State as ErrorState } from './error/error.reducer';
import { storeFreeze } from 'ngrx-store-freeze';
import {
  scheduleReducer,
  State as ScheduleState
} from './schedule/schedule.reducer'; // +
import { diaryReducer, DiaryState } from './diary/diary.reducer';
import { chartReducer, State as ChartState } from './chart/chart.reducer';
import {
  teachersDataReducer,
  State as TeachersState
} from './teachers/teachers.reducer';
import { currentUserReducer, CurrentUserState } from './current-user/current-user.reducer';
import { RouterStateUrl } from './router.reducer';
import {
  subjectsDataReducer,
  State as SubjectsState
} from './subjects/subjects.reducer';
import {
  dataForTeacherReducer,
  TeacherPanelState
} from "./teacher-panel/teacher-panel.reducer";
import {
  studentsReducer,
  State as StudentsState
} from './students/students.reducer';
import {
  classesReducer,
  State as ClassesState
} from './classes/classes.reducer';
import {
  newYearReducer,
  State as NewYearState
} from './newyear/newyear.reducer';
import { avatarReducer, State as FormState } from './avatar/avatar.reducer';

export interface State {
  user: LoginState;
  errors: ErrorState;
  schedule: ScheduleState;
  teachers: TeachersState;
  subjects: SubjectsState;
  teacherPanel: TeacherPanelState;
  diary: DiaryState;
  chart: ChartState;
  currentUser: CurrentUserState;
  router: RouterReducerState<RouterStateUrl>;
  students: StudentsState;
  classes: ClassesState;
  newYear: NewYearState;
  avatar: FormState;
}

export const reducers: ActionReducerMap<State> = {
  user: loginReducer,
  errors: errorReducer,
  schedule: scheduleReducer,
  teachers: teachersDataReducer,
  chart: chartReducer,
  currentUser: currentUserReducer,
  router: routerReducer,
  subjects: subjectsDataReducer,
  teacherPanel: dataForTeacherReducer,
  diary: diaryReducer,
  students: studentsReducer,
  classes: classesReducer,
  newYear: newYearReducer,
  avatar: avatarReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storeFreeze]
  : [];

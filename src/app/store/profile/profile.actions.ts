import { createAction, props } from '@ngrx/store';
import { Student } from '../../models/profile.model';

export const fetchStudentProfile = createAction(
  '[Student Profile] Fetch',
  props<{ student: Student }>()
);

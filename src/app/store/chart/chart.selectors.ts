import { State as AppState } from '../index';
import {createSelector} from '@ngrx/store';
import ClassModel from '../../models/schoolclass.model';


export const chartSelector = (state: AppState) => state.chart;

export const selectTeachers = (state: AppState) => state.teachers.teachersList;
export const selectSubjects = (state: AppState) => state.subjects.data;
export const selectActiveClasses = (state: AppState) => {
  if (state.classes.classesList) {
    return state.classes.classesList.filter((item: ClassModel) => item.isActive !== false);
  } else {
    return [];
  }
};

export const selectQuantityTSC = createSelector(
  selectActiveClasses,
  selectSubjects,
  selectTeachers,
  (classes, subjects, teachers) => {
    return {
      classes: classes ? classes.length : null,
      subjects: subjects ? subjects.length : null,
      teachers: teachers ? teachers.length : null,
      students: classes ? classes.reduce((acc, item: ClassModel) => acc + item.numOfStudents, 0) : null
    };
  }
);

export const getStudentsFromClass = createSelector(
  selectActiveClasses,
  (classes, props) => {
    const regex = new RegExp(`^${props.className}[-(а-я]`, 'i');
    console.log(classes, regex);
    return classes
      .filter((value) => regex.test(value.className))
      .reduce((acc, value: ClassModel) => {
      acc.push({
        data: [value.numOfStudents],
        label: value.className
      });
      return acc;
    }, []);
  }
);


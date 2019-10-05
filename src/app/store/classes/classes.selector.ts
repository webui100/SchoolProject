import { createSelector } from '@ngrx/store'

import { State as AppState } from '../index'
import { State as ClassesState } from './classes.reducer'

export const selectClasses = (appState: AppState) => appState.classes

export const selectData = (classesState: ClassesState) =>
  classesState.classesList

export const selectClassesData = (classesState: ClassesState) =>
  groupByStatus(classesState.classesList)

export const selectClassesList = createSelector(
  selectClasses,
  selectData
)
export const selectClassesAll = createSelector(
  selectClasses,
  selectClassesData
)
// Group on active/nonActive
function groupByStatus(classList) {
  const groupedClasses = {
    activeUniqueClassList: new Map(),
    nonActiveUniqueClassList: new Map(),
  }
  classList.forEach(schoolClass => {
    const uniqueClassName = extractClassNumber(schoolClass)
    if (schoolClass.isActive) {
      groupedClasses.activeUniqueClassList.has(uniqueClassName)
        ? groupedClasses.activeUniqueClassList
            .get(uniqueClassName)
            .push(schoolClass)
        : groupedClasses.activeUniqueClassList.set(uniqueClassName, [
            schoolClass,
          ])
    } else {
      groupedClasses.nonActiveUniqueClassList.has(uniqueClassName)
        ? groupedClasses.nonActiveUniqueClassList
            .get(uniqueClassName)
            .push(schoolClass)
        : groupedClasses.nonActiveUniqueClassList.set(uniqueClassName, [
            schoolClass,
          ])
    }
  })
  return groupedClasses
}

function extractClassNumber(schoolClass) {
  let indexOfDash = schoolClass['className'].indexOf('-')
  if (schoolClass['className'].includes('(')) {
    return schoolClass['className'].substring(0, indexOfDash) + ')'
  } else {
    return schoolClass['className'].substring(0, indexOfDash)
  }
}

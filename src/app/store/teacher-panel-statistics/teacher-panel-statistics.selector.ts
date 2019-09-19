import { State as AppState } from '../index';


export const selectAllStudents = (state: AppState) => state.teacherPanelStatistics.studentsList;
export const selectAllMarks = (state: AppState) => {
    if (!state.teacherPanelStatistics.marksList) {
        return {
            data: [],
            labels: [],
          }
    }
    const data = state.teacherPanelStatistics.marksList.map(item => {
        return item.y;
    });

    const labels = state.teacherPanelStatistics.marksList.map(item => {
        return item.x.join('.');
    });

    return {
        data: [
            {data, label: 'Оцінка'},
          ],
        labels
    };
};

export interface Diary {
  data: {
    date: [number, number, number];
    homeWork: string;
    homeworkFileId: number | null;
    lessonId: number;
    lessonNumber: number;
    mark: number;
    note: string;
    subjectName: string;
  }[];
}

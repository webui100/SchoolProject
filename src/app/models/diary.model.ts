export interface Lesson {
  date: [number, number, number];
  homeWork: string;
  homeworkFileId: number | null;
  lessonId: number;
  lessonNumber: number;
  mark: number;
  note: string;
  subjectName: string;
}

export interface HomeworkFile {
  data: {
    fileData: string;
    fileName: string;
    fileType: string;
    homework: string;
    idLesson: number;
  };
}

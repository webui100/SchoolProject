export interface Schedule {
    'classId': number;
    'className': string;
    'startOfSemester': string;
    'endOfSemester': string;
    'fridaySubjects': any[];
    'mondaySubjects': any[];
    'saturdaySubjects': any[];
    'thursdaySubjects': any[];
    'tuesdaySubjects': any[];
    'wednesdaySubjects': any[];
  }

export interface PostLesson {
    lessonNumber: string;
    subjectDescription: string;
    subjectId: number;
    subjectName: string;
  }

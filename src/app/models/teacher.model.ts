export interface ITeacher {
  avatar: string;
  dateOfBirth: string;
  email: string;
  firstname: string;
  id: number;
  lastname: string;
  login: string;
  patronymic: string;
  phone: string;
  newPass?: string;
  oldPass?: string;
}

export interface IBindTeacher {
  id: number;
  idSubject?: number;
  idClass?: number;
  subjectName?: string;
  className?: string;
  academicYear?: number;
  bindTeacher;
}

export interface IJournalBind {
  teacherId: number;
  classId: number;
  subjectId: number;
}


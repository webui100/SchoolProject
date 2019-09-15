export interface User {
  firstname: string;
  firstName?: string;
  lastname: string;
  lastName?: string;
  patronymic?: string;
  classe?: string | null;
  classId?: number;
  dateOfBirth?: string;
  login?: string;
  email?: string;
  phone?: string;
  avatar: string;
  id?: number;
}

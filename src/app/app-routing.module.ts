import { NewYearComponent } from './containers/new-year/new-year.component';
import { ScheduleComponent } from "./containers/schedule/schedule.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminPanelComponent } from "./containers/admin-panel/admin-panel.component";
import { LoginComponent } from "./pages/login/login.component";
import { AdminComponent } from './pages/admin/admin.component';
import { TemporaryComponent } from './components/temporary/temporary.component';
import { StudentDiaryComponent } from './containers/student-diary/student-diary.component';
import { AdminGuard } from './services/guards/admin.guard';
import { TeacherGuard } from './services/guards/teacher.guard';
import { StudentGuard } from './services/guards/student.guard';
import { LoginGuard } from './services/guards/login.guard';
import { SubjectsComponent } from './containers/subjects/subjects.component';
import { StudentsComponent } from './pages/students/students.component';
import { StudentComponent } from './pages/student/student.component';
import { ClassesComponent } from './containers/classes/classes.component';
import { TeachersContainerComponent } from './components/teachers-container/teachers-container.component';
import { TeacherComponent } from "./pages/teacher/teacher.component";
import { TeacherSubjectsComponent } from './containers/teacher-subjects/teacher-subjects.component';
import { TeacherJournalsComponent } from './containers/teacher-journals/teacher-journals.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "teacher",
    component: TeacherComponent,
    canActivate: [TeacherGuard],
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },
      {
        path: "home",
        component: TeacherSubjectsComponent
      },
      {
        path: "journal",
        component: TeacherJournalsComponent
      },
      {
        path: "statistics",
        component: TemporaryComponent
      },
      {
        path: "profile",
        component: TemporaryComponent
      }
    ]
  },
  {
    path: "students",
    component: StudentsComponent
  },
  {
    path: "student",
    component: StudentComponent,
    canActivate: [StudentGuard],
    children: [{ path: "diary", component: StudentDiaryComponent }]
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },
      {
        path: "home",
        component: AdminPanelComponent
      },
      {
        path: "pupils",
        component: StudentsComponent
      },
      {
        path: "teachers",
        component: TeachersContainerComponent
      },
      {
        path: 'subjects',
        component: SubjectsComponent
      },
      {
        path: "schedule",
        component: ScheduleComponent
      },
      {
        path: "classes",
        component: ClassesComponent
      },
      {
        path: "new-year-transition",
        component: NewYearComponent
      },

    ]
  },
  // після цього роута, нічого не додавати!
  {
    path: '**',
    component: NotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AdminGuard, TeacherGuard, StudentGuard, LoginGuard]
})
// @ts-ignore
export class AppRoutingModule { }
// @ts-ignore

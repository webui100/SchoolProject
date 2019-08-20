import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { environment } from "../environments/environment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./pages/login/login.component";

import { TeachersComponent } from "./containers/teachers/teachers.component";
import { AdminComponent } from "./pages/admin/admin.component";

import { reducers, metaReducers } from "./store";
import { ScheduleComponent } from "./containers/schedule/schedule.component";
import { DailyScheduleComponent } from "./containers/schedule/daily-schedule/daily-schedule.component";
import { ClassesComponent } from './containers/classes/classes.component';


import {
  NavigationActionTiming,
  RouterStateSerializer,
  StoreRouterConnectingModule
} from "@ngrx/router-store";
import { CustomSerializer } from "./store/router.reducer";

import { CurrentUserComponent } from "./components/current-user/current-user.component";
import { CurrentUserService } from "./services/current-user.service";
import { HeaderComponent } from "./components/header/header.component";

import { MainNavComponent } from "./components/main-nav/main-nav.component";
import { MatListModule } from "@angular/material";
import { AdminPanelComponent } from "./containers/admin-panel/admin-panel.component";
import { ChartsModule } from "ng2-charts";
import "hammerjs";
import { TeacherCardComponent } from "./containers/teachers/teacher-card/teacher-card.component";
import { ErrorService } from "./services/error.service";
import { StudentDiaryComponent } from "./containers/student-diary/student-diary.component";
import { TeacherCreateComponent } from "./containers/teachers/teacher-create/teacher-create.component";
import { TemporaryComponent } from "./components/temporary/temporary.component";
import { MaterialModule } from "./modules/material/material.module";
import { ChartComponent } from "./components/chart/chart.component";
import { AuthInterceptor } from "./interseptors/http-interceptor/auth-interceptor";
import { StudentsComponent } from "./pages/students/students.component";
import { StudentDetailComponent } from "./pages/students/student-detail/student-detail.component";
import { AddStudentComponent } from "./pages/students/add-student/add-student.component";
import { SubjectsComponent } from './containers/subjects/subjects.component';
import {CdkDetailRowDirective} from './containers/subjects/cdk-detail-row.directive';
import { StudentComponent } from "./pages/student/student.component";
import { CountBarComponent } from './components/count-bar/count-bar.component';
import { HomeworkDialogComponent } from './components/homework-dialog/homework-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    TeachersComponent,
    MainNavComponent,
    ScheduleComponent,
    DailyScheduleComponent,
    AdminPanelComponent,
    TeacherCardComponent,
    StudentDiaryComponent,
    TeacherCreateComponent,
    TemporaryComponent,
    CurrentUserComponent,
    HeaderComponent,
    ChartComponent,
    SubjectsComponent,
    CdkDetailRowDirective,
    StudentsComponent,
    StudentDetailComponent,
    AddStudentComponent,
    StudentComponent,
    AddStudentComponent,
    ClassesComponent,
    CountBarComponent,
    HomeworkDialogComponent
  ],
  entryComponents: [
    HomeworkDialogComponent
  ],
  imports: [
    ChartsModule,
    MatListModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    StoreRouterConnectingModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation
    }),
    StoreModule.forRoot(reducers, {
      metaReducers
      // runtimeChecks: {
      //   strictStateImmutability: true,
      //   strictActionImmutability: true
      // }
    }),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    })
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

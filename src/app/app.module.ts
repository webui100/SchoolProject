import { TeacherJournalsComponent } from './containers/teacher-panel-journals/teacher-panel-journals.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClickStopPropagation } from './directives/click-stop-propagation.directive';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { storageSyncMetaReducer } from 'ngrx-store-persist';
import { TeachersComponent } from './components/teachers/teachers.component';
import { AdminComponent } from './pages/admin/admin.component';
import { reducers, metaReducers } from './store';
import { ScheduleComponent } from './containers/schedule/schedule.component';
import { DailyScheduleComponent } from './containers/schedule/daily-schedule/daily-schedule.component';
import { ClassesComponent } from './containers/classes/classes.component';
import {
  NavigationActionTiming,
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import 'hammerjs';
import { clearState } from './store/logout.reducer';
import { RequestPasswordComponent } from './containers/authorization/request-password/request-password.component';
import { LoginUserComponent } from './containers/authorization/login-user/login-user.component';
import { CustomSerializer } from './store/router.reducer';
import { CurrentUserComponent } from './components/current-user/current-user.component';
import { HeaderComponent } from './components/header/header.component';
import { TeacherSubjectsComponent } from './containers/teacher-panel-subjects/teacher-panel-subjects.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { AdminPanelComponent } from './containers/admin-panel/admin-panel.component';
import { ChartsModule } from 'ng2-charts';
import { TeacherCardComponent } from './components/teachers/teacher-card/teacher-card.component';
import { ErrorService } from './services/error.service';
import { StudentDiaryComponent } from './containers/student-diary/student-diary.component';
import { TeacherCreateComponent } from './components/teachers/teacher-create/teacher-create.component';
import { TemporaryComponent } from './components/temporary/temporary.component';
import { MaterialModule } from './modules/material/material.module';
import { ChartComponent } from './components/chart/chart.component';
import { AuthInterceptor } from './interсeptors/http-interceptor/auth-interceptor';
import { StudentsComponent } from './pages/students/students.component';
import { UpdateStudentComponent } from './pages/students/update-student/update-student.component';
import { CreateStudentComponent } from './pages/students/create-student/create-student.component';
import { SubjectsComponent } from './containers/subjects/subjects.component';
import { StudentComponent } from './pages/student/student.component';
import { CountBarComponent } from './components/count-bar/count-bar.component';
import { HomeworkDialogComponent } from './components/homework-dialog/homework-dialog.component';
import { NewYearComponent } from './containers/new-year/new-year.component';
import { TransferStudentsTableComponent } from './components/transfer-students-table/transfer-students-table.component';
import { TeachersContainerComponent } from './containers/teachers-container/teachers-container.component';
import { SortButtonComponent } from './components/sort-button/sort-button.component';
import { TransferedClassesTableComponent } from './components/transfered-classes-table/transfered-classes-table.component';
import { IsGraduationPipe } from './pipes/is-graduation.pipe';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { TeacherJournalComponent } from './components/teachers/teacher-journal/teacher-journal.component';
import { TeacherDetailContainerComponent } from './containers/teacher-detail-container/teacher-detail-container.component';
import { TeacherComponent } from './pages/teacher/teacher.component';
import { TeacherNavComponent } from './components/teacher-nav/teacher-nav.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NewYearControllComponent } from './components/new-year-controll/new-year-controll.component';
import { NewYearPipe } from './pipes/new-year.pipe';
import { LocaleHeaderPipe } from './pipes/locale-header.pipe';
import { UserProfileComponent } from './containers/user-profile/user-profile.component';
import { FormGeneratorComponent } from './components/form-generator/form-generator.component';
import { UrlSanitizerPipe } from './pipes/url-sanitizer.pipe';
import { getMatPaginatorUkr } from './utilities/mat-pagination-intl';
import { CustomErrorComponent } from './components/custom-error/custom-error.component';
import { ThemeButtonComponent } from './components/theme-button/theme-button.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';
import { MarkControllerComponent } from './containers/mark-controller/mark-controller.component';
import {
  MatPaginatorIntl,
  MatMenuModule,
  MatTabsModule,
  MatStepperModule
} from '@angular/material';
import { MarkComponentComponent } from './components/mark-component/mark-component.component';
import { AddMarkComponent } from './components/mark-component/add-mark/add-mark.component';
import { EditMarkComponent } from './components/mark-component/edit-mark/edit-mark.component';
import { LoadStudentsComponent } from './pages/students/load-students/load-students.component';
import { DisabledMarksComponent } from './components/mark-component/disabled-marks/disabled-marks.component';

import { TeacherPanelStatisticsComponent } from './containers/teacher-panel-statistics/teacher-panel-statistics.component';
import { JournalTableComponent } from './components/journal-table/journal-table.component';
import { JournalHomeworkDialogComponent } from './components/journal-homework-dialog/journal-homework-dialog.component';

import { ArrayFilterPipe } from './pipes/array-filter.pipe';

import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

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
    StudentsComponent,
    CreateStudentComponent,
    UpdateStudentComponent,
    StudentComponent,
    FormGeneratorComponent,
    ClassesComponent,
    CountBarComponent,
    HomeworkDialogComponent,
    NewYearComponent,
    TransferStudentsTableComponent,
    TeachersContainerComponent,
    SortButtonComponent,
    ClickStopPropagation,
    TransferedClassesTableComponent,
    IsGraduationPipe,
    ModalDialogComponent,
    TeacherJournalComponent,
    TeacherDetailContainerComponent,
    TeacherComponent,
    TeacherNavComponent,
    NotFoundComponent,
    NewYearControllComponent,
    UrlSanitizerPipe,
    NewYearPipe,
    LocaleHeaderPipe,
    UserProfileComponent,
    TeacherPanelStatisticsComponent,
    CustomErrorComponent,
    TeacherSubjectsComponent,
    TeacherJournalComponent,
    TeacherJournalsComponent,
    ThemeButtonComponent,
    ThemePickerComponent,
    JournalTableComponent,
    JournalHomeworkDialogComponent,
    MarkControllerComponent,
    MarkComponentComponent,
    AddMarkComponent,
    EditMarkComponent,
    DisabledMarksComponent,
    RequestPasswordComponent,
    LoginUserComponent,
    ArrayFilterPipe,
    LoadStudentsComponent
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    FormsModule,
    ReactiveFormsModule,

    HttpClientModule,
    PdfViewerModule,
    MaterialModule,
    MatMenuModule,
    MatTabsModule,
    MatStepperModule,

    FlexLayoutModule,
    StoreRouterConnectingModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation
    }),
    StoreModule.forRoot(reducers, {
      metaReducers: [storageSyncMetaReducer, clearState]
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
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    { provide: MatPaginatorIntl, useValue: getMatPaginatorUkr() }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalDialogComponent,
    TeachersComponent,
    TemporaryComponent,
    HomeworkDialogComponent,
    CustomErrorComponent,
    ThemePickerComponent,
    UserProfileComponent
  ]
})
export class AppModule {}

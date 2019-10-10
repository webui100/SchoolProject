import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { StudentDiaryService } from '../../services/student-diary.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { HomeworkDialogComponent } from '../homework-dialog/homework-dialog.component';
import { TeacherPanelService } from 'src/app/services/teacher-panel.service';


@Component({
  selector: 'webui-journal-homework-dialog',
  templateUrl: './journal-homework-dialog.component.html',
  styleUrls: ['./journal-homework-dialog.component.scss']
})
export class JournalHomeworkDialogComponent implements OnInit {

  @Input() lessonData: any;
  @Output() addHomework = new EventEmitter();

  hometaskVisible = false;
  @HostListener('document:keydown.escape', ['$event']) 
    onKeydownHandler(event: KeyboardEvent) {
    if (this.hometaskVisible) {
      this.hometaskVisible = false
    }
  }

  private destroyStream$ = new Subject<void>();
  public subject = new Subject<any | ArrayBuffer>();
  
  hometaskFieldTop: number;
  hometaskFieldLeft: number;
  homework: any;

  constructor(
    private studentDiary: StudentDiaryService,
    public dialog: MatDialog,
    private teacherPanelService: TeacherPanelService
    ) { }

  ngOnInit() {
  }
  
  getPosition(event): void {
    this.hometaskFieldLeft = event.srcElement.getBoundingClientRect().left;
    const maxLeft = window.innerWidth - 220;
    if (this.hometaskFieldLeft > maxLeft) {
      this.hometaskFieldLeft = maxLeft
    }
    this.hometaskFieldTop = event.srcElement.getBoundingClientRect().top 
      + event.srcElement.getBoundingClientRect().height;
  }

  downloadFile(lessonId: number): void {
    this.studentDiary.downloadHomeworkFile(lessonId);
  }

  openFile(lessonId: number): void {
    this.studentDiary.openHomeworkFile(lessonId)
      .pipe(takeUntil(this.destroyStream$))
      .subscribe(data => {
        this.dialog.open(HomeworkDialogComponent, {
          panelClass: 'custom-dialog-container',
          width: '90vw',
          height: '80vh',
          data
        });
      });
  }

  selectFile(event): void {
    const file: File = event.target.files[0];
    const type = file.type;
    const name = file.name;
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      this.homework = {
        fileType: type,
        fileName: name,
        fileData: `${reader.result}`.split(',')[1],
        homework: this.lessonData.homework.homework,
        idLesson: this.lessonData.homework.idLesson
      };
      this.postHomework();
    };
    reader.readAsDataURL(file);
  }

  saveHometask(hometask: string): void {
    this.studentDiary.openHomeworkFile(this.lessonData.idLesson)
      .pipe(takeUntil(this.destroyStream$))
      .subscribe(data => {
        this.homework = {
          fileData: data.fileData,
          fileName: data.fileName,
          fileType: data.fileType,
          homework: hometask,
          idLesson: this.lessonData.homework.idLesson
        }
        this.postHomework()
      });
  }
  
  clearHometask() {
    this.homework = {
      fileData: "",
      fileName: "",
      fileType: "",
      homework: "",
      idLesson: this.lessonData.homework.idLesson
    }
    this.postHomework()
  }

  postHomework() {
    this.teacherPanelService.postHomework(this.homework);
    this.addHomework.emit()
  }

}

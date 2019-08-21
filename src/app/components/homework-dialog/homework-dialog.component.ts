import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Lesson } from '../../models/diary.model';


@Component({
  selector: 'webui-homework-dialog',
  templateUrl: './homework-dialog.component.html',
  styleUrls: ['./homework-dialog.component.scss']
})
export class HomeworkDialogComponent implements OnInit {

  attachmentUrl: any;

  constructor(
    public dialogRef: MatDialogRef<HomeworkDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: Lesson
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.attachmentUrl = `data:${this.data.fileType};base64,${this.data.fileData}`;
  }

  showData() {
    // console.log('dialogRef', this.dialogRef);
    console.log('data', this.data);
  }
}

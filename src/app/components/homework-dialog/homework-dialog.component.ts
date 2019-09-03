import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'webui-homework-dialog',
  templateUrl: './homework-dialog.component.html',
  styleUrls: ['./homework-dialog.component.scss']
})
export class HomeworkDialogComponent implements OnInit {

  url: string;
  fileType: string;
  zoom = 1;

  constructor(
    public dialogRef: MatDialogRef<HomeworkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.url = `data:${this.data.fileType};base64,${this.data.fileData}`;
    this.setFileType();
  }

  setFileType(): void {
    if (this.data.fileType === 'application/pdf') {
      this.fileType = 'pdf';
    } else if (this.data.fileType.indexOf('image') === 0) {
      this.fileType = 'image';
    } else {
      this.fileType = 'unknown';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  zoomOut(): void {
    if (this.zoom > .3) {
      this.zoom -= .1;
    }
  }

  zoomIn(): void {
    if (this.zoom < 3) {
      this.zoom += .1;
    }
  }
}

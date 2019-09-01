import { TeachersService } from './../../services/teachers.service';
import { TeachersComponent } from './../../containers/teachers/teachers.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'webui-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {
  private message = this.data.message;
  private buttonText = this.data.buttonText;

  constructor(
    public dialogRef: MatDialogRef<TeachersComponent>,
    private teachServ: TeachersService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitModal(): void {
    if (this.data.id) {
    this.teachServ.deleteTeacher(this.data.id);
    } else {
      this.teachServ.sendTeachersList();
    }
  }

  ngOnInit() {}
}

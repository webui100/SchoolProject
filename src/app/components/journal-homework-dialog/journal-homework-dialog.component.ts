import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'webui-journal-homework-dialog',
  templateUrl: './journal-homework-dialog.component.html',
  styleUrls: ['./journal-homework-dialog.component.scss']
})
export class JournalHomeworkDialogComponent implements OnInit {

  @Input() lessonData: any;

  constructor() { }

  ngOnInit() {
  }

}

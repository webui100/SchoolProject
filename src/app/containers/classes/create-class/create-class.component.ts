import { Component, OnInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgZone, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClassesService } from '../../../services/classes.service';

@Component({
  selector: 'webui-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit {
  private addNewClass: FormGroup
  constructor(
    private _ngZone: NgZone,
    private classesService: ClassesService
  ) { }

  // addNewClass.get('isActive');
  onSubmit() {
    let newClassData = this.addNewClass.value;
    this.classesService.addClass(newClassData);
  }

  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  triggerResize() {
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.addNewClass = new FormGroup({
      className: new FormControl('', Validators.required),
      classYear: new FormControl('', Validators.required),
      isActive: new FormControl('', Validators.required),
      classDescription: new FormControl('', Validators.required)
    });
  }

}

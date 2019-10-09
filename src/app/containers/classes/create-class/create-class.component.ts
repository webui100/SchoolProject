import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClassesService } from '../../../services/classes.service';
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'webui-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss']
})
export class CreateClassComponent implements OnInit {
  private addNewClass: FormGroup
  constructor(
    private classesService: ClassesService,
    private ValidationService: ValidationService
  ) { }

  // addNewClass.get('isActive');
  onSubmit() {
    let newClassData = this.addNewClass.value;
    this.classesService.addClass(newClassData);
    this.addNewClass.reset();
  }

  ngOnInit() {
    this.addNewClass = new FormGroup({
      className: new FormControl('', [Validators.required, Validators.pattern(this.ValidationService.classNameRegExp)]),
      classYear: new FormControl('', [Validators.required,
                                      Validators.pattern(this.ValidationService.classYearRegExp),
                                      Validators.min(2000)]),
      isActive: new FormControl('', Validators.required),
      classDescription: new FormControl('')
    });
  }

}
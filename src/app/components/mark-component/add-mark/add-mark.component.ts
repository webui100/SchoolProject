import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ValidationService } from 'src/app/services/validation.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'webui-add-mark',
  templateUrl: './add-mark.component.html',
  styleUrls: ['./add-mark.component.scss']
})
export class AddMarkComponent implements OnInit {
  @Output() postData = new EventEmitter();
  private addMark: FormGroup;

  constructor(  private validServ: ValidationService,
                private formBuilder: FormBuilder) { }

  submitAdd(event) {
    event.preventDefault();
    this.postData.emit(this.addMark.value);
  }

  ngOnInit() {
    this.addMark = this.formBuilder.group({
      markType: ['', [Validators.required, Validators.pattern(this.validServ.markNameRegExp)]],
      description: [''],
      active: ['true', [Validators.required]]
    });
  }


}

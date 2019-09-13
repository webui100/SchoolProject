import { IMarkType } from 'src/app/models/mark-type.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValidationService } from 'src/app/services/validation.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'webui-edit-mark',
  templateUrl: './edit-mark.component.html',
  styleUrls: ['./edit-mark.component.scss']
})
export class EditMarkComponent implements OnInit {
  @Input() markType: IMarkType;
  @Output() putMark = new EventEmitter();
  private editMark: FormGroup;
  constructor(private validServ: ValidationService,
              private formBuilder: FormBuilder) { }

  submitEdit(e: Event): void {
    e.preventDefault();
    const data = this.editMark.value;
    data.id = this.markType.id;
    this.putMark.emit(data);
  }

  ngOnInit() {
    this.editMark = this.formBuilder.group({
      markType: [this.markType.markType, [Validators.required, Validators.pattern(this.validServ.markNameRegExp)]],
      description: [this.markType.description],
      active: [this.markType.active, [Validators.required]]
    });
  }

}

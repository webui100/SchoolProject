import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { NgForm, FormGroup } from "@angular/forms";
import { FormService } from "../../services/form.service";

import { Store, select } from "@ngrx/store";
import { selectAvatar } from "../../store/avatar/avatar.selectors";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { formatData } from "../../utilities/data-normalize-utils";
@Component({
  selector: "webui-form-generator",
  templateUrl: "./form-generator.component.html",
  styleUrls: ["./form-generator.component.scss"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "uk-UK" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class FormGeneratorComponent implements OnInit, OnDestroy {
  @Input() private formPattern: Array<Object>;
  @Input() private doReset: boolean;
  @Input() private initialValues;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private form: FormGroup;
  private avatar;

  @Output() formValuesEvent = new EventEmitter();

  constructor(
    private formService: FormService,
    private store: Store<{ avatar }>
  ) {}

  onSelectAvatar(e) {
    this.formService.loadAvatar(e);
    const observable = this.store.pipe(select(selectAvatar));
    observable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.avatar = data.avatar;
    });
  }

  onSubmit(formToReset: NgForm) {
    const formData = this.form.value;
    const formValuesToModify: Object = {
      dateOfBirth: this.formService.formatDateToValidString(
        formData.dateOfBirth
      ),
      avatar: this.avatar
    };
    const data = formatData(formValuesToModify, formData);

    this.formValuesEvent.emit(data);
    if (this.doReset) {
      formToReset.resetForm();
      this.form.reset();
      this.avatar = "../../../assets/images/no-user-image.png";
    }
  }

  ngOnInit() {
    this.form = this.formService.createFormGroupWithValidation(
      this.formPattern
    );
    if (this.initialValues) {
      this.form = this.formService.setValuesToForm(
        this.initialValues,
        this.form
      );
    }
    this.avatar = this.initialValues
      ? this.initialValues.avatar || "../../../assets/images/no-user-image.png"
      : "../../../assets/images/no-user-image.png";
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

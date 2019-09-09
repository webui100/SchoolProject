import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ValidationService } from "../services/validation.service";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { format, compareAsc } from "date-fns";
import { getAvatarAction } from "../store/avatar/avatar.actions";
import { environment } from "../../environments/environment";
import { NotificationService } from "./notification.service";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: "root"
})
export class FormService {
  BASE_URL = environment.APIEndpoint;
  constructor(
    private formValidation: ValidationService,
    private http: HttpClient,
    private notify: NotificationService,
    private store: Store<{ students }>
  ) {}

  formatDateToValidString(date) {
    return format(date, "YYYY-MM-DD");
  }
  loadAvatar(e): void {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = e => {
      this.store.dispatch(getAvatarAction({ avatar: reader.result }));
    };
  }

  setValuesToForm(initialValues: Object, form: FormGroup): FormGroup {
    Object.keys(form.value).forEach(controlName => {
      form.controls[controlName].patchValue(initialValues[controlName]);
    });

    return form;
  }

  createFormGroupWithValidation(formPattern): FormGroup {
    const formGroup = {};
    formPattern.forEach(formControl => {
      if (formControl.validation.required && formControl.validation.type) {
        formGroup[formControl.controlName] = new FormControl("", [
          Validators.required,
          Validators.pattern(this.formValidation[formControl.validation.type])
        ]);
      } else if (
        !formControl.validation.required &&
        formControl.validation.type
      ) {
        formGroup[formControl.controlName] = new FormControl(
          "",
          Validators.pattern(this.formValidation[formControl.validation.type])
        );
      } else if (
        formControl.validation.required &&
        !formControl.validation.type
      ) {
        formGroup[formControl.controlName] = new FormControl(
          "",
          Validators.required
        );
      } else {
        formGroup[formControl.controlName] = new FormControl("");
      }
    });
    return new FormGroup(formGroup);
  }
}

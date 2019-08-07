import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import {
  getStudentsAction,
  addStudentsAction,
  updateStudentsAction
} from "../store/students/students.action";
import { Store } from "@ngrx/store";
import { environment } from "../../environments/environment";
import { NotificationService } from "./notification.service";
@Injectable({
  providedIn: "root"
})
export class StudentsService {
  BASE_URL = environment.APIEndpoint;
  public observable;

  constructor(
    private http: HttpClient,
    private store: Store<{ students }>,
    private notify: NotificationService
  ) {}
  //Gets all students from class (id paramether)
  getStudents(id) {
    return this.http
      .get(`${this.BASE_URL}students/classes/${id}`)
      .subscribe(res => {
        this.store.dispatch(getStudentsAction({ students: res["data"] }));
      });
  }

  //Converts to ISO format and adds HOURS difference
  generateDate(formName, propName) {
    const date = new Date(formName.get(propName).value);
    date.setHours(date.getHours() + 10);
    return date.toISOString().slice(0, 10);
  }
  //Encrypts img to BASE64
  encImage(event) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.observable = new Observable(subscriber => {
      reader.onloadend = e => {
        subscriber.next(reader.result);
      };
    });
  }
  //updates student data
  updateStudentData(data) {
    return this.http
      .put(`${this.BASE_URL}admin/students/${data.id}`, data, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          "Access-Control-Allow-Origin": "*"
        }),
        observe: "response"
      })
      .subscribe(res => {
        if (res.status == 200) {
          this.notify.notifySuccess("Учень редагований");
          this.store.dispatch(updateStudentsAction({ editedStudent: data }));
        } else {
          this.notify.notifyFailure(
            `Помилка редагування. Статус: ${res.status}`
          );
        }
      });
  }
  //Adds student
  addStudent(data) {
    return this.http
      .post(`${this.BASE_URL}students`, data, {
        observe: "response"
      })
      .subscribe(res => {
        if (res.status == 200) {
          this.notify.notifySuccess("Учень доданий");
          this.store.dispatch(addStudentsAction({ addedStudent: data }));
        } else {
          this.notify.notifyFailure(`Помилка додавання. Статус: ${res.status}`);
        }
      });
  }
}

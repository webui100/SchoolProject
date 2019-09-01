import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import {
  getStudentsAction,
  createStudentsAction,
  updateStudentsAction
} from "../store/students/students.action";
import { Store } from "@ngrx/store";
import { environment } from "../../environments/environment";
import { NotificationService } from "./notification.service";
import { renameKeys } from "../utilities/data-normalize-utils";
@Injectable({
  providedIn: "root"
})
export class StudentsService {
  BASE_URL = environment.APIEndpoint;
  //Back end bug
  //In response sends invalid keys
  private newKeys = { firstName: "firstname", lastName: "lastname" };

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
        if (res["status"].code == 200) {
          this.store.dispatch(getStudentsAction({ students: res["data"] }));
        } else {
          this.notify.notifyFailure(
            `Помилка завантаження учнів. Статус: ${res["status"].code}`
          );
        }
      });
  }
  //updates student data
  updateStudentData(data, id) {
    return this.http
      .put(`${this.BASE_URL}admin/students/${id}`, data, {
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
          this.store.dispatch(
            updateStudentsAction({
              editedStudent: renameKeys(this.newKeys, res.body["data"])
            })
          );
        } else {
          this.notify.notifyFailure(
            `Помилка редагування. Статус: ${res.status}`
          );
        }
      });
  }
  //Creates student
  createStudent(data) {
    return this.http
      .post(`${this.BASE_URL}students`, data, {
        observe: "response"
      })
      .subscribe(res => {
        if (res.status == 200) {
          this.notify.notifySuccess("Учень доданий");
          this.store.dispatch(
            createStudentsAction({
              createdStudent: renameKeys(this.newKeys, res.body["data"])
            })
          );
        } else {
          this.notify.notifyFailure(`Помилка додавання. Статус: ${res.status}`);
        }
      });
  }
}

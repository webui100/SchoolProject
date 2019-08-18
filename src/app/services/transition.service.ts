import {environment} from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  constructor(private http: HttpClient) { }

  getStudents(id){
    return this.http.get(`${environment.APIEndpoint}students/classes/${id}`);
  }
}

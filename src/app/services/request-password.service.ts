import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RequestPasswordService {

  private BASE_URI = environment.APIEndpoint;

  constructor(private http: HttpClient,
              private router: Router,
              private _notify: NotificationService) {}

  requestPassword(userData) {
      return this.http
                  .get(`${this.BASE_URI}requestPasswordReset?query=${userData}`, {observe: 'response'});
  }

  notifyUser(dataMessage) {
    switch (dataMessage) {
      case 'Не вдалося знайти користувача з такими даними':
      case 'Для відновлення паролю зв\'яжіться з адміністратором':
        this._notify.notifyFailure(dataMessage);
        break;
      case 'Посилання для відновлення паролю відправлено на Вашу пошту':
        this._notify.notifySuccess(dataMessage);
        break;
      default:
        console.log('Знову якась помилка, наша команда рагулі');
    }
  }
}

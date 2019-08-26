import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {HttpErrorResponse} from '@angular/common/http';
import {Store} from '@ngrx/store';
import * as ErrorActions from '../store/error/error.actions';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar, private store: Store<{ errors }>) {

  }

  showError(message: string, error: Error): void {
    const snackRef = this.snackBar.open(message, '', {
      panelClass: ['error'],
      duration: 2300
    });

    snackRef.afterDismissed().subscribe(() => {
      this.store.dispatch(ErrorActions.removeErrorAction({error}));
    });
  }

  notifySuccess(message: string) {
    this.snackBar.open(message, '', {
      panelClass: ['success'],
      duration: 2300
    });
  }

  notifyFailure(message: string) {
    this.snackBar.open(message, '', {
      panelClass: ['failure'],
      duration: 2300
    });
  }

  errorParser(error: Error) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Битий токен';
      }
      switch (error.error.status.code) {
        case 400:
          return 'Ви ввели невірні дані';
        case 401:
          return 'Помилка авторизації';
        case 403:
          return 'Доступ заборонено';
        case 404:
          return 'Сторінку не знайдено';
        case 408:
          return 'Час очікування минув';
        case 500:
          return 'Помилка сервера';
        default:
          return 'Помилка';
      }
    } else {
      return 'Неопрацьована помилка';
    }
  }

}

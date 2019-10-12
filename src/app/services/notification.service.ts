import { CustomErrorComponent } from './../components/custom-error/custom-error.component';
import { Injectable, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { ComponentFactoryResolver } from '@angular/core';
import * as ErrorActions from '../store/error/error.actions';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public rootViewContainer: ViewContainerRef;

  constructor(public snackBar: MatSnackBar, private store: Store<{ errors }>,
    private factoryResolver: ComponentFactoryResolver, private auth: AuthService) {
  }

  setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }


  showError(message: string, error: Error): void {
    const factory = this.factoryResolver.resolveComponentFactory(CustomErrorComponent);
    const component = factory.create(this.rootViewContainer.injector);
    (<CustomErrorComponent>component.instance).error = error;
    (<CustomErrorComponent>component.instance).message = message;
    (<CustomErrorComponent>component.instance).componentRef = component;

    this.rootViewContainer.insert(component.hostView);
    component.changeDetectorRef.detectChanges();

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
          this.auth.signOut();
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

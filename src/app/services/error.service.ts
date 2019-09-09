import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as ErrorActions from '../store/error/error.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { errorsSelector } from '../store/error/error.selectors';
import { NotificationService } from './notification.service';

@Injectable()

export class ErrorService implements ErrorHandler {

  constructor(private inject: Injector) {

  }

  handleError(error: Error) {
    const store = this.inject.get(Store);
    const notify = this.inject.get(NotificationService);

    let errorList = [];
    const errorStoreRef = store.pipe(select(errorsSelector))
      .subscribe(errors => errorList = errors.errors);
    if (error instanceof HttpErrorResponse) {
      store.dispatch(ErrorActions.setErrorAction({ error }));
      notify.showError(notify.errorParser(error), error);
    } else {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    errorStoreRef.unsubscribe();

  }

}

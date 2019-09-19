import { Action } from '@ngrx/store';

export class ActionTypes {
    static LOGOUT = '[App] logout';
  }

export class Logout implements Action {
    readonly type = ActionTypes.LOGOUT;
  }

export function clearState(reducer) {
    return (state, action) => {
      if (action.type === ActionTypes.LOGOUT) {
        state = undefined;
      }
      return reducer(state, action);
    };
  }

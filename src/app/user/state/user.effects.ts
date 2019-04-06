import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { LoginService } from '../services/login.service';
import * as userActions from './user.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ResultStatus } from '../../user/models/userModel';

@Injectable()
export class UserEffects {
    constructor(private _loginSvc:LoginService, private actions$:Actions) { }

    @Effect()
    SetCurrentUser$: Observable<Action> = this.actions$.pipe(
        ofType(userActions.UserActionTypes.SetCurrentUser),
        switchMap((loginAction:userActions.SetCurrentUser) => this._loginSvc.Login(loginAction.payload).pipe(
            catchError((err:string) => of(new userActions.SetCurrentUserFail(err))),
            map((resStatus:ResultStatus) => (new userActions.SetCurrentUserSuccess(resStatus.Message)))
        ))
    );
}
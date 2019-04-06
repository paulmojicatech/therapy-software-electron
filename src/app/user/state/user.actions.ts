import { Action } from '@ngrx/store';
import { User } from '../models/userModel';

export enum UserActionTypes {
    SetCurrentUser = '[USER] Set current user',
    SetCurrentUserSuccess = '[USER] Set current user success',
    SetCurrentUserFail = '[USER] Set current user fail'
}

export class SetCurrentUser implements Action {
    constructor(public payload:{userName:string,password:string}){ }
    readonly type = UserActionTypes.SetCurrentUser;
}   

export class SetCurrentUserSuccess implements Action {
    constructor(public payload:string){ }
    readonly type = UserActionTypes.SetCurrentUserSuccess;
}

export class SetCurrentUserFail implements Action {
    constructor(public payload:string){ }
    readonly type = UserActionTypes.SetCurrentUserFail;
}

export type UserAction = SetCurrentUser |
    SetCurrentUserSuccess |
    SetCurrentUserFail;
import { Action } from '@ngrx/store';

export enum UserActionTypes {
    SetCurrentUser = '[USER] Set current user',
    SetCurrentUserSuccess = '[USER] Set current user success',
    UpdateMessage = '[USER] Update message',
    UpdateLoadStatus = '[USER] Update load status'
}

export class SetCurrentUser implements Action {
    constructor(public payload:{userName:string,password:string}){ }
    readonly type = UserActionTypes.SetCurrentUser;
}   

export class SetCurrentUserSuccess implements Action {
    constructor(public payload:string){ }
    readonly type = UserActionTypes.SetCurrentUserSuccess;
}

export class UpdateMessage implements Action {
    constructor(public payload:string) { }
    readonly type = UserActionTypes.UpdateMessage
}

export class UpdateLoadStatus implements Action {
    constructor(public payload:boolean) { }
    readonly type = UserActionTypes.UpdateLoadStatus;
}

export type UserAction = SetCurrentUser |
    SetCurrentUserSuccess |
    UpdateMessage |
    UpdateLoadStatus;
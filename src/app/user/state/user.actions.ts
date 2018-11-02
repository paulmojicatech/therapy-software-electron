import { Action } from '@ngrx/store';
import { User } from '../models/userModel';

export enum UserActionTypes {
    SetCurrentUser = '[USER] Set current user'
}

export class SetCurrentUser implements Action {
    constructor(public payload:User){ }
    readonly type = UserActionTypes.SetCurrentUser;
}   

export type UserAction = SetCurrentUser;
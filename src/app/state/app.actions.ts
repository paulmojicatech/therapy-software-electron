import { Action } from '@ngrx/store';
export enum AppActionTypes {
    UpdateMessage = '[APP] Update Message'
};

export class UpdateMessage implements Action {
    constructor(public payload:string){ }
    readonly type = AppActionTypes.UpdateMessage;
}

export type AppActions = UpdateMessage;
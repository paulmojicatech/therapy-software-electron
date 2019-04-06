import { Action } from '@ngrx/store';

export enum AppActionsType {
    UpdateMessage = '[APP] Update Message',
    UpdateLoadStatus = '[APP] Update Load Status'
}

export class UpdateMessage implements Action {
    constructor(public payload:string) { }
    readonly type = AppActionsType.UpdateMessage;
}

export class UpdateLoadStatus implements Action {
    constructor(public payload: boolean) { }
    readonly type = AppActionsType.UpdateLoadStatus;
}

export type AppActions = UpdateMessage |
    UpdateLoadStatus;
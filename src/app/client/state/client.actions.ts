import { Action } from '@ngrx/store';
import { Clients } from '../models/clientModel';

export enum ClientActionTypes {
    LoadClients = '[CLIENTS] Load Clients',
    LoadClientsSuccess = '[CLIENTS] Load Clients Success',
    LoadClientsFail = '[CLIENTS] Load Clients Fail',
    SetCurrentClient = '[CLIENTS] Set Current Client',
    UpdateClient = '[CLIENTS] Update Client',
    UpdateClientSuccess = '[CLIENTS] Update Client Success',
    UpdateClientFail = '[CLIENTS] Update Client Fail',
    LoadAvailableAppointments = '[CLIENTS] Load Available Appointments',
    LoadAvailableAppointmentsSuccess = '[CLIENTS] Load Available Appointments Success',
    LoadAvailableAppointmentsFail = '[CLIENTS] Load AvailableAppointments Fail'
}

export class LoadClients implements Action {
    constructor() { }
    readonly type = ClientActionTypes.LoadClients;
}

export class LoadClientsSuccess implements Action {
    constructor(public payload:Clients[]) { }
    readonly type = ClientActionTypes.LoadClientsSuccess;
}

export class LoadClientsFail implements Action {
    constructor(public payload:string) { }
    readonly type = ClientActionTypes.LoadClientsFail;
}

export class SetCurrentClient implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.SetCurrentClient;
}

export class UpdateClient implements Action {
    constructor(public payload:Clients) { }
    readonly type = ClientActionTypes.UpdateClient;
}

export class UpdateClientSuccess implements Action {
    constructor(public payload:Clients) { }
    readonly type = ClientActionTypes.UpdateClientSuccess;
}

export class UpdateClientFail implements Action {
    constructor(public payload:string) { }
    readonly type = ClientActionTypes.UpdateClientFail;
}

export class LoadAvailableAppointments implements Action {
    constructor(public payload:any) { }
    readonly type = ClientActionTypes.LoadAvailableAppointments;
}

export class LoadAvailableAppointmentsSuccess implements Action {
    constructor(public payload:Clients[]){ }
    readonly type = ClientActionTypes.LoadAvailableAppointmentsSuccess;
}

export class LoadAvailableAppointmentsFail implements Action {
    constructor(public payload:string) { }
    readonly type = ClientActionTypes.LoadAvailableAppointmentsFail;
}

export type ClientActions = LoadClients |
            LoadClientsSuccess | 
            LoadClientsFail |
            SetCurrentClient |
            UpdateClient | 
            UpdateClientSuccess |
            UpdateClientFail |
            LoadAvailableAppointments |
            LoadAvailableAppointmentsSuccess |
            LoadAvailableAppointmentsFail;
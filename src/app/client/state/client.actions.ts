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
    LoadClientAppointments = '[CLIENTS] Load Client Appointments',
    LoadClientAppointmentsSuccess = '[CLIENTS] Load Client Appointments Success',
    LoadClientAppointmentsFail = '[CLIENTS] Load Client Appointments Fail',
    AddClientAppointment = '[CLIENTS] Add Client Appointment',
    AddClientAppointmentSuccess = '[CLIENTS] Add Client Appointment Success',
    AddClientAppointmentFail = '[CLIENTS] Add Client Appointment Fail'
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

export class LoadClientAppointments implements Action {
    constructor(public payload:any) { }
    readonly type = ClientActionTypes.LoadClientAppointments;
}

export class LoadClientAppointmentsSuccess implements Action {
    constructor(public payload:Clients[]){ }
    readonly type = ClientActionTypes.LoadClientAppointmentsSuccess;
}

export class LoadClientAppointmentsFail implements Action {
    constructor(public payload:string) { }
    readonly type = ClientActionTypes.LoadClientAppointmentsFail;
}

export class AddClientAppointment implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.AddClientAppointment;
}

export class AddClientAppointmentSuccess implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.AddClientAppointmentSuccess;
}

export class AddClientAppointmentFail implements Action {
    constructor(public payload:string){ }
    readonly type = ClientActionTypes.AddClientAppointmentFail;
}

export type ClientActions = LoadClients |
            LoadClientsSuccess | 
            LoadClientsFail |
            SetCurrentClient |
            UpdateClient | 
            UpdateClientSuccess |
            UpdateClientFail |
            LoadClientAppointments |
            LoadClientAppointmentsSuccess |
            LoadClientAppointmentsFail |
            AddClientAppointment |
            AddClientAppointmentSuccess |
            AddClientAppointmentFail;
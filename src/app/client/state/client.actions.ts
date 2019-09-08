import { Action } from '@ngrx/store';
import { Clients, InsuranceCompanies, DischargeDetail } from '../models/clientModel';
import { IClientsDbModel } from '../models/clients-db.interface';

export enum ClientActionTypes {
    LoadClients = '[CLIENTS] Load Clients',
    LoadClientsSuccess = '[CLIENTS] Load Clients Success',
    SetCurrentClient = '[CLIENTS] Set Current Client',
    AddClient = '[CLIENTS] Add Client',
    AddClientSuccess = '[CLIENTS] Add Client Success',
    UpdateClient = '[CLIENTS] Update Client',
    UpdateClientSuccess = '[CLIENTS] Update Client Success',
    DeleteClient = '[CLIENTS] Delete Client',
    DeleteClientSuccess = '[CLIENTS] Delete Client Success',
    DischargeClient = '[CLIENTS] Discharge Client',
    DischargeClientSuccess = '[CLIENTS] Discharge Client Success',
    LoadClientAppointments = '[CLIENTS] Load Client Appointments',
    LoadClientAppointmentsSuccess = '[CLIENTS] Load Client Appointments Success',
    AddClientAppointment = '[CLIENTS] Add Client Appointment',
    AddClientAppointmentSuccess = '[CLIENTS] Add Client Appointment Success',
    DeleteClientAppointment = '[CLIENTS] Delete Client Appointment',
    DeleteClientAppointmentSuccess = '[CLIENTS] Delete Client Appointment Success',
    LoadInsuranceCompanies = '[CLIENTS] Load Insurance Companies',
    LoadInsuranceCompaniesSuccess = '[CLIENTS] Load Insurance Companies Success',
    UpdateLoadState = '[CLIENTS] Update Load State'
}

export class LoadClients implements Action {
    constructor() { }
    readonly type = ClientActionTypes.LoadClients;
}

export class LoadClientsSuccess implements Action {
    constructor(public payload:Clients[]) { }
    readonly type = ClientActionTypes.LoadClientsSuccess;
}

export class SetCurrentClient implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.SetCurrentClient;
}

export class AddClient implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.AddClient;
}

export class AddClientSuccess implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.AddClientSuccess;
}

export class UpdateClient implements Action {
    constructor(public payload:Clients) { }
    readonly type = ClientActionTypes.UpdateClient;
}

export class UpdateClientSuccess implements Action {
    constructor(public payload:Clients) { }
    readonly type = ClientActionTypes.UpdateClientSuccess;
}

export class DeleteClient implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.DeleteClient;
}

export class DeleteClientSuccess implements Action {
    constructor(public payload:Clients[]) { }
    readonly type = ClientActionTypes.DeleteClientSuccess;
}

export class DischargeClient implements Action {
    constructor (public payload: DischargeDetail){ }
    readonly type = ClientActionTypes.DischargeClient;
}

export class DischargeClientSuccess implements Action {
    constructor (public payload: Clients[]) { }
    readonly type = ClientActionTypes.DischargeClientSuccess
}

export class LoadClientAppointments implements Action {
    constructor(public payload:any) { }
    readonly type = ClientActionTypes.LoadClientAppointments;
}

export class LoadClientAppointmentsSuccess implements Action {
    constructor(public payload:Clients[]){ }
    readonly type = ClientActionTypes.LoadClientAppointmentsSuccess;
}

export class AddClientAppointment implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.AddClientAppointment;
}

export class AddClientAppointmentSuccess implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.AddClientAppointmentSuccess;
}

export class DeleteClientAppointment implements Action {
    constructor(public payload:number){ }
    readonly type = ClientActionTypes.DeleteClientAppointment;
}

export class DeleteClientAppointmentSuccess implements Action {
    constructor(public payload:Clients[]){ }
    readonly type = ClientActionTypes.DeleteClientAppointmentSuccess;
}

export class LoadInsuranceCompanies implements Action {
    constructor(){ }
    readonly type = ClientActionTypes.LoadInsuranceCompanies;
}

export class LoadInsuranceCompaniesSuccess implements Action {
    constructor(public payload:InsuranceCompanies[]){ }
    readonly type = ClientActionTypes.LoadInsuranceCompaniesSuccess;
}

export class UpdateLoadState implements Action {
    constructor(public payload:boolean){ }
    readonly type = ClientActionTypes.UpdateLoadState
}

export type ClientActions = LoadClients |
            LoadClientsSuccess | 
            SetCurrentClient |
            AddClient |
            AddClientSuccess |
            UpdateClient | 
            UpdateClientSuccess |
            DeleteClient |
            DeleteClientSuccess |
            DischargeClient |
            DischargeClientSuccess |
            LoadClientAppointments |
            LoadClientAppointmentsSuccess |
            AddClientAppointment |
            AddClientAppointmentSuccess |
            DeleteClientAppointment |
            DeleteClientAppointmentSuccess |
            LoadInsuranceCompanies |
            LoadInsuranceCompaniesSuccess;
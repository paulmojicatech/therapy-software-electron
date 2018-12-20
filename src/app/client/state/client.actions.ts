import { Action } from '@ngrx/store';
import { Clients, InsuranceCompanies } from '../models/clientModel';

export enum ClientActionTypes {
    LoadClients = '[CLIENTS] Load Clients',
    LoadClientsSuccess = '[CLIENTS] Load Clients Success',
    LoadClientsFail = '[CLIENTS] Load Clients Fail',
    SetCurrentClient = '[CLIENTS] Set Current Client',
    AddClient = '[CLIENTS] Add Client',
    AddClientSuccess = '[CLIENTS] Add Client Success',
    AddClientFail = '[CLIENTS] Add Client Fail',
    UpdateClient = '[CLIENTS] Update Client',
    UpdateClientSuccess = '[CLIENTS] Update Client Success',
    UpdateClientFail = '[CLIENTS] Update Client Fail',
    LoadClientAppointments = '[CLIENTS] Load Client Appointments',
    LoadClientAppointmentsSuccess = '[CLIENTS] Load Client Appointments Success',
    LoadClientAppointmentsFail = '[CLIENTS] Load Client Appointments Fail',
    AddClientAppointment = '[CLIENTS] Add Client Appointment',
    AddClientAppointmentSuccess = '[CLIENTS] Add Client Appointment Success',
    AddClientAppointmentFail = '[CLIENTS] Add Client Appointment Fail',
    DeleteClientAppointment = '[CLIENTS] Delete Client Appointment',
    DeleteClientAppointmentSuccess = '[CLIENTS] Delete Client Appointment Success',
    DeleteClientAppointmentFail = '[CLIENTS] Delete Client Appointment Fail',
    LoadInsuranceCompanies = '[CLIENTS] Load Insurance Companies',
    LoadInsuranceCompaniesSuccess = '[CLIENTS] Load Insurance Companies Success',
    LoadInsuranceCompaniesFail = '[CLIENTS] Load Insurance Companies Fail'
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

export class AddClient implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.AddClient;
}

export class AddClientSuccess implements Action {
    constructor(public payload:Clients){ }
    readonly type = ClientActionTypes.AddClientSuccess;
}

export class AddClientFail implements Action {
    constructor(public payload: string){ }
    readonly type = ClientActionTypes.AddClientFail;
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

export class DeleteClientAppointment implements Action {
    constructor(public payload:number){ }
    readonly type = ClientActionTypes.DeleteClientAppointment;
}

export class DeleteClientAppointmentSuccess implements Action {
    constructor(public payload:Clients[]){ }
    readonly type = ClientActionTypes.DeleteClientAppointmentSuccess;
}

export class DeleteClientAppointmentFail implements Action {
    constructor(public payload:string){ }
    readonly type = ClientActionTypes.DeleteClientAppointmentFail;
}

export class LoadInsuranceCompanies implements Action {
    constructor(public payload:InsuranceCompanies){ }
    readonly type = ClientActionTypes.LoadInsuranceCompanies;
}

export class LoadInsuranceCompaniesSuccess implements Action {
    constructor(public payload:InsuranceCompanies){ }
    readonly type = ClientActionTypes.LoadInsuranceCompaniesSuccess;
}

export class LoadInsuranceCompaniesFail implements Action {
    constructor(public payload:string){ }
    readonly type = ClientActionTypes.LoadInsuranceCompaniesFail;
}

export type ClientActions = LoadClients |
            LoadClientsSuccess | 
            LoadClientsFail |
            SetCurrentClient |
            AddClient |
            AddClientSuccess |
            AddClientFail |
            UpdateClient | 
            UpdateClientSuccess |
            UpdateClientFail |
            LoadClientAppointments |
            LoadClientAppointmentsSuccess |
            LoadClientAppointmentsFail |
            AddClientAppointment |
            AddClientAppointmentSuccess |
            AddClientAppointmentFail |
            DeleteClientAppointment |
            DeleteClientAppointmentSuccess |
            DeleteClientAppointmentFail |
            LoadInsuranceCompanies |
            LoadInsuranceCompaniesSuccess |
            LoadInsuranceCompaniesFail;
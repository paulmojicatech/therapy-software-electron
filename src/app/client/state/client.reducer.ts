import { Clients } from "../models/clientModel";
import { ClientActions, ClientActionTypes } from "./client.actions";

export interface ClientState {
    allClients: Clients[],
    currentClient: Clients,
    clientAppointments: Clients[],
    errorMsg?: string,
}

const initialState: ClientState = {
    allClients: [],
    currentClient: null,
    clientAppointments: []
};

export function reducer(state:ClientState = initialState, 
    action: ClientActions): ClientState {
        switch (action.type){
            case ClientActionTypes.LoadClientsSuccess:
                return {
                    ...state,
                    allClients: action.payload
                };
            case ClientActionTypes.LoadClientsFail:
                return {
                    errorMsg: action.payload,
                    ...state
                };
            case ClientActionTypes.SetCurrentClient:
                return {
                    ...state,
                    currentClient: action.payload
                };
            case ClientActionTypes.UpdateClientSuccess:
                const updatedClients = state.allClients.map(
                    c => c.GeneralDetails.ClientID === action.payload.GeneralDetails.ClientID ?
                        action.payload : c
                );
                return {
                    ...state,
                    allClients:updatedClients,
                    currentClient: action.payload
                };  
            case ClientActionTypes.UpdateClientFail:
                return {
                    ...state,
                    errorMsg: action.payload
                };
            case ClientActionTypes.LoadClientAppointmentsSuccess:
                return {
                    ...state,
                    clientAppointments: action.payload
                };
            case ClientActionTypes.LoadClientAppointmentsFail:
                return {
                    ...state,
                    errorMsg: action.payload
                };
            case ClientActionTypes.AddClientAppointmentSuccess:
                const updatedClientsApptsSuccess = state.allClients.map(
                    c => c.GeneralDetails.ClientID === action.payload.GeneralDetails.ClientID ?
                        action.payload : c
                );
                return {
                    ...state,
                    allClients: updatedClientsApptsSuccess
                };
            case ClientActionTypes.AddClientAppointmentFail:
                return {
                    ...state,
                    errorMsg: action.payload
                };
            case ClientActionTypes.DeleteClientAppointmentSuccess:
                return {
                    ...state,
                    allClients: action.payload
                };
            case ClientActionTypes.DeleteClientAppointmentFail:
                return {
                    ...state,
                    errorMsg: action.payload
                };
            default:
                return state;
        }
    }
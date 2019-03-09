import { Clients } from "../models/clientModel";
import { ClientActions, ClientActionTypes } from "./client.actions";
import { InsuranceCompanies } from "../models/clientModel";

export interface ClientState {
    allClients: Clients[],
    currentClient: Clients,
    clientAppointments: Clients[],
    allInsuranceCos:InsuranceCompanies[],
    isLoading: boolean
    msg?: string
}

const initialState: ClientState = {
    allClients: [],
    currentClient: null,
    clientAppointments: [],
    allInsuranceCos: [],
    isLoading: true
};

export function reducer(state:ClientState = initialState, 
    action: ClientActions): ClientState {
        switch (action.type){
            case ClientActionTypes.LoadClients:
            case ClientActionTypes.UpdateClient:
            case ClientActionTypes.LoadClientAppointments:
            case ClientActionTypes.AddClientAppointment:
            case ClientActionTypes.DeleteClientAppointment:
            case ClientActionTypes.AddClient:
            case ClientActionTypes.LoadInsuranceCompanies:
                return {
                    ...state,
                    isLoading: true
                }
            case ClientActionTypes.LoadClientsSuccess:
                return {
                    ...state,
                    allClients: action.payload,
                    isLoading: false
                };
            case ClientActionTypes.LoadClientsFail:
                return {
                    ...state,
                    msg: action.payload,
                    isLoading: false
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
                    currentClient: action.payload,
                    isLoading: false
                };  
            case ClientActionTypes.UpdateClientFail:
                return {
                    ...state,
                    msg: action.payload,
                    isLoading: false
                };
            case ClientActionTypes.LoadClientAppointmentsSuccess:
                return {
                    ...state,
                    clientAppointments: action.payload
                };
            case ClientActionTypes.LoadClientAppointmentsFail:
                return {
                    ...state,
                    msg: action.payload,
                    isLoading: false
                };
            case ClientActionTypes.AddClientAppointmentSuccess:
                const updatedClientsApptsSuccess = state.allClients.map(
                    c => c.GeneralDetails.ClientID === action.payload.GeneralDetails.ClientID ?
                        action.payload : c
                );
                return {
                    ...state,
                    allClients: updatedClientsApptsSuccess,
                    isLoading: false
                };
            case ClientActionTypes.AddClientAppointmentFail:
                return {
                    ...state,
                    msg: action.payload,
                    isLoading: false
                };
            case ClientActionTypes.DeleteClientAppointmentSuccess:
                return {
                    ...state,
                    allClients: action.payload,
                    isLoading: false
                };
            case ClientActionTypes.DeleteClientAppointmentFail:
                return {
                    ...state,
                    msg: action.payload,
                    isLoading: false
                };
            case ClientActionTypes.AddClientSuccess:
                return {
                    ...state,
                    allClients: [...state.allClients, action.payload],
                    isLoading: false
                }
            case ClientActionTypes.AddClientFail:
                return {
                    ...state,
                    msg: action.payload,
                    isLoading: false
                }
            case ClientActionTypes.LoadInsuranceCompaniesSuccess:
                return {
                    ...state,
                    allInsuranceCos: action.payload,
                    isLoading: false                 
                }
            case ClientActionTypes.LoadInsuranceCompaniesFail:
                return {
                    ...state,
                    msg: action.payload,
                    isLoading: false
                }
            default:
                return state;
        }
    }
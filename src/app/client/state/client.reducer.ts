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
            case ClientActionTypes.LoadClientsSuccess:
                return {
                    ...state,
                    allClients: action.payload
                };
            case ClientActionTypes.LoadClientsFail:
                return {
                    ...state,
                    msg: action.payload
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
                    msg: action.payload
                };
            case ClientActionTypes.DeleteClientSuccess:
                return {
                    ...state,
                    allClients: action.payload
                }
            case ClientActionTypes.DeleteClientFail:
                return {
                    ...state,
                    msg: action.payload
                }
            case ClientActionTypes.DischargeClientSuccess:
                return {
                    ...state,
                    allClients: action.payload
                }
            case ClientActionTypes.DischargeClientFail:
                return {
                    ...state,
                    msg: action.payload
                }
            case ClientActionTypes.LoadClientAppointmentsSuccess:
                return {
                    ...state,
                    clientAppointments: action.payload
                };
            case ClientActionTypes.LoadClientAppointmentsFail:
                return {
                    ...state,
                    msg: action.payload
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
                    msg: action.payload
                };
            case ClientActionTypes.DeleteClientAppointmentSuccess:
                return {
                    ...state,
                    allClients: action.payload
                };
            case ClientActionTypes.DeleteClientAppointmentFail:
                return {
                    ...state,
                    msg: action.payload
                };
            case ClientActionTypes.AddClientSuccess:
                return {
                    ...state,
                    allClients: [...state.allClients, action.payload]
                }
            case ClientActionTypes.AddClientFail:
                return {
                    ...state,
                    msg: action.payload
                }
            case ClientActionTypes.LoadInsuranceCompaniesSuccess:
                return {
                    ...state,
                    allInsuranceCos: action.payload
                }
            case ClientActionTypes.LoadInsuranceCompaniesFail:
                return {
                    ...state,
                    msg: action.payload
                }
            case ClientActionTypes.UpdateLoadState:
                return {
                    ...state,
                    isLoading: action.payload
                }
            default:
                return state;
        }
    }
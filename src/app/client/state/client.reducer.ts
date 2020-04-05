import { Clients } from "../models/clientModel";
import { ClientActions, ClientActionTypes } from "./client.actions";
import { InsuranceCompanies } from "../models/clientModel";
import { State } from '../../state/app.state';

export interface ClientState extends State {
    allClients: Clients[],
    currentClient: Clients,
    clientAppointments: Clients[],
    allInsuranceCos: InsuranceCompanies[],
    currentCalendarWeek: Date
}

const getInitialStartDay = (): Date => {
    
    const date = new Date();
    const day = date.getDay();
    let prevMonday;
    if(date.getDay() == 0){
        prevMonday = new Date().setDate(date.getDate() - 7);
    }
    else{
        prevMonday = new Date().setDate(date.getDate() - day);
    }

    return prevMonday;
};

const initialState: ClientState = {
    allClients: [],
    currentClient: null,
    clientAppointments: [],
    allInsuranceCos: [],
    currentCalendarWeek: getInitialStartDay()
};

export function reducer(state: ClientState = initialState,
    action: ClientActions): ClientState {
    switch (action.type) {
        case ClientActionTypes.LoadClients:
            return {
                ...state,
                isLoading: true
            };
        case ClientActionTypes.LoadClientsSuccess:
         
            const sortedClients = action.payload.sort((a, b) => {
                const textA = a.GeneralDetails.ClientName.toUpperCase();
                const textB = b.GeneralDetails.ClientName.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            return {
                ...state,
                isLoading: false,
                allClients: sortedClients
            };
        case ClientActionTypes.SetCurrentClient:
            return {
                ...state,
                currentClient: action.payload
            };
        case ClientActionTypes.UpdateClient:
            return {
                ...state,
                isLoading: true
            };
        case ClientActionTypes.UpdateClientSuccess:
            const updatedClients = state.allClients.map(
                c => c.GeneralDetails.ClientID === action.payload.GeneralDetails.ClientID ?
                    action.payload : c
            );
            return {
                ...state,
                allClients: updatedClients,
                isLoading: false,
                currentClient: action.payload
            };
        case ClientActionTypes.DeleteClient:
            return {
                ...state,
                isLoading: true
            };
        case ClientActionTypes.DeleteClientSuccess:
            const updatedClientsAfterDelete = state.allClients.filter(client => client.GeneralDetails.ClientID !== action.payload.ClientID);
            return {
                ...state,
                allClients: updatedClientsAfterDelete,
                isLoading: false
            };
        case ClientActionTypes.DischargeClient:
            return {
                ...state,
                isLoading: true
            };
        case ClientActionTypes.DischargeClientSuccess:
            return {
                ...state,
                allClients: action.payload,
                isLoading: false
            };
        case ClientActionTypes.LoadClientAppointments:
            return {
                ...state,
                isLoading: true
            };
        case ClientActionTypes.LoadClientAppointmentsSuccess:
            return {
                ...state,
                clientAppointments: action.payload,
                isLoading: false
            };
        case ClientActionTypes.AddClientAppointment:
            return {
                ...state,
                isLoading: true
            };
        case ClientActionTypes.AddClientAppointmentSuccess:
            let updatedClient = state.allClients.filter(c => c.GeneralDetails.ClientID === action.payload.clientId)[0];
            const sessionDetails = [...updatedClient.ClientSessionDetails, 
                { 
                    ClientSessionID: action.payload.clientSessionId, 
                    ClientSessionDate: action.payload.newClientSession
                }]
                .filter(session => session.ClientSessionID > -1);
            updatedClient = {...updatedClient, ClientSessionDetails: sessionDetails};
            const updatedClientsAfterAddClientSession = state.allClients.map(c => (c.GeneralDetails.ClientID === action.payload.clientId ? updatedClient : c));
            return {
                ...state,
                allClients: updatedClientsAfterAddClientSession,
                isLoading: false
            };
        case ClientActionTypes.DeleteClientAppointment:
            return {
                ...state,
                isLoading: true
            };
        case ClientActionTypes.DeleteClientAppointmentSuccess:
            const updatedClientsWithSessions = state.allClients.map(client => {
                if (!!client.ClientSessionDetails && client.GeneralDetails.ClientID === action.payload.clientId) {
                    const updatedSessions = client.ClientSessionDetails.filter(session => session.ClientSessionID !== action.payload.clientSessionId);
                    return {...client, ClientSessionDetails: updatedSessions};
                } else {
                    return client;
                }
            })
            return {
                ...state,
                allClients: updatedClientsWithSessions,
                isLoading: false
            };
        case ClientActionTypes.AddClient:
            return {
                ...state,
                isLoading: true
            };
        case ClientActionTypes.AddClientSuccess:
            const clientsWithAdd = [...state.allClients, action.payload];
            const sortedClientsWithAdd = clientsWithAdd.sort((a, b) => {
                const textA = a.GeneralDetails.ClientName.toUpperCase();
                const textB = b.GeneralDetails.ClientName.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            return {
                ...state,
                allClients: sortedClientsWithAdd,
                isLoading: false
            };
        case ClientActionTypes.LoadInsuranceCompanies:
            return {
                ...state,
                isLoading: true
            };
        case ClientActionTypes.LoadInsuranceCompaniesSuccess:
            return {
                ...state,
                allInsuranceCos: action.payload,
                isLoading: false
            };
        case ClientActionTypes.SetCurrentCalendarWeek:
            return {
                ...state,
                currentCalendarWeek: action.payload
            }
        default:
            return state;
    }
}
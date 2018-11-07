import { Clients } from "../models/clientModel";
import { ClientActions, ClientActionTypes } from "./client.actions";

export interface ClientState {
    allClients: Clients[],
    currentClient: Clients,
    errorMsg?: string
}

const initialState: ClientState = {
    allClients: [],
    currentClient: null
};

export function reducer(state:ClientState = initialState, 
    action: ClientActions): ClientState {
        switch (action.type){
            case ClientActionTypes.LoadClientsSuccess:
                return {
                    ...state,
                    allClients: action.payload
                }
            case ClientActionTypes.LoadClientsFail:
                return {
                    errorMsg: action.payload,
                    ...state
                }
            case ClientActionTypes.SetCurrentClient:
                return {
                    ...state,
                    currentClient: action.payload
                }
            case ClientActionTypes.UpdateClientSuccess:
                const updatedClients = state.allClients.map(
                    c => c.GeneralDetails.ClientID === action.payload.GeneralDetails.ClientID ?
                        action.payload : c
                );
                return {
                    ...state,
                    allClients:updatedClients,
                    currentClient: action.payload
                }  
            default:
                return state;
        }
    }
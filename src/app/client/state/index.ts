import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.reducer';

const getClientsFeatureState = createFeatureSelector<ClientState>('clients');

export const getLoadState = createSelector(
  getClientsFeatureState,
  state => state.isLoading  
);

export const getAllClients = createSelector(
    getClientsFeatureState,
    state => state.allClients
);

export const getCurrentClient = createSelector(
    getClientsFeatureState,
    state => state.currentClient
);

export const getErrorMsg = createSelector(
    getClientsFeatureState,
    state => state.msg
);

export const getClientAppointments = createSelector(
    getClientsFeatureState,
    state => state.clientAppointments
);

export const getInsuranceCompanies = createSelector(
    getClientsFeatureState,
    state => state.allInsuranceCos
);
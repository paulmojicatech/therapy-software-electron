import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.reducer';

const getClientsFeatureState = createFeatureSelector<ClientState>('clients');

export const getAllClients = createSelector(
    getClientsFeatureState,
    state => state.allClients
);

export const getCurrentClient = createSelector(
    getClientsFeatureState,
    state => state.currentClient
);
import { createFeatureSelector, createSelector, ActionReducerMap } from '@ngrx/store';
import { State } from '../../state/app.state';
import * as fromClient  from './client.reducer';

const getClientsFeatureState = createFeatureSelector<fromClient.ClientState>('clients');

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

export const getClientAppointments = createSelector(
    getClientsFeatureState,
    state => state.clientAppointments
);

export const getInsuranceCompanies = createSelector(
    getClientsFeatureState,
    state => state.allInsuranceCos
);

export const getCurrentCalendarWeek = createSelector(
    getClientsFeatureState,
    state => state.currentCalendarWeek
);
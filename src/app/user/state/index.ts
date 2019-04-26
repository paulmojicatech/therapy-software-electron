import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

const getUserFeatureState = createFeatureSelector<UserState>('users');

export const getCurrentUser = createSelector(
    getUserFeatureState, 
    state => state.currentUser
);

export const getLoadState = createSelector(
    getUserFeatureState,
    state => state.isLoading
);

import { User } from '../models/userModel';
import { UserAction, UserActionTypes } from './user.actions';

export interface UserState {
    currentUser:User;
}

const initialState:UserState = {
    currentUser: null
};

export function reducer(state: UserState = initialState, action:UserAction):UserState {
    switch (action.type){
        case UserActionTypes.SetCurrentUser:
            return {
                currentUser: action.payload
            };
        default:
            return state;
    }
}


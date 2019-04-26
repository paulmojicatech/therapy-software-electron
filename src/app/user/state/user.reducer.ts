import { State } from '../../state/app.state';
import { User } from '../models/userModel';
import { UserAction, UserActionTypes } from './user.actions';

export interface UserState extends State {
    currentUser:User;
}

const initialState:UserState = {
    currentUser: null,
    isLoading: false
};

export function reducer(state: UserState = initialState, action:UserAction):UserState {
    switch (action.type){
        case UserActionTypes.SetCurrentUser:
            return {
                ...state,
                isLoading:true
            };
        case UserActionTypes.SetCurrentUserSuccess:
            // TODO: FIX THIS
            const newUser:User = {
                name: '',
                email: '',
                token: action.payload
            };
            return {
                ...state, 
                isLoading: false,
                currentUser: newUser
            };
        default:
            return state;
    }
}


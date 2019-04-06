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
        case UserActionTypes.SetCurrentUserSuccess:
            // TODO: FIX THIS
            const newUser:User = {
                name: '',
                email: '',
                token: action.payload
            };
            return {
                ...state, 
                currentUser: newUser,
                isLoading: false,
                msg: 'Successfully logged in'
            };
        case UserActionTypes.SetCurrentUserFail:
            return {
                ...state,
                isLoading: false,
                msg: 'Login failed'
            };
        default:
            return state;
    }
}


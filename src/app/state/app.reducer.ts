import { State } from './app.state';
import { AppActions, AppActionsType } from './app.actions';

const initialState: State = {
    isLoading: false
};

export function reducer(state:State = initialState, action:AppActions): State {
    switch(action.type) {
        case AppActionsType.UpdateLoadStatus:
            return {
                ...state,
                isLoading: action.payload
            };
        case AppActionsType.UpdateMessage:
            return {
                ...state,
                msg: action.payload
            };
        default: 
            return state;
    }
}
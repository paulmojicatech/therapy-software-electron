import { UserState } from '../user/state/user.reducer';
import { ClientState } from '../client/state/client.reducer';

export interface State {
    msg?: string;
    isLoading: boolean;
}
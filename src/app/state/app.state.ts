import { UserState } from '../user/state/user.reducer';
import { ClientState } from '../client/state/client.reducer';

export interface State {
    user: UserState,
    client: ClientState,
    isLoading: boolean
}
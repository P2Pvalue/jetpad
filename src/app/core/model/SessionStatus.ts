

import { Session } from '.';

export const enum SessionState {

    login,
    logout,
    notallowed,
    error

}


export interface SessionStatus {

    state: SessionState;
    session: Session;

}

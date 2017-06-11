import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SessionStatus, SessionState, Session } from '../model';
import { SwellService } from '.';

declare let swellrt: any;

/**
 * Service to wrap SwellRT user sessions
 */
@Injectable()
export class SessionService {

    /**
     * Allow lazy subscription to the session subject.
     * Emits events when a session is started or stopped
     */
    public sessionSubject: ReplaySubject<SessionStatus> = new ReplaySubject(1);

    private session: Session;

    constructor(private swell: SwellService) {

    }

    /**
     * Return the session object if it exists. Undefined otherwise.
     */
    public getSession(): Session {
        return this.session;
    }

    /**
     * Try to resume a session or start default (anonymous) session.
     * If an anonymous session can't be started that is a severe error.
     */
    public startDefaultSession(): void {
        this.swell.getClient().resume({}).then( (s) => {
            this.setSession(s);
        }).catch( (e) => {

            this.swell.getClient().login({
                id: swellrt.Service.ANONYMOUS_USER_ID,
                password: ''
            }).then( (s) => {
                this.setSession(s);
            }).catch( () => {
                this.setError();
            });

        });
    }

    /**
     * Start a session for a particular user.
     * Async method, use {@link sessionSubject} to get the response.
     * @param userid the user id
     * @param pass the password
     */
    public startSession(userid: string, pass: string): void {
         this.swell.getClient().login({
                id: userid,
                password: pass
            }).then( (s) => {
                this.setSession(s);
            }).catch( () => {
                this.setNotAllowed();
            });
    }

    /**
     * Stop the session,
     */
    public stopSession(): void {
         this.swell.getClient().logout({
            }).then( () => {
                this.clearSession();
            }).catch( () => {
                this.clearSession();
            });
    }

    private setSession(newSession: any) {
        this.session = newSession;
        this.sessionSubject.next({ state: SessionState.login, session:  newSession });
    }

    private setError() {
        this.session = undefined;
        this.sessionSubject.next({ state: SessionState.error, session:  undefined });
    }

    private setNotAllowed() {
        this.session = undefined;
        this.sessionSubject.next({ state: SessionState.notallowed, session:  undefined });
    }

    private clearSession() {
        this.session = undefined;
        this.sessionSubject.next({ state: SessionState.logout, session:  undefined });
    }

}

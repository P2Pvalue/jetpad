import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { SessionStatus, SessionState, Session } from '../model';
import { SwellService } from '.';

/**
 * Wrap swellrt's current user session
 */
@Injectable()
export class SessionService {

    /**
     * Allow lazy subscription to the session subject.
     * Emits events when a session is started or stopped.
     */
    public subject: ReplaySubject<any> = new ReplaySubject(null);

    /** The active session. */
    private session: Session;

    constructor(private swell: SwellService) {
        this.session = undefined;
    }

    /**
     *  @return the session object if it exists. Undefined otherwise.
     */
    public getSession(): Session {
        return this.session;
    }

    /**
     * Try to resume a session or start default (anonymous) session.
     * If an anonymous session can't be started that is a severe error.
     *
     * @return Observable
     */
    public startDefaultSession(): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
            that.swell.getService().subscribe({
                next: (service) => {
                    if (service) {
                        service.resume({})
                            .then( (s) => {
                                that.setSession(s);
                                observer.next(s);
                                observer.complete();
                            })
                            .catch(() => {
                                service.login({
                                    id: SwellService.getSdk().Constants.ANONYMOUS_USER_ID,
                                    password: ''
                                }).then( (s) => {
                                    that.setSession(s);
                                    observer.next(s);
                                    observer.complete();
                                }).catch( () => {
                                    that.setError();
                                    observer.error();
                                    observer.complete();
                                });

                            });
                    }
                }
            });
        });
    }

    /**
     * Start a session for a particular user.
     * Async method, use {@link subject} to get the response.
     * @param userid the user id
     * @param pass the password
     * @return Observable
     */
    public startSession(userid: string, pass: string): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
            that.swell.getService().subscribe((service) => {
                if (service) {
                    service.login({id: userid, password: pass})
                        .then( (s) => {
                            that.setSession(s);
                            observer.next(s);
                            observer.complete();
                        }).catch( () => {
                        that.setNotAllowed();
                        observer.error();
                        observer.complete();
                    });
                }
            });
        });
    }

    /**
     * Stop the session,
     * @return Observable
     */
    public stopSession(): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
            that.swell.getService().subscribe((service) => {
                if (service) {
                    service.logout({})
                        .then( () => {
                            that.clearSession();
                            observer.complete();
                        }).catch( () => {
                        that.clearSession();
                        observer.error();
                        observer.complete();
                    });
                }
            });
        });
    }

    private setSession(newSession: any) {
        this.session = newSession;
        this.subject.next({ state: SessionState.login, session:  newSession });
    }

    private setError() {
        this.session = undefined;
        this.subject.next({ state: SessionState.error, session:  undefined });
    }

    private setNotAllowed() {
        this.session = undefined;
        this.subject.next({ state: SessionState.notallowed, session:  undefined });
    }

    private clearSession() {
        this.session = undefined;
        this.subject.next({ state: SessionState.logout, session:  undefined });
    }

}

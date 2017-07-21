import { Injectable, Inject } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { SessionStatus, SessionState, Session } from '../model';
import { SwellService } from '.';
import { AppState } from './app.service';

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
    private session: any;

    private swell;

    constructor(private swellService: SwellService,
                private appState: AppState) { }

    /**
     *  @return the session object if it exists. Undefined otherwise.
     */
    public getSession(): Session {
        return this.session;
    }

    public getSessionList(): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
            this.swellService.getService().subscribe((service) => {
                if (service) {
                    let promiseAsObservable = Observable.fromPromise(service.lisLogin());
                    promiseAsObservable.subscribe({
                        next: (s) => {
                            observer.next(s);
                        },
                        error: (error) => {
                            observer.error(error);
                            observer.complete();
                        }
                    });
                }
            });
        });
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
            this.swellService.getService().subscribe((service) => {
                if (service) {
                    let promiseAsObservable = Observable.fromPromise(service.resume({}));
                    promiseAsObservable.subscribe({
                        next: (s) => {
                            that.setSession(s);
                            observer.next(s);
                        },
                        error: (error) => {
                            observer.error(error);
                            observer.complete();
                        }
                    });
                }
            });
        });
    }

    public startAnonymousSession (): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
            that.swellService.getService().subscribe({
                next: (service) => {
                    if (service) {
                        service.login({
                            id: SwellService.getSdk().Constants.ANONYMOUS_USER_ID,
                            password: ''
                        }).then( (s) => {
                            let user = Object.assign({}, s, {anonymous: true});
                            that.setSession(user);
                            observer.next(user);
                            observer.complete();
                        }).catch( (error) => {
                            that.setError();
                            observer.error(error);
                            observer.complete();
                        });
                    }
                }
            });
        });
    }

    /**
     * Resume session with userid if userid is active in server.
     * @param userid
     * @returns {any}
     */
    public resumeSession(userid: string): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
            that.swell.resume({id: userid})
                .then( (user) => {
                    that.setSession(user);
                    observer.next(user);
                })
                .catch( (error) => {
                    that.setError();
                    observer.error(error);
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
            that.swellService.getService().subscribe((service) => {
                if (service) {
                    service.login({id: userid, password: pass})
                        .then( (s) => {
                            that.setSession(s);
                            observer.next(s);
                            observer.complete();
                        }).catch( (error) => {
                        that.setNotAllowed();
                        observer.error(error);
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
    public stopSession(userid?: string): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
            that.swellService.getService().subscribe((service) => {
                if (service) {
                    service.logout({id: userid})
                        .then( () => {
                            that.clearSession();
                            observer.complete();
                        }).catch( (error) => {
                            that.clearSession();
                            observer.error(error);
                            observer.complete();
                    });
                }
            });
        });
    }

    public setSession(newSession: any) {
        this.session = newSession;
        // this.appState.set('user', newSession);
        this.subject.next({ state: SessionState.login, session:  newSession });
    }

    private setError() {
        this.session = undefined;
        this.appState.set('user', null);
        this.subject.next({ state: SessionState.error, session:  undefined });
    }

    private setNotAllowed() {
        this.session = undefined;
        this.appState.set('user', null);
        this.subject.next({ state: SessionState.notallowed, session:  undefined });
    }

    private clearSession() {
        this.session = undefined;
        this.appState.set('user', null);
        this.subject.next({ state: SessionState.logout, session:  undefined });
    }

}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionEvent, Session } from '../model';

declare let SwellRT: any;

/**
 * Service to wrap SwellRT user sessions
 */
@Injectable()
export class SessionService {

    public sessionSubject: Subject<SessionEvent>;

    private session: Session;


    public getSession(): Session {
        return new Session();
    }

    public resumeSession(): void {
        console.log('resumeSession()');
    }

    public startSession(userid: string, password: string): void {
        console.log('startSession()');
    }

    public stopSession(): void {
        console.log('stopSession()');
    }


}

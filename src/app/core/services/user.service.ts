import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SwellService, ObjectService } from './index';
import { Observable, BehaviorSubject } from 'rxjs';
import { SessionService } from './x-session.service';

@Injectable()
export class UserService {

    public currentUser = new BehaviorSubject<any>(null);

    private user: any;

    private swell: any;

    constructor(private sessionService: SessionService,
                private swellService: SwellService,
                private objectService: ObjectService,
                @Inject('SWELLRT_DOMAIN') private SWELLRT_DOMAIN: string,
                @Inject('DEFAULT_USERNAME') private DEFAULT_USERNAME: string,
                @Inject('DEFAULT_PASSWORD') private DEFAULT_PASSWORD: string,
                @Inject('RECOVER_PASSWORD_URL') private RECOVER_PASSWORD_URL: string) {
        this.swellService.getService().subscribe((service) => {
            if (service) {
                this.swell = service;
            }
        });
    }

    public generateDomainId(id: string) {
        return id + '@' + this.SWELLRT_DOMAIN;
    }

    public getUser() {
        return this.user;
    }

    public loggedUser() {
        return this.user && !this.user.anonymous;
    }

    public getSession() {
        return this.sessionService.getSession();
    }

    public resumeSession(id: string) {
        return this.sessionService.resumeSession(id);
    }

    public resume() {
        return this.sessionService.startDefaultSession()
            .map((user) => {
                this.user = this.parseUserResponse(user);
                this.currentUser.next(this.user);
                return this.user;
            });
    }

    public getUserProfiles(users) {
        return Observable.create((observer) => {
            this.swell.getUserProfile(users, (result) => {
                if (result.error) {
                    observer.error(result.error);
                } else if (result.data) {
                    observer.next(result.data);
                }
            });
        });
    }

    public anonymousLogin() {
        return this.sessionService.startDefaultSession()
            .map((user) => this.parseUserResponse(user));
    }

    public getLastDocument() {
        return Observable.create((observer) => {
            this.objectService.lastDocument.subscribe((document) => {
                if (document) {
                    observer.next(document);
                }
            });
        });
    }

    public login(id: string, password: string) {
        return this.sessionService.startSession(id, password)
            .map((user) => {
                this.user = this.parseUserResponse(user);
                this.currentUser.next(this.user);
                return this.user;
            });
    }

    public create(id: string, password: string, email: string) {
        let user = {
            id: this.generateDomainId(id),
            name: id,
            password,
            email
        };
        return Observable.create((observer) => {
            this.swell.createUser(user)
                .then((result) => {
                    if (result) {
                        this.login(result.id, password).map((userLogged) => {
                            this.user = this.parseUserResponse(userLogged);
                            this.currentUser.next(this.user);
                            observer.next(this.user);
                        });
                    }
                    observer.complete();
                }).catch( (error) => {
                    observer.error(error);
                    observer.complete();
                });
        });
    };

    public update(email: string, name: string, avatarData: string) {
        return Observable.create((observer) => {
            // TODO updateUserProfile does not exist!!!!
            this.swell.updateUserProfile({email, name, avatarData}, (result) => {
                if (result.error) {
                    // ERROR
                } else if (result.data) {
                    let user = this.parseUserResponse(result.data);
                    observer.next(user);
                }
            });
        });
    }

    public logout(userid?: string) {
        this.currentUser.next(null);
        return this.sessionService.stopSession(userid);
    }

    public changePassword(oldPassword: string, newPassword: string) {
        return Observable.create((observer) => {
            this.currentUser.subscribe((user) => {
                if (user && !user.anonymous) {
                    // TODO setPassword does not exits!!!!
                    this.swell.setPassword(user.id, oldPassword, newPassword)
                        .then(() => observer.next())
                        .catch((error) => observer.error(error));
                }
            });
        });
    }

    public recoverPassword(email: string) {
        return Observable.create((observer) => {
            this.swell.recoverPassword(email, this.RECOVER_PASSWORD_URL,
                () => observer.next(), (error) => observer.error(error));
        });
    }

    // TODO ensure date retrived from server
    private parseUserResponse(user) {
        let name = user.name;
        if (/_anonymous_/.test(user.id)) {
            name = 'Anonymous';
        }
        return {
            id: user.id,
            email: user.email,
            name: name ? name : user.id.slice(0, user.id.indexOf('@')),
            anonymous: name === 'Anonymous',
            avatarUrl: user.avatarUrl,
            domain: user.domain,
            locale: user.locale,
            session: user.sessionId,
            transientSessionId: user.transientSessionId
        };
    }
}

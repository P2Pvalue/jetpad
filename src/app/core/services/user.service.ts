import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SwellService, ObjectService } from './index';
import { Observable } from 'rxjs';
import { SessionService } from './x-session.service';

@Injectable()
export class UserService {

    public currentUser = new Subject<any>();
    public userLogged = new Subject<any>();
    public userUpdated = new Subject<any>();

    public session: Promise<any>;

    private user: any;

    constructor(private sessionService: SessionService,
                private objectService: ObjectService,
                @Inject('SWELLRT_DOMAIN') private SWELLRT_DOMAIN: string,
                @Inject('DEFAULT_USERNAME') private DEFAULT_USERNAME: string,
                @Inject('DEFAULT_PASSWORD') private DEFAULT_PASSWORD: string,
                @Inject('RECOVER_PASSWORD_URL') private RECOVER_PASSWORD_URL: string) {    }

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
        return this.session;
    }

    public resume() {
        return Observable.create((observer) => {
            SwellService.getSdk().resume((result) => {
                if (result.error) {
                    let id = this.DEFAULT_USERNAME;
                    let password = this.DEFAULT_PASSWORD;
                    SwellService.getSdk().login({id, password}, (r) => {
                        if (r.error) {
                            observer.error(r.error);
                        } else if (r.data) {
                            let user = this.parseUserResponse(r.data);
                            this.user = user;
                            observer.next(user);
                        }
                    });
                } else if (result.data) {
                    let user = this.parseUserResponse(result.data);
                    this.user = user;
                    observer.next(user);
                }
            });
        });
    }

    public getUserProfiles(users) {
        return Observable.create((observer) => {
            SwellService.getSdk().getUserProfile(users, (result) => {
                if (result.error) {
                    observer.error(result.error);
                } else if (result.data) {
                    observer.next(result.data);
                }
            });
        });
    }

    public anonymousLogin() {
        return this.sessionService.startDefaultSession();
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
        return this.sessionService.startSession(id, password);
    }

    public create(id: string, password: string, email: string) {
        let user = {
            id: this.generateDomainId(id),
            password,
            email
        };
        return Observable.create((observer) => {
            SwellService.getSdk().createUser(user, (result) => {
                if (result.error) {
                    observer.error(result.error);
                    observer.complete();
                } else if (result.data) {
                    this.sessionService.startSession(id, password)
                        .subscribe((createdUser) => observer.next(createdUser));
                }
            });
        });
    };

    public update(email: string, name: string, avatarData: string) {
        return Observable.create((observer) => {
            SwellService.getSdk().updateUserProfile({email, name, avatarData}, (result) => {
                if (result.error) {
                    // ERROR
                } else if (result.data) {
                    let user = this.parseUserResponse(result.data);
                    observer.next(user);
                }
            });
        });
    }

    public logout() {
        return this.sessionService.stopSession();
    }

    public changePassword(oldPassword: string, newPassword: string) {
        return Observable.create((observer) => {
            SwellService.getSdk().setPassword(this.user.id, oldPassword, newPassword,
                () => observer.next(), (error) => observer.error(error));
        });
    }

    public recoverPassword(email: string) {
        return Observable.create((observer) => {
            SwellService.getSdk().recoverPassword(email, this.RECOVER_PASSWORD_URL,
                () => observer.next(), (error) => observer.error(error));
        });
    }

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
            avatarUrl: user.avatarUrl
        };
    }
}

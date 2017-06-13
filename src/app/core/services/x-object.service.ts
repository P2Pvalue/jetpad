
import { Injectable, } from '@angular/core';
import { SwellService } from '.';
import { Observable } from 'rxjs';
import { SessionService } from "./x-session.service";

/**
 * Wraps SwellRT operations related with objects as open and close in an observable.
 */
@Injectable()
export class ObjectService {

    /**
     * Creates an observable that subcription executes the open method of
     * swell service instance.
     *
     * @param objectid the object identifier.
     * @return Observable of open execution.
     */
    public open(objectid: string): Observable<any> {
        let that = this;
        return Observable.create(function subscribe (observer) {
            that.session.subject.subscribe({
                next: (session) => {
                    that.swell.getClient().subscribe({
                        next: (service) => {
                            service.open({id:objectid})
                                .then( obj => {
                                    observer.next(obj.controller);
                                    observer.complete();
                                })
                                .catch( err => {
                                    observer.error(err);
                                    observer.complete();
                                })
                        }
                    });
                }
            })
        });
    }

    /**
     * Close an object with objectid.
     * TODO: review if it is neccessary ensure the session before execute close method.
     * @param objectid the object indentifier
     * @returns void
     */
    public close(objectid: string): void {
        return this.swell.getClient().subscribe((service) => {
            service.close(objectid);
        })
    }

    constructor(private swell: SwellService, private session: SessionService) {    }
}

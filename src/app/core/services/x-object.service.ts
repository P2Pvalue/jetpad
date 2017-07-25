import { Injectable, } from '@angular/core';
import { SwellService } from '.';
import { Observable, BehaviorSubject } from 'rxjs';
import { SessionService } from './x-session.service';

/**
 * Wraps swellrt operations related with objects.
 */
@Injectable()
export class ObjectService {

    public lastDocument: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private swell: SwellService, private session: SessionService) {    }

    /**
     * Creates an observable that subcription executes the open method of
     * swell service instance.
     *
     * @param objectid the object identifier.
     * @return Observable of open execution.
     */
    public open(objectid: string): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
            that.swell.getService().subscribe({
                next: (service) => {
                    if (service) {
                        service.open({id: objectid})
                            .then( (object) => {
                                that.lastDocument.next(object);
                                observer.next(object);
                                observer.complete();
                            })
                            .catch( (err) => {
                                // TODO errors are not propagated
                                observer.error(err);
                                observer.complete();
                            });
                    }
                }
            });
        });
    }

    /**
     * Close an object with objectid.
     * TODO: review if it is neccessary ensure the session before execute close method.
     * @param objectid the object indentifier
     * @returns void
     */
    public close(objectid: string): void {
        return this.swell.getService().subscribe((service) => {
            service.close(objectid);
        });
    }
}

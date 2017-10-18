import { Injectable, } from '@angular/core';
import { SwellService } from '.';
import { Observable, BehaviorSubject } from 'rxjs';
import { SessionService } from './session.service';

/**
 * Wraps swellrt operations related with objects.
 */
@Injectable()
export class ObjectService {

    public lastDocument: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private swell: SwellService, private session: SessionService) {    }

    /**
     * Open or create an object.
     *
     * @param objectid the object identifier (optional)
     * @return Promise resolved to the object if success
     */
    public open(objectid: string): Promise<any> {
        let that = this;

        return this.swell.get()
        .then( (service) => {
            return service.open(objectid ? { id: objectid } : {});
        }).then( (object) => {
            that.lastDocument.next(object);
            return object;
        });
    }

    /**
     * Close an object with objectid.
     * TODO: review if it is neccessary ensure the session before execute close method.
     * @param objectid the object indentifier
     * @returns void
     */
    public close(objectid: string): void {
        this.swell.get().then( (service) => {
            service.close(objectid);
        });
    }
}


import { Injectable, } from '@angular/core';
import { SwellService } from '.';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ObjectService {

    /** Get the active SwellRT object in the application */
    public objectSubject: ReplaySubject<any> = new ReplaySubject(1);

    constructor(private swell: SwellService) {

    }

    /**
     * Open or create a SwellRT object with the provided id.
     *
     * @param objectid the object identifier.
     * @return promise to the object.
     */
    public open(objectid: string): Promise<any> {

        let openPromise: Promise<any> = new Promise<any>(
            (resolve, reject) => {

                this.swell.getClient().open({
                    id: objectid
                }).then( (object) => {
                    this.objectSubject.next(object);
                    resolve(object);
                }).catch( (error) => {
                    reject(error);
                });

            });

        return openPromise;
    }

    public close(objectid: string): void {
        return this.swell.getClient().close(objectid);
    }


}

import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ConnectionStatus } from '../model';

// the global swellrt namespace
declare let swellrt: any;

/**
 * Wrap swellrt service client
 */
@Injectable()
export class SwellService {

    /** Emits events when connection status changes */
    public connectionSubject: Subject<ConnectionStatus> = new Subject<ConnectionStatus>();

    /** Emits event when service instance is available */
    public serviceSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    /** The swellrt's service instance */
    private service: any = null;

    /** The swellrt's service instance as promise */
    private servicePromise: Promise<any> = new Promise((resolve, reject) => {{
        swellrt.onReady((s) => {
            console.log('swellrt client ready');
            resolve(s);
        });
        setTimeout(() => {
            reject(new Error('Timeout error loading swellrt client (15s)'));
        }, 15000);
    }});

    /**
     * Kickoff the instance of swellrt service.
     * Set up the connection handler.
     * Notify to subjet that service instance is ready.
     *
     * @returns void
     */
    public startUp(): void {
        Observable.fromPromise(this.servicePromise).subscribe(
            (service) => {
                this.service = service;
                this.service.addConnectionHandler(
                    (s, e) => this.connectionSubject.next({state: s, error: e}));
                this.serviceSubject.next(service);
            }
        );
    };

    /**
     * @returns service$
     */
    public getService(): any {
        return Observable.fromPromise(this.servicePromise);
    }

    /**
     * @returns swellrt sdk object
     */
    public getSdk(): any {
        return swellrt;
    }
}

export function swellServiceInitializerFactory(swellService: SwellService) {
    return () => swellService.startUp();
}

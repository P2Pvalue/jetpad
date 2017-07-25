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

    public static getSdk() {
        return swellrt;
    }

    /** Emits events when connection status changes */
    public connectionSubject: Subject<ConnectionStatus> = new Subject<ConnectionStatus>();

    /** Emits event when service instance is available */
    public serviceSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    /** The swellrt's service instance */
    private service: any = null;

    /**
     * Kickoff the instance of swellrt service.
     * Set up the connection handler.
     * Notify to subjet that service instance is ready.
     *
     * @returns void
     */
    public startUp(): Promise<any> {
        return new Promise((resolve, reject) => {{
            swellrt.onReady((s) => {
                console.log('swellrt client ready');
                resolve(s);
            });
            setTimeout(() => {
                reject(new Error('Timeout error loading swellrt client (15s)'));
            }, 15000);
        }})
            .then((service) => {
                this.service = service;
                this.service.addConnectionHandler(
                    (s, e) => this.connectionSubject.next({state: s, error: e}));
                this.serviceSubject.next(service);
            }).catch((error) => console.error('Error loading Swellrt'));
    };

    /**
     * @returns service$
     */
    public getService(): any {
        return this.serviceSubject;
    }

    public getInstance() {
        return this.service;
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

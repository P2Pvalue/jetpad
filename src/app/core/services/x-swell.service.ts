import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConnectionStatus } from '../model';

declare let swellrt: any;

/**
 * Wrap SwellRT client library, and provide start up
 * logic.
 *
 */
@Injectable()
export class SwellService {

    /** Emits event on Swell is ready */
    public readySubject: Subject<boolean> = new Subject<boolean>();

    /** Emits event when connection status changes */
    public connectionSubject: Subject<ConnectionStatus> = new Subject<ConnectionStatus>();

    /** Reference to SwellRT API client instance */
    private swellClientInstance: any;

    /**
     * Wait for the SwellRT's client script to load, then
     * populate the service's instance.
     *
     * @param timeout in miliseconds
     */
    public startUp(timeout: number): void {

       let loadPromise: Promise<any> = new Promise(
            (resolve, reject) => {
                swellrt.onReady( (s) => {
                resolve(s);
                });

                setTimeout( () => {
                    reject(new Error('Timeout error loading SwellRT client (' + timeout + ')'));
                }, timeout);
            }
        );

       loadPromise.then( (instance) => {

           this.swellClientInstance = instance;
           this.swellClientInstance.addConnectionHandler((s, e) => {
            this.connectionSubject.next({
                state: s,
                error: e
            });
           });

           this.readySubject.next(true);

        }).catch( (error) => {
            this.readySubject.next(false);
        });

    }

    public getClient(): any {
        return this.swellClientInstance;
    }


}

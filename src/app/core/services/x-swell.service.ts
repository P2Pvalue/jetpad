import { Injectable } from '@angular/core';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
import { ConnectionStatus } from '../model';

// the global swellrt library
declare let swellrt: any;

/**
 * Wrap SwellRT client library, and provide start up
 * logic.
 *
 */
@Injectable()
export class SwellService {

    /** Emits events when connection status changes */
    public connectionSubject: Subject<ConnectionStatus> = new Subject<ConnectionStatus>();

    public clientSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    /** Reference to SwellRT API client instance */
    private swellClientInstance: any = null;

    private service: Promise<any> = new Promise((resolve, reject) => {{
        swellrt.onReady((s) => {
            console.log('swellrt client ready');
            resolve(s);
        });
        setTimeout(() => {
            reject(new Error('Timeout error loading swellrt client (15s)'));
        }, 15000);
    }});

    /**
     * Observable that its subscriptions ensures the existence of swell service
     * instance client creating a new one if nothing
     * exists or returning the existed one.
     * Wait for the SwellRT's client script to load, then
     * populate the service's instance.
     */
    private swellInstanceObservable$ = Observable.create((observer) => {
        if (!this.swellClientInstance) {
            setTimeout(() => {
                observer.error(new Error('Timeout error loading SwellRT client'));
                observer.complete();
            }, 15000);
            swellrt.onReady((s) => {
                this.swellClientInstance = s;
                observer.next(s);
                observer.complete();
            });
        } else {
            observer.next(this.swellClientInstance);
            observer.complete();
        }
    });

    /**
     * Kickoff the instance of swell service subscripting to swellInstanceObservable$.
     * Set up the connection handle
     * mechanism that notifies its changes via connectionSubject.
     *
     * @returns void
     */
    public startUp(): void {
        Observable.fromPromise(this.service).subscribe(
            (service) => {
                this.swellClientInstance = service;
                this.swellClientInstance.addConnectionHandler(
                    (s, e) => this.connectionSubject.next({state: s, error: e}));
                this.clientSubject.next(service);
            }
        );
    };

    /**
     * @returns swellInstanceObservable$
     */
    public getClient(): any {
        return this.clientSubject;
    }

    /**
     * @returns Swellrt sdk object
     */
    public getSdk(): any {
        return swellrt;
    }
}

export function swellServiceInitializerFactory(swellService: SwellService) {
    return () => swellService.startUp();
}

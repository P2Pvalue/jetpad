import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SwellService, SessionService, ObjectService, EditorService } from './core/services';
import { Session, SessionStatus, SessionState, ConnectionStatus } from './core/model';

declare let swellrt: any;
declare let document: any;
declare let window: any;

export enum State {
    New,
    Ready,
    Authenticated,
    ObjectLoaded,
    Editor
};

@Component({
  selector: 'check',
  styles: [ ],
  templateUrl: './check.component.html'
})
export class CheckComponent implements OnInit {

    // TODO why doesn't work this?
    @ViewChild('editorContainer') public editorContainer: ElementRef;

    // State
    public State = State; // make enum visible to template
    public state: State = State.New;

    public swellClient: any;
    public swellSession: any;
    public swellObject: any;

    // Login Form
    public loginFormUserid: string = '_anonymous_';
    public loginFormPassword: string = '';

    // Object Form
    public loadFormObjectId: string;

    // Result Toast
    public showResultToast: boolean = false;
    public resultToastText: string;

    private text: any;

    constructor(private swellSrv: SwellService,
                private sessionSrv: SessionService,
                private objectSrv: ObjectService,
                private editorSrv: EditorService) {
        // nothing to do
    }

    public ngOnInit() {
        /*this.swellSrv.getClient().subscribe( (service) => {
            this.swellClient = service;
            this.changeState(State.Ready);
            this.init();
        });*/
    }

    public login(): void {
        this.sessionSrv.startSession(this.loginFormUserid, this.loginFormPassword);
    }

    public resume(): void {
        this.sessionSrv.startDefaultSession();
    }

    public logout(): void {
        this.sessionSrv.stopSession();
    }

    public open(): void {
        /*this.objectSrv.open(this.loadFormObjectId)
        .then( (o) => {
            this.swellObject = o.controller;
            this.changeState(State.ObjectLoaded);
        }).catch( (e) => {
            this.swellObject = undefined;
            this.changeState(State.Authenticated, 'Error opening object ' + e);
        });*/
    }

    public close(): void {
        this.objectSrv.close(this.swellObject.getId());
        this.changeState(State.Authenticated, 'Object closed ');
    }

    public edit(): void {

        // Check whether the object has text property
        this.text = this.swellObject.get('text');
        if (!this.text) {
            this.swellObject.put('text', swellrt.Text.create('This is a empty text object'));
            this.text = this.swellObject.get('text');
        }

        //this.editorSrv.attachText(this.text);
    }

    private init(): void {

        //
        // Listen for changes in session
        //
        this.sessionSrv.subject.subscribe( (status) => {
            if (status.state === SessionState.login) {
                this.changeState(State.Authenticated);
                this.swellSession = status.session;
            } else {
                this.changeState(State.Ready, 'Session closed');
                this.swellSession = undefined;
            }
        });

        //
        // Listen changes in caret styles
        //
        this.editorSrv.selectionStyles$.subscribe( (styles) => {
            for (let s in styles) {
                if (styles[s]) {
                    console.log(styles[s].name + '=' + styles[s].value);
                }
            }
        });

    }

    private changeState(newState: State, toastMessage?: string): void {
        if (toastMessage) {
            this.showResultToast = true;
            this.resultToastText = toastMessage;
        } else {
            this.showResultToast = false;
            this.resultToastText = undefined;
        }
        this.state = newState;
    }

}

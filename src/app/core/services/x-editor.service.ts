import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SwellService } from '.';
import { AppState } from '../../app.service';
import { ObjectService } from './x-object.service';
import { SessionService } from './x-session.service';

/**
 * Wrap an unique SwellRT editor instance associated with the
 * current client instance.
 *
 */
@Injectable()
export class EditorService {

    public static getSelectionStyles(editor: any, range: any) {
        return editor.getAnnotation(['paragraph/', 'style/', 'link'], range);
    }

    private static getCommentAnnotation(editor: any, range: any) {
        let ants = editor.getAnnotation(['comment'], range);
        return ants ? ants.comment : undefined;
    }

    /** Styles at the current caret position. */
    public stylesSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

    /** Selection has changed */
    public selectionSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    public title$: BehaviorSubject<string> = new BehaviorSubject<string>('');

    public status$: BehaviorSubject<string> = new BehaviorSubject<string>('DISCONNECTED');

    public headers$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    public visibleContextMenu$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public caretPos$: BehaviorSubject<any> = new BehaviorSubject<any>({x: 0, y: 0});

    public participantSessionMe$: BehaviorSubject<any> = new BehaviorSubject<any>({
        session: {
            id: null,
            online: false
        },
        profile: {
            name: '(Loading...)',
            shortName: '(Loading...)',
            imageUrl: null,
            color: {
                cssColor: 'rgb(255, 255, 255)'
            }
        }
    });

    public participantSessionRecent$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    public participantSessionPast$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    private editor: any;
    private status: any;
    private profilesManager: any;
    private participantSessionsRecent: any[] = [];
    private participantSessionsPast: any[] = [];
    private currentSelection: any;
    private caretPos: any = {x: 0, y: 0};
    private selectionStyles: any;
    private visibleLinkContextMenu: any;
    private visibleContextMenu: any;
    private showCanvasCover: any;
    private document: any;
    private documentId: any;
    private documentTitle: any;
    private commentsData: any;
    private comments: any;
    private headers: any;
    private connectionHandler: any;
    private selectionHandler: any;

    private readonly TOP_BAR_OFFSET: number = 114;

    private comments$: Observable<Comment>;

    constructor(private swell: SwellService,
                private appState: AppState, private objectService: ObjectService,
                private sessionService: SessionService) {    }

    public init(divId, documentId): Observable<any> {
        let that = this;
        return Observable.create((observer) => {
             that.sessionService.subject.subscribe(() => {
                 that.swell.getClient().subscribe((service) => {
                     if (service) {
                         if (that.editor) {
                             observer.next(that.editor);
                             observer.complete();
                         } else {
                             that.initAnnotation();
                             that.initConnectionHandler(service);
                             that.initProfilesHandler(service);
                             that.objectService.open(documentId).subscribe({
                                 next: (controller) => {
                                     that.initInternalEditor(service, controller, divId,
                                         documentId);
                                     that.title$.next(documentId); // TODO update
                                     // when user change title
                                     observer.next(that.editor);
                                     observer.complete();
                                 },
                                 error: () => {
                                     // TODO observable error
                                     that.appState.set('error', 'Error opening document ' +
                                         documentId);
                                     observer.error('Error opening document ' + documentId);
                                     observer.complete();
                                 }
                             });
                         }
                     }
                 });
             });
        });
    }

    public destroyEditor() {
        this.swell.getClient().subscribe((service) => {
            if (this.connectionHandler) {
                service.removeConnectionHandler(this.connectionHandler);
            }
            if (this.document) {
                console.log('Closing document ' + this.documentId);
                service.close(this.documentId);
            }
        });

        if (this.editor) {
            this.editor.clean();
        }
    }

    public attachText(text: any): void {
        this.editor.set(text);
        // this.startInteractive(); // TODO to remove?
        this.editor.edit(true);
    }

    public editStyle(event: any) {
        let selection = this.editor.getSelection();
        if (!selection || !selection.range) {
            return;
        }
        let range = selection.range;
        // if current selection is caret,
        // try to span operation range to the annotation
        if (range.isCollapsed()) {
            if (this.selectionStyles[event.name]) {
                range = this.selectionStyles[event.name].range;
            }
        }

        if (event.value) {
            this.editor.setAnnotation(event.name, event.value, range);
        } else {
            this.editor.clearAnnotation(event.name, range);
        }
        /*console.log('notify from editStyle');
        console.log(selection);*/
        this.notifySelection(selection);
        this.refreshHeadings();
    }

    public onSwitchDiffHighlight(event) {
        if (event) {
            this.document.get('text').showDiffHighlight();
            this.visibleContextMenu$.next(true);
        } else {
            this.document.get('text').hideDiffHighlight();
            this.visibleContextMenu$.next(false);
        }

    }

    // Toolbar
    private initAnnotation() {
        this.swell.getSdk().Editor.AnnotationRegistry.define('@mark', 'mark', {});
        this.swell.getSdk().Editor.AnnotationRegistry.define('comment', 'comment', {});

        this.swell.getSdk().Editor.AnnotationRegistry.setHandler('header', (type, annot, event) => {
            if (this.swell.getSdk().Annotation.EVENT_MOUSE !== type) {
                // TODO update via observable -> headings observable needed
                this.refreshHeadings();
            }
        });
        this.swell.getSdk().Editor.AnnotationRegistry.setHandler('comment',
            (type, annot, event) => {
                if (this.swell.getSdk().Annotation.EVENT_ADDED === type) {
                    // set as open here
                    // to ensure annotation is open again on undo.
                    // Comment.setOpen(annot.value, this.commentsData);
         // TODO update via observable -> comments observable needed
                    // this.refreshComments();
                }
                if (this.swell.getSdk().Annotation.EVENT_REMOVED === type) {
                    // this.refreshComments();
                }
            });
    }

    private initConnectionHandler(service) {
        let that = this;
        this.connectionHandler = (status, error) => {
            // TODO error observable
            that.status = status;
            that.status$.next(that.status);
            if (status === 'ERROR') {
                let errorInfo = 'Server Disconnected';
                if (error && error.statusMessange) {
                    errorInfo += ': ' + error.statusMessage;
                }
                this.appState.set('error', errorInfo);
            }

            if (status === 'ERROR' ||
                status === 'TURBULENCE' ||
                status === 'DISCONNECTED') {
                // show editor canvas cover
                let errorInfo = 'Server Disconnected';
                that.appState.set('error', errorInfo);
            }

            if (status === 'CONNECTED') {
                that.appState.set('error', null);
            }
        };
        service.addConnectionHandler(this.connectionHandler);
    }

    private initProfilesHandler(service) {
        let that = this;
        // TODO user profile observble
        // TODO participant profile observable
        // TODO decouple user form participants
        let notifyParticipants  = () => {
            that.participantSessionMe$.next({
                session: this.profilesManager.getSession(this.profilesManager.getCurrentSessionId(),
                    this.profilesManager.getCurrentParticipantId()),
                profile: this.profilesManager.getCurrentProfile()
            });
            that.participantSessionRecent$.next(that.participantSessionsRecent);
            that.participantSessionPast$.next(
                that.participantSessionsPast.sort((a, b) => {
                    return b.session.lastActivityTime - a.session.lastActivityTime;
                })
            );
        };
        let handler = {
            onLoaded: (profileSession) => {
                if (profileSession.profile.isCurrentSessionProfile()) {
                    notifyParticipants();
                    return;
                }
                let participantSession = {
                    session: profileSession,
                    profile: profileSession.profile
                };
                if (profileSession.online) {
                    that.participantSessionsRecent.unshift(participantSession);
                } else {
                    that.participantSessionsPast.unshift(participantSession);
                }
                notifyParticipants();
            },

            onUpdated: (profile) => {
                console.log('updated profile');
                notifyParticipants();
            },

            onOffline: (profileSession) => {
                // console.log("offline "+profileSession.id+ " : "+profileSession.profile.name);
                let participantSessionIndex =
                    that.participantSessionsRecent.findIndex((item: any) => {
                        return item.session.id === profileSession.id;
                    });

                if (participantSessionIndex >= 0) {
                    that.participantSessionsRecent.splice(participantSessionIndex, 1);
                    that.participantSessionsPast.unshift({
                        session: profileSession,
                        profile: profileSession.profile
                    });
                }
                notifyParticipants();
            },

            onOnline: (profileSession) => {
                // console.log("online "+profileSession.id+ " : "+profileSession.profile.name);
                let participantSessionIndex =
                    that.participantSessionsPast.findIndex((item: any) => {
                        return item.session.id === profileSession.id;
                    });

                if (participantSessionIndex >= 0) {
                    that.participantSessionsPast.splice(participantSessionIndex, 1);

                    that.participantSessionsRecent.unshift({
                        session: profileSession,
                        profile: profileSession.profile
                    });
                }
                notifyParticipants();
            }
        };
        this.profilesManager = service.profilesManager;
        this.profilesManager.addStatusHandler(handler);
        this.profilesManager.enableStatusEvents(true);
    }

    private checkBrowserComptability (editor) {
        // TODO update error observable
        if (editor.checkBrowserCompat() === 'readonly') {
            // this.showModalAlert("Sorry, this browser is not fully compatible yet.
            // You can keep using Jetpad in read only mode.");
            return false;
        }

        if (this.editor.checkBrowserCompat() === 'none') {
            // this.showModalAlert("Sorry, this browser is not compatible.");
            return false;
        }
    }

    private initInternalEditor(service: any, controller: any, divId: string, docid: string) {
        this.editor = this.swell.getSdk().Editor.createWithId(divId, service);
        let compatible = this.checkBrowserComptability(this.editor);
        // TODO observable error
        this.documentId = docid;
        this.document = controller;
        let title = this.document.get('title');
        let text = this.document.get('text');
        let isNew = !title || !text;
        if (!title) {
            this.document.put('title', this.docIdToTitle(docid));
        }
        if (!text) {
            this.document.put('text', this.swell.getSdk().Text.create(''));
        }
        if (isNew) {
            this.document.setPublic(true);
        }
        let comments = this.document.get('comments');
        if (!comments) {
            this.document.put('comments', this.swell.getSdk().Map.create());
        }
        this.documentTitle = this.document.get('title');
        this.commentsData = this.document.get('comments');
        this.showCanvasCover = this.document.get('text').isEmpty();
        this.editor.set(this.document.get('text'));
        this.editor.edit(true);
        this.status = 'CONNECTED';
        this.initSelectionHandler(this.editor);
        this.refreshHeadings();
        // this.refreshComments(); //TODO enable comments
    }

    private initSelectionHandler(swellEditor) {
        let that = this;
        this.selectionHandler = (range, editor, selection) => {
            // TODO observable with current selection
            if (selection) {
                that.currentSelection = selection;
            } else {
                that.currentSelection = null;
            }
            // calculate caret coords TODO observable with caretPos
            if (selection && selection.anchorPosition) {
                that.caretPos.x = selection.anchorPosition.left;
                that.caretPos.y = selection.anchorPosition.top;
                that.caretPos$.next(that.caretPos);
            }
            // ensure cursor is visible
            if (selection && selection.focusNode) {
                let focusParent = selection.focusNode.parentElement;
                if (focusParent.getBoundingClientRect) {
                    let rect = focusParent.getBoundingClientRect();
                    if (rect.top > (window.innerHeight - that.TOP_BAR_OFFSET)) {
                        focusParent.scrollIntoView();
                    }
                }
            }
            if (selection && selection.range) {
                // update toolbar state
                that.selectionStyles = EditorService.getSelectionStyles(editor, selection.range);
                // show contextual menu
                // TODO update visibleLinkMenu, visibleContextMenu, visibleLinkModal observable
                if (this.selectionStyles.link) {
                    this.visibleLinkContextMenu = true;

                } else if (!selection.range.isCollapsed()) {
                    this.visibleContextMenu = true;
                    this.visibleContextMenu$.next(true);
                }

                // check if there is a comment in the cursor position
                // TODO update comment view observable
                // that.pickComment(
                //     EditorService.getCommentAnnotation(this.editor, selection.range));
            }
            // EditorService.selectionHandler(that, range, editor, selection);
            /*console.log('notify from selectionHandler');
            console.log(selection);*/
            this.notifySelection(selection);
            this.refreshHeadings();
        };
        swellEditor.setSelectionHandler(this.selectionHandler);
    }

    private refreshHeadings() {
        this.headers = this.editor.getAnnotation(['header'],
            this.swell.getSdk().Editor.Range.ALL, true)['header'];
        this.headers$.next(this.headers);
    }

    private refreshComments() {
        this.comments = this.editor.seekTextAnnotations('comment',
            this.swell.getSdk().Editor.Range.ALL)['comment'];
    }

    /*private startInteractive(): void {
        this.editor.setSelectionHandler((range, editorRef, selection) => {
            return EditorService.selectionHandler(this, range, editorRef, selection);
        });
    }*/

    private docIdToTitle(id: string) {
        let s = id.replace('-', ' ');
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    private notifySelection(selection) {
        if (selection.range) {
            // TODO fix double next launched... find out where
            let currentSel =
                this.editor.getAnnotation(['paragraph/', 'style/', 'link'], selection.range);
            this.stylesSubject.next(currentSel);
        }
        this.selectionSubject.next(selection);
    }
}

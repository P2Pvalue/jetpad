import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState, JetpadModalService } from '../core/services';
import { ErrorModalComponent, AlertModalComponent } from '../share/components';
import { EditorModule } from './index';
import { ShareModalComponent } from './components/share-modal';
import { Comment } from '../core/model/comment';
import { EditorService } from '../core/services/x-editor.service';
import { ObjectService } from '../core/services/x-object.service';
import { SwellService } from '../core/services/x-swell.service';
import { SessionService } from '../core/services/x-session.service';
import { Subject, Observable } from 'rxjs';

declare let swellrt: any;
declare let window: any;
declare let document: any;

@Component({
    selector: 'jp-editor',
    templateUrl: 'editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditorComponent implements OnInit, OnDestroy {
    public title: 'Loading...';
    public title$: Observable<any>;

    public headers$: Observable<any>;

    public caretPos$: Observable<any>;

    public rightPanelContent: string = 'contributors';

    public visibleContextMenu: boolean = false;
    public visibleLinkModal: boolean = false;
    public visibleLinkContextMenu: boolean = false;

    public readonly voidLink = { key : 'link', text: '', value : '', range : null };
    public selectedLink = this.voidLink;

    public selectionStyles$: Observable<any>;
    public selection$: Observable<any>;

    public newCommentSelection: any;

    public status: string = 'DISCONNECTED';
    public status$: Observable<string>;

    public selectedComment: Comment;

    public participantSessionsRecent: any[] = [];

    public participantSessionsPast: any[] = [];

    public commentsAction: string = 'none';

    public showCanvasCover: boolean = false;

    public participantSessionMe: any = {
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
            },
            setName: (n) => {
                this.name = n;
            }
        }
    };
    public participantSessionMe$: Observable<any>;

    public participantSessionsRecent$: Observable<any>;

    public participantSessionsPast$: Observable<any>;

    public selectedComment$: Observable<any>;

    private docid: string;

    private doc: any;      // document/object

    private appStateSubscription: any;

    private readonly STYLE_LINK: string = 'link';

    private readonly TOP_BAR_OFFSET: number = 114;

    private name: string;

    private caretPosNode: any;

    // Network Connection status
    private connectionHandler: Function;
    // Manage profiles and their online status
    private profilesManager: any;

    private profilesHandler: any;
    // reference to swellrt's to doc.comments,
    // for each comment use two different keys:
    // <comment-id> : array of replies
    // <comment-id>-state : state of the comment
    private commentsData: any;

    private comments: any[] = new Array<any>(); // array of annotations
    private selectedCommentIndex: number;

    private errorModal: any = null;
    private shareModal: any = null;
    private alertModal: any = null;
    // The current selection+range,
    // req for comments
    private currentSelection: any;
    // currentSelection = {
    //    range: ... ,
    //    selection: ... ,
    // }

    constructor(private appState: AppState,
                private editorService: EditorService, private modalService: JetpadModalService,
                private route: ActivatedRoute, private objectSrv: ObjectService,
                private swell: SwellService, private session: SessionService) {
        this.title$ = this.editorService.title$;
        this.status$ = this.editorService.status$;
        this.selectionStyles$ = this.editorService.selectionStyles$;
        this.selection$ = this.editorService.selection$;
        this.headers$ = this.editorService.headers$;
        this.caretPos$ = this.editorService.caretPos$;
        this.participantSessionMe$ = this.editorService.participantSessionMe$;
        this.participantSessionsRecent$ = this.editorService.participantSessionRecent$;
        this.participantSessionsPast$ = this.editorService.participantSessionPast$;
        this.selectedComment$ = this.editorService.selectedComment$;
    }
    /*
     * TODO ensure editor DOM container is set after wiew is ready.
     * SwellRT should be fixed.
     */
    public ngOnInit() {
        this.appStateSubscription = this.appState.subject.subscribe((state) => {
            if (state.error) {
                this.showModalError(state.error);
            }
        });

        window.onscroll = () => {
            this.closeFloatingViews();
        };

        // TODO move to resolve
        this.route.params.subscribe((params: any) => {
            this.editorService.init('canvas-container', params['id'])
                .subscribe( (editor) => {
                    // not need to use editor object in the component
                });
        });

        this.selectedComment$.subscribe((comment) => {
            if (comment) {
                this.rightPanelContent = 'comments';
            }
        });

        this.selection$.subscribe( (selection) => {

                if (!selection) {
                    return;
                }

                // close previously opened modals / context menus
                this.closeFloatingViews();

                // show contextual menu
                this.selectedLink = this.voidLink;
                let linkAtSelection
                    = this.editorService.getSelectionStyles()[this.STYLE_LINK] != null;

                if (linkAtSelection) {
                    this.selectedLink = this.editorService.getSelectionStyles()[this.STYLE_LINK];
                    this.visibleLinkContextMenu = true;
                } else if (!selection.isCollapsed) {
                    this.visibleContextMenu = true;
                } else {
                    this.visibleContextMenu = false;
                }
        });

    }

    public ngOnDestroy() {
        this.appStateSubscription.unsubscribe();

        this.editorService.destroyEditor();
    }

    public closeFloatingViews() {
        this.visibleLinkModal = false;
        this.visibleContextMenu = false;
        this.visibleLinkContextMenu = false;
    }

    public editStyle(event: any) {
        this.editorService.editStyle(event);
    }

    public showModalLink() {

        let selection = this.editorService.getSelection();

        // Hide contextual menus
        this.closeFloatingViews();

        // There is a link annotation in current selection or caret..
        if (this.selectedLink.range) {
            this.visibleLinkModal = true;

        } else if (selection && selection.range) {

            // to create a link a non empty range must be selected
            let isText = !selection.isCollapsed;

            // No link annotation present => get text on current selection
            let ltext = isText ? this.editorService.getText(selection.range) : '';
            let url = ltext.startsWith('http') ? ltext : 'http://' + ltext;
            this.selectedLink = {
                key: 'link',
                value: url,
                text: ltext,
                range: null // new link
            };
            this.visibleLinkModal = true;
        }

    }

    /*
     *
     */
    public editLink(wasChanged) {

        // hide modal
        this.visibleLinkModal = false;

        if (!wasChanged) {
            return;
        }

        let selection = this.editorService.getSelection();

        // if there is no text, use the url
        if (this.selectedLink.value && !this.selectedLink.text) {
            this.selectedLink.text = this.selectedLink.value;
        }

        if (this.selectedLink.range) {

            // Edit existing link annotation

            if (!this.selectedLink.value) {
                // remove link annotation if user removed the URL
                this.editorService.removeLinkAnnotation(this.selectedLink);
            } else {
                // update the annotation
                let range
                    = this.editorService
                        .replaceText(this.selectedLink.range, this.selectedLink.text);
                this.editorService.setLinkAnnotation(range, this.selectedLink.value);
            }

        } else if (selection && selection.range) {
            if (this.selectedLink.text.length > 0 && this.selectedLink.value) {
                let newRange
                    = this.editorService
                        .replaceText(selection.range, this.selectedLink.text);
                this.editorService.setLinkAnnotation(newRange, this.selectedLink.value);
            }
        }
        // clean modal's parameters
        this.selectedLink = this.voidLink;
    }

    public onCommentEvent(event) {

        if (event.type === 'create') {
            this.editorService.createComment(event);
            this.commentsAction = 'edit';

        } else if (event.type === 'next') {

            this.editorService.nextComment();

        } else if (event.type === 'prev') {

            this.editorService.prevComment();

        } else if (event.type === 'focus') {
            let elements =
                document.getElementsByClassName(event.comment.commentId.replace('/', '-'));

            if (elements.length > 0) {
                elements[0].scrollIntoView(false);
            }

        } else if (event.type === 'close') {

            this.commentsAction = 'none';

        } else if (event.type === 'reply') {

            this.editorService.replyComment(event.reply, event.comment.commentId);

        } else if (event.type === 'resolve') {

            this.editorService.resolveComment(event.comment);

        } else if (event.type === 'delete') {

            this.editorService.deleteReplyComment(event.comment.commentId, event.reply);

        }
    }

    public onSwitchDiffHighlight(event) {
        this.editorService.onSwitchDiffHighlight(event);
    }

    public onMenuAction(actionEvent) {
        if (actionEvent.event === 'share') {
            this.showModalShare();

        } else if (actionEvent.event === 'comments') {
            this.rightPanelContent = 'comments';

        } else if (actionEvent.event === 'contributors') {
            this.rightPanelContent = 'contributors';

        } else if (actionEvent.event === 'comment-event') {
            this.onCommentEvent(actionEvent.data);
            this.commentsAction = 'edit';
        }
    }

    public linkContextAction(action: string) {

        this.visibleLinkContextMenu = false;

        if ('edit' === action) {
            this.showModalLink();
        }

        if ('delete' === action) {
            this.selectedLink.value = undefined;
            this.editLink(true);
        }
    }

    public contextAction(action: string) {
        this.visibleContextMenu = false;

        if ('link' === action) {
            this.showModalLink();
        }

        if ('bookmark' === action) {
            this.showModalAlert('Bookmarks will be available very soon.');
        }

        if ('comment' === action) {
            this.createComment();
        }
    }

    public onCoverEvent(event) {
        console.log(event);
    }

    public onChangeTitle(event) {
        this.editorService.changeTitle(event);
    }

    private showModalShare() {

        if (this.shareModal) {
            this.shareModal.destroy();
            this.shareModal = undefined;
        }

        let modal$ = this.modalService.create(EditorModule, ShareModalComponent, {
            title: this.title,
            ok: () => {
                /*this.shareModal.destroy();
                this.shareModal = undefined;*/
            }
        });

        modal$.subscribe((modal) => {
            this.shareModal = modal;
        });

    }

    private showModalError(error) {

        if (this.errorModal) {
            this.errorModal.destroy();
            this.errorModal = undefined;
        }

        let modal$ = this.modalService.create(EditorModule, ErrorModalComponent, {
            message: error,
            ok: () => {
                this.errorModal.destroy();
                this.errorModal = undefined;
            }
        });

        modal$.subscribe((modal) => {
            this.errorModal = modal;
        });

    }

    private showModalAlert(msg: string) {

        if (this.alertModal) {
            this.alertModal.destroy();
            this.alertModal = undefined;
        }

        let modal$ = this.modalService.create(EditorModule, AlertModalComponent, {
            message: msg,
            ok: () => {
                this.alertModal.destroy();
                this.alertModal = undefined;
            }
        });

        modal$.subscribe((modal) => {
            this.alertModal = modal;
        });
    }

    private createComment() {
        this.selectedComment = undefined;
        let selection = this.editorService.getSelection();
        let text = this.editorService.getText(selection.range);
        // check whether the selection is empty
        if (text.replace(' ', '').length > 0) {
            this.newCommentSelection = {
                range: selection.range,
                text
            };
            this.commentsAction = 'new';
            this.rightPanelContent = 'comments';
        }
    }

}

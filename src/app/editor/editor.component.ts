import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState, JetpadModalService } from '../core/services';
import { ErrorModalComponent, AlertModalComponent } from '../share/components';
import { EditorModule } from './index';
import { ShareModalComponent } from './components/share-modal';
import { Comment } from './comment';
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
    public title: 'Conectando...';
    public title$: Observable<any>;

    public inputLinkModal: any;

    public headers: any[] = new Array<any>(); // array of annotations
    public headers$: Observable<any>;

    public caretPos: any = {x: 0, y: 0};
    public caretPos$: Observable<any>;

    public rightPanelContent: string = 'contributors';

    public visibleContextMenu: boolean = false;
    public visibleContextMenu$: Observable<boolean>;

    public visibleLinkModal: boolean = false;

    public visibleLinkContextMenu: boolean = false;

    public selectionStyles: any = {}; // style annotations in current selection
    public selectionStyles$: Observable<any>;

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
    private editor: any;   // swellrt editor component

    private name: string;

    private linkRange: any;

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
        this.selectionStyles$ = this.editorService.stylesSubject;
        this.headers$ = this.editorService.headers$.asObservable();
        this.visibleContextMenu$ = this.editorService.visibleContextMenu$;
        this.caretPos$ = this.editorService.caretPos$;
        this.participantSessionMe$ = this.editorService.participantSessionMe$;
        this.participantSessionsRecent$ = this.editorService.participantSessionRecent$;
        this.participantSessionsPast$ = this.editorService.participantSessionPast$;
        this.selectedComment$ = this.editorService.selectedComment$;
        /*this.editorService.stylesSubject.subscribe((v) => {
            this.documentReady = true;
            console.log(v);
        });*/
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
        this.route.params.subscribe((params: any) => {
            this.editorService.init('canvas-container', params['id'])
                .subscribe( (editor) => {
                    this.editor = editor;
                });
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
        let selection = this.editor.getSelection();
        if (selection) {
            this.linkRange = selection.range;
        } else {
            return;
        }

        // don't show modal if not selection nor carte positioned
        if (!this.linkRange) {
            return;
        }

        // Hide contextual menus
        this.closeFloatingViews();

        // sugar syntax
        let selectionLink = this.selectionStyles[this.STYLE_LINK];

        // There is a link annotation in current selection or caret..
        if (selectionLink) {
            this.linkRange = selectionLink.range;

            this.inputLinkModal = {
                text: this.selectionStyles[this.STYLE_LINK].text,
                url: this.selectionStyles[this.STYLE_LINK].value
            };
        } else {
            // to create a link, at least a non empty range must be selected
            let isText = !this.linkRange.isCollapsed();

            // No link annotation present => get text on current selection
            let text = isText ? this.editor.getText(this.linkRange) : '';
            let url = text.startsWith('http') ? text : 'http://' + text;
            this.inputLinkModal = {text, url};
        }

        this.visibleLinkModal = true;
    }

    /*
     *
     */
    public editLink(link: any) {

        // hide modal
        this.visibleLinkModal = false;

        // sugar syntax
        let selectionLink = this.selectionStyles[this.STYLE_LINK];

        if (!link) {
            return;
        }
        // if there is no text, use the url
        if (link.url && !link.text) {
            link.text = link.url;
        }

        let toDelete: boolean = !link.url;

        if (selectionLink) {

            if (toDelete) {
                selectionLink.clear();
                return;
            }

            if (selectionLink.value !== link.url) {
                selectionLink.update(link.url);
            }

            if (selectionLink.text !== link.text) {
                selectionLink.mutate(link.text);
            }

        } else if (this.linkRange) {
            if (link.text.length > 0 && link.url) {
                let newRange = this.doc.get('text').replace(this.linkRange, link.text);
                if (newRange) {
                    this.editor.setAnnotation(this.STYLE_LINK, link.url, newRange);
                }
            }
        }
        // clean modal's parameters
        this.linkRange = null;
        this.inputLinkModal = null;

    }

    public resetCommentIndex(commentId) {
        this.selectedCommentIndex = 0;
        if (commentId) {
            for (let i = 0; i < this.comments.length; i++) {
                if (this.comments[i].value === commentId) {
                    this.selectedCommentIndex = i;
                    return;
                }
            }
        }
    }

    public onCommentEvent(event) {

        if (event.type === 'create') {
            this.editorService.createComment(event);
            //this.selectedComment.highlight(true);
            this.commentsAction = 'edit';

        } else if (event.type === 'next') {

            this.editorService.nextComment();

        } else if (event.type === 'prev') {

            this.editorService.prevComment();

        } else if (event.type === 'focus') {
            let element = document.querySelector(
                '[data-comment="' + event.comment + '"]'
            );
            element.scrollIntoView(false);
        } else if (event.type === 'close') {

            this.commentsAction = 'none';

        } else if (event.type === 'replay') {

            this.editorService.replayComment(event.replay, event.comment);

        } else if (event.type === 'resolve') {

            this.editorService.resolveComment(event.comment);

        } else if (event.type === 'delete') {

            this.editorService.deleteReplayComment(event.comment, event.reply);

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
            this.editLink({text: ''});
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
            ok: () => {
                this.shareModal.destroy();
                this.shareModal = undefined;
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
        let selection = this.editor.getSelection();
        let text = this.editor.getText(selection.range);
        // check whether the selection is empty
        if (text.replace(' ', '').length > 0) {
            this.newCommentSelection = selection;
            this.newCommentSelection.text = text;
            this.commentsAction = 'new';
            this.rightPanelContent = 'comments';
        }
    }

}

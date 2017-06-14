import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
import { Observable } from 'rxjs';

declare let swellrt: any;
declare let window: any;
declare let document: any;

@Component({
    selector: 'jp-editor',
    templateUrl: 'editor.component.html'
})

export class EditorComponent implements AfterViewInit, OnDestroy {
    public title: 'Conectando...';

    public inputLinkModal: any;

    public headers: any[] = new Array<any>(); // array of annotations

    public caretPos: any = {x: 0, y: 0};

    public rightPanelContent: string = 'contributors';

    public visibleContextMenu: boolean = false;

    public visibleLinkModal: boolean = false;

    public visibleLinkContextMenu: boolean = false;

    public selectionStyles: any = {}; // style annotations in current selection

    public newCommentSelection: any;

    public status: string = 'DISCONNECTED';

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

        /*this.status$ = this.store.select(fromRoot.getHeaderStatus);
        this.title$ = this.store.select(fromRoot.getHeaderTitle);*/
    }

    /*
     * TODO ensure editor DOM container is set after wiew is ready.
     * SwellRT should be fixed.
     */
    public ngAfterViewInit() {
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

        // refresh annotations
        this.selectionStyles = EditorService.getSelectionStyles(this.editor, range);
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
            this.selectedComment =
                Comment.create(event.selection.range, event.text,
                    this.participantSessionMe, this.editor, this.commentsData);
            this.selectedComment.highlight(true);
            this.commentsAction = 'edit';

        } else if (event.type === 'next') {

            let halt = false;
            let commentId = this.comments[this.selectedCommentIndex].value;
            if (!commentId) {
                return;
            }
            while (commentId === this.comments[this.selectedCommentIndex].value && !halt) {
                this.selectedCommentIndex++;
                if (this.selectedCommentIndex >= this.comments.length) {
                    this.selectedCommentIndex = 0;
                    halt = true;
                }
            }
            this.pickComment(this.comments[this.selectedCommentIndex]);

        } else if (event.type === 'prev') {
            let halt = false;
            let commentId = this.comments[this.selectedCommentIndex].value;
            if (!commentId) {
                return;
            }
            // Avoid issues with spread annotations having same id
            while (commentId === this.comments[this.selectedCommentIndex].value && !halt) {
                this.selectedCommentIndex--;
                if (this.selectedCommentIndex < 0) {
                    this.selectedCommentIndex = this.comments.length - 1;
                    halt = true;
                }
            }
            this.pickComment(this.comments[this.selectedCommentIndex]);

        } else if (event.type === 'focus') {
            let element = document.querySelector(
                '[data-comment="' + this.selectedComment.id + '"]'
            );
            element.scrollIntoView(false);
        } else if (event.type === 'close') {
            this.commentsAction = 'none';
            this.rightPanelContent = '';
        }
    }

    public onSwitchDiffHighlight(event) {
        if (event) {
            this.doc.get('text').showDiffHighlight();
        } else {
            this.doc.get('text').hideDiffHighlight();
        }

    }

    public onMenuAction(actionEvent) {
        if (actionEvent.event === 'share') {
            this.showModalShare();

        } else if (actionEvent.event === 'comments') {
            // TODO call editorService to update comments this.refreshComments();
            if (this.comments && this.comments.length > 0) {
                this.pickComment(this.comments[0]);
                this.rightPanelContent = actionEvent.event;
            }

        } else if (actionEvent.event === 'contributors') {
            this.rightPanelContent = actionEvent.event;

        } else if (actionEvent.event === 'comment-event') {
            this.onCommentEvent(actionEvent.data);
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
            setTimeout(() => {
                this.createComment();
            });
        }
    }

    public onCoverEvent(event) {
        console.log(event);
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

    private pickComment(commentAnnotation) {
        if (this.selectedComment) {
            this.selectedComment.highlight(false);
        }

        if (!commentAnnotation) {
            return;
        }

        let values = commentAnnotation.value.split(',');
        // pick the last value of the annotation
        let comment: Comment = commentAnnotation ?
            Comment.get(values[values.length - 1],
                commentAnnotation, this.participantSessionMe, this.editor, this.commentsData) :
            undefined;

        if (comment) {
            this.selectedComment = comment;
            this.resetCommentIndex(comment.id);
            this.selectedComment.highlight(true);
            this.commentsAction = 'edit';
            this.rightPanelContent = 'comments';
        } else {
            this.selectedComment = undefined;
            this.resetCommentIndex(null);
            this.commentsAction = 'none';
        }
    }
}

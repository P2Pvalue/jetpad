import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService, AppState, JetpadModalService } from '../core/services';
import { ErrorModalComponent, AlertModalComponent } from "../share/components";
import { EditorModule } from './index';
import { ShareModalComponent } from './components/share-modal';
import { Comment } from './comment';

declare let swellrt: any;
declare let window: any;
declare let document: any;

@Component({
  selector: 'jp-editor',
  templateUrl: 'editor.component.html'
})

export class EditorComponent implements OnInit, OnDestroy {

  private appStateSubscription: any;

  private readonly STYLE_LINK: string = "link";
  private readonly TOP_BAR_OFFSET: number = 114;

  private docid: string; // document/object id
  private doc: any;      // document/object

  private editor: any;   // swellrt editor component

  private selectionStyles: any = {}; // style annotations in current selection

  private headers: Array<any> = new Array<any>(); // array of annotations

  // To handle Links
  private visibleLinkModal: boolean = false;
  private inputLinkModal: any;
  private linkRange: any;

  // Selected text contextual menu
  private visibleContextMenu: boolean = false;

  // Specific context menu for links
  private visibleLinkContextMenu: boolean = false;

  // Absolute Coordinates in the screen
  private caretPos: any = { x: 0, y: 0 };
  private caretPosNode: any;

  // Network Connection status
  private connectionHandler: Function;
  private status: string;

  // Manage profiles and their online status
  private profilesManager: any;
  private profilesHandler: any;

  private participantSessionsRecent: Array<any> = [];
  private participantSessionsPast: Array<any> = [];
  private participantSessionMe : any = {
      session: {
        id: null,
        online: false
      },
      profile: {
        name: "(Loading...)",
        shortName: "(Loading...)",
        imageUrl: null,
        color: {
          cssColor: "rgb(255, 255, 255)"
        },
        setName: function(n) {
          this.name = n;
        }
      }
  };

  // Comments
  private newCommentSelection: any;
  private selectedComment: Comment;
  private commentsAction: string = "none";
  // reference to swellrt's to doc.comments,
  // for each comment use two different keys:
  // <comment-id> : array of replies
  // <comment-id>-state : state of the comment
  private commentsData: any;
  private comments: Array<any> = new Array<any>(); // array of annotations
  private selectedCommentIndex: number;

  // The canvas cover shows help in new documents
  // or other stuff in future
  private showCanvasCover: boolean = false;

  private errorModal: any = null;
  private shareModal: any = null;
  private alertModal: any = null;

  private rightPanelContent: string = "contributors";

  // The current selection+range,
  // req for comments
  private currentSelection: any;
  // currentSelection = {
  //    range: ... ,
  //    selection: ... ,
  // }

  constructor(private appState: AppState, private backend: BackendService, private modalService: JetpadModalService, private route: ActivatedRoute) {

  }

  //
  // Put here all calls to editor API, as static methods
  //

  private static getSelectionStyles(editor: any, range: any) {
    return editor.getAnnotation(['paragraph/','style/', 'link'], range);
  }

  private static getCommentAnnotation(editor: any, range: any) {
    let ants = editor.getAnnotation(['comment'], range);
    return ants ? ants.comment : undefined;
  }

  initAnnotations() {

    let that = this;

    // ensure swellrt object is ready
    this.backend.get()
      .then( service =>{

        swellrt.Editor.AnnotationRegistry.define("@mark", "mark", { });
        swellrt.Editor.AnnotationRegistry.define("comment", "comment", { });

        swellrt.Editor.AnnotationRegistry.setHandler("header", (type, annot, event) => {
          if (swellrt.Annotation.EVENT_MOUSE != type) {
            that.refreshHeadings();
          }
        });

        swellrt.Editor.AnnotationRegistry.setHandler("comment", (type, annot, event) => {
          if (swellrt.Annotation.EVENT_ADDED == type) {
            // set as open here
            // to ensure annotation is open again on undo.
            Comment.setOpen(annot.value, that.commentsData);
            that.refreshComments();
          }
          if (swellrt.Annotation.EVENT_REMOVED == type) {
            that.refreshComments();
          }
        });

      });

  }

  //
  // Init / Util methods
  //

  private sortParticipantSessions() {
    this.participantSessionsPast =
      this.participantSessionsPast.sort((a, b) => {
        return b.session.lastActivityTime - a.session.lastActivityTime;
      });
  }

  private setProfilesHandler() {

    /*
    this.participantSessionsRecent.push({
        session: {
          id: "session-x-01",
          online: true,
          color: {
            cssColor: "rgb(20, 0, 0)"
          }
        },
        profile: {
          name: "Natalie",
          shortName: "Nat",
          imageUrl: null
        }
    });
    */


    this.profilesHandler = {

      onLoaded: (profileSession) => {

        if (profileSession.profile.isCurrentSessionProfile()) {
          return;
        }

        let participantSession = {
          session: profileSession,
          profile: profileSession.profile
        }

        if (profileSession.online)
          this.participantSessionsRecent.unshift(participantSession);
        else
          this.participantSessionsPast.unshift(participantSession);

      },

      onUpdated: (profile) => {
      },

      onOffline: (profileSession) => {
        //console.log("offline "+profileSession.id+ " : "+profileSession.profile.name);
        let participantSessionIndex = this.participantSessionsRecent.findIndex((item: any) => {
          return item.session.id == profileSession.id;
        });

        if (participantSessionIndex >= 0) {
          this.participantSessionsRecent.splice(participantSessionIndex, 1);

          this.participantSessionsPast.unshift({
            session: profileSession,
            profile: profileSession.profile
          });
        }

      },

      onOnline: (profileSession) => {
        //console.log("online "+profileSession.id+ " : "+profileSession.profile.name);
        let participantSessionIndex = this.participantSessionsPast.findIndex((item: any) => {
          return item.session.id == profileSession.id;
        });

        if (participantSessionIndex >= 0) {
          this.participantSessionsPast.splice(participantSessionIndex, 1);

          this.participantSessionsRecent.unshift({
            session: profileSession,
            profile: profileSession.profile
          });
        }

      }

    };

    this.profilesManager.addStatusHandler(this.profilesHandler);
    this.profilesManager.enableStatusEvents(true);

  }

  private onMenuAction(actionEvent)  {
      if (actionEvent.event == "share") {
        this.showModalShare();

      } else if (actionEvent.event == "comments") {
        this.refreshComments();
        if (this.comments && this.comments.length > 0) {
          this.pickComment(this.comments[0]);
          this.rightPanelContent = actionEvent.event;
        }

      } else if (actionEvent.event == "contributors") {
        this.rightPanelContent = actionEvent.event;

      } else if (actionEvent.event == "comment-event") {
        this.onCommentEvent(actionEvent.data);
      }
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

  public ngOnInit() {

    this.appStateSubscription = this.appState.subject.subscribe( (state) => {
      if (state.error) {
        this.showModalError(state.error);
      }
    });

    this.initAnnotations();

    window.onscroll = () => {
      this.closeFloatingViews();
    };

    this.backend.get()
      .then( s => {

        // attach connection status handler
        this.connectionHandler = (status, error) => {
          this.status = status;
          if (status == "ERROR") {
            let errorInfo = "Server Disconnected";
            if (error && error.statusMessange)
              errorInfo += ": "+error.statusMessage;
            this.appState.set("error", errorInfo);
          }

          if (status == "ERROR" ||
              status == "TURBULENCE" ||
              status == "DISCONNECTED") {
            // show editor canvas cover
          }

          if (status == "CONNECTED") {
            // remove editor canvas cover
          }

        };
        s.addConnectionHandler(this.connectionHandler);

        // Track online participants
        this.profilesManager = s.profilesManager;
        // Register handler before opening the doc/editor
        // to get notified of all previous participants
        this.setProfilesHandler();

        // keep the editor reference in the component
        this.editor = swellrt.Editor.createWithId("canvas-container", s);
        window._editor = this.editor;

        // Listen for cursor and selection changes
        this.editor.setSelectionHandler((range, editor, selection) => {

          // anytime seleciton changes, close link modal
          this.closeFloatingViews();
          // clear cached selection
          if (selection) {
            this.currentSelection = selection;
            window._selection = this.currentSelection; // TODO remove
          } else {
            this.currentSelection = undefined;
          }

          this.newCommentSelection = undefined;

          // calculate caret coords
          if (selection && selection.anchorPosition) {
            this.caretPos.x = selection.anchorPosition.left;
            this.caretPos.y = selection.anchorPosition.top;
          }

          // ensure cursor is visible
          if (selection && selection.focusNode) {
            let focusParent = selection.focusNode.parentElement;
            if (focusParent.getBoundingClientRect) {
              let rect = focusParent.getBoundingClientRect();
              if (rect.top > (window.innerHeight - this.TOP_BAR_OFFSET)) {
                focusParent.scrollIntoView();
              }
            }
          }

          if (selection && selection.range) {
            // update toolbar state
            this.selectionStyles = EditorComponent.getSelectionStyles(editor, selection.range);

            // show contextual menu
            if (this.selectionStyles.link) {
              this.visibleLinkContextMenu = true;

            } else if (!selection.range.isCollapsed()) {
              this.visibleContextMenu = true;
            }

            // check if there is a comment in the cursor position
            this.pickComment(EditorComponent.getCommentAnnotation(this.editor, selection.range));
          }



        });

        // listen to url parameters
        this.route.params.subscribe((param: any) => {
          this.open(param['id']);
        });

        // Check editor compat
        if (this.editor.checkBrowserCompat() == "readonly") {
          this.showModalAlert("Sorry, this browser is not fully compatible yet. You can keep using Jetpad in read only mode.");
        }

        if (this.editor.checkBrowserCompat() == "none") {
          this.showModalAlert("Sorry, this browser is not compatible.");
        }

      });

  }

  public ngOnDestroy() {

    this.appStateSubscription.dispose();

    this.backend.get()
      .then( s => {
        s.removeConnectionHandler(this.connectionHandler);
      });

    if (this.editor) {
      this.editor.clean();
    }

    if (this.doc) {
      this.backend.close(this.docid);
    }

  }


  refreshHeadings() {
    this.headers = this.editor.getAnnotation(["header"], swellrt.Editor.Range.ALL, true)["header"];
  }

  refreshComments() {
    this.comments = this.editor.seekTextAnnotations("comment", swellrt.Editor.Range.ALL)["comment"];
  }

  closeFloatingViews() {
    this.visibleLinkModal = false;
    this.visibleContextMenu = false;
    this.visibleLinkContextMenu = false;
  }

  open(id: string) {

    this.editor.clean();

    this.backend.open(id)
    .then( r => {

      // 'r' is not the document's object, just a handy wrapper:
      // r.controller -> full interface of the object
      // r.object -> native JS interface, based on ES6 Proxies.
      //
      // we prefer to use the controller interface to avoid issues with
      // old browsers not supporting Proxies. In any case, in jetpad
      // there is not advantage by using native interface.

      // Store references in the component
      this.docid = id;
      this.doc = r.controller;

      // Initialize document object
      BackendService.initDocObject(this.doc, this.docid);
      // Get reference to comments
      this.commentsData = this.doc.get("comments");
      // Show a welcome message in the doc canvas doc is empty
      this.showCanvasCover = this.doc.get("text").isEmpty();
      // Bind document's text to the editor
      this.editor.set(this.doc.get("text"));
      // Enable interactive editing now!
      this.editor.edit(true);

      this.refreshHeadings();
      this.refreshComments();

      // Load current user session to ensure login has been done
      this.participantSessionMe = {
          session: this.profilesManager.getSession(this.profilesManager.getCurrentSessionId(),
                                                this.profilesManager.getCurrentParticipantId()),
          profile: this.profilesManager.getCurrentProfile()
      };
      this.sortParticipantSessions();

      window._doc = this.doc;
    })
    .catch( error => {
      this.appState.set("error", "Error opening document "+id);
    });
  }


  editStyle(event: any) {
    let selection = this.editor.getSelection();
    if (!selection || !selection.range)
      return;

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
    this.selectionStyles = EditorComponent.getSelectionStyles(this.editor, range);
  }

  showModalLink() {
    let selection = this.editor.getSelection();
    if (selection)
      this.linkRange = selection.range;
    else
      return;

    // don't show modal if not selection nor carte positioned
    if (!this.linkRange)
      return;

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
      let text = isText ? this.editor.getText(this.linkRange) : "";
      let url = text.startsWith("http") ? text : "http://" + text ;
      this.inputLinkModal = {
        text: text,
        url: url
      };
    }

    this.visibleLinkModal = true;
  }

  /*
  *
  */
  editLink(link: any) {

    // hide modal
    this.visibleLinkModal = false;

    // sugar syntax
    let selectionLink = this.selectionStyles[this.STYLE_LINK];

    if (!link)
      return;

    // if there is no text, use the url
    if (link.url && !link.text)
      link.text = link.url;

    let toDelete: boolean = !link.url;

    if (selectionLink) {

      if (toDelete) {
        selectionLink.clear();
        return;
      }

      if (selectionLink.value != link.url)
        selectionLink.update(link.url);

      if (selectionLink.text != link.text)
        selectionLink.mutate(link.text);

    } else if (this.linkRange) {

      if (link.text.length > 0 && link.url) {
        let newRange = this.doc.get("text").replace(this.linkRange, link.text);
        if (newRange)
          this.editor.setAnnotation(this.STYLE_LINK, link.url, newRange);
      }
    }

    // clean modal's parameters
    this.linkRange = null;
    this.inputLinkModal = null;

  }

  private linkContextAction(action: string) {

    this.visibleLinkContextMenu = false;

    if ("edit" == action) {
      this.showModalLink();
    }

    if ("delete" == action) {
      this.editLink({ text : "" });
    }
  }

  private contextAction(action: string) {

    this.visibleContextMenu = false;

    if ("link" == action) {
      this.showModalLink();
    }

    if ("bookmark" == action) {
      this.showModalAlert("Bookmarks will be available very soon.");
    }

    if ("comment" == action) {
      setTimeout(() => {
        this.createComment();
      })
    }

  }


  private createComment() {
    this.selectedComment = undefined;
    let selection = this.editor.getSelection();
    let text = this.editor.getText(selection.range);
    // check whether the selection is empty
    if (text.replace(" ","").length > 0) {
      this.newCommentSelection = selection;
      this.newCommentSelection.text  = text;
      this.commentsAction = "new";
      this.rightPanelContent = "comments";
    }
  }

  private pickComment(commentAnnotation) {

    if (this.selectedComment) {
      this.selectedComment.highlight(false);
    }

    if (!commentAnnotation) {
      return;
    }

    let values = commentAnnotation.value.split(",");
    // pick the last value of the annotation
    let comment: Comment = commentAnnotation ? Comment.get(values[values.length-1], commentAnnotation, this.participantSessionMe, this.editor, this.commentsData) : undefined;

    if (comment) {
      this.selectedComment = comment;
      this.resetCommentIndex(comment.id);
      this.selectedComment.highlight(true);
      this.commentsAction = "edit";
      this.rightPanelContent = "comments";
    } else {
      this.selectedComment = undefined;
      this.resetCommentIndex(null);
      this.commentsAction = "none";
    }

  }

  public resetCommentIndex(commentId) {
    this.selectedCommentIndex = 0;
    if (commentId) {
      for (let i=0; i < this.comments.length; i++) {
        if (this.comments[i].value == commentId) {
          this.selectedCommentIndex = i;
          return;
        }
      }
    }
  }


  public onCommentEvent(event) {

    if (event.type == "create") {
      this.selectedComment = Comment.create(event.selection.range, event.text, this.participantSessionMe, this.editor, this.commentsData);
      this.selectedComment.highlight(true);
      this.commentsAction = "edit";

    } else if (event.type == "next") {

      let halt = false;
      let commentId = this.comments[this.selectedCommentIndex].value;
      if (!commentId)
        return;

      while (commentId == this.comments[this.selectedCommentIndex].value && !halt) {
        this.selectedCommentIndex++;
        if (this.selectedCommentIndex >= this.comments.length) {
          this.selectedCommentIndex = 0;
          halt = true;
        }
      }

      this.pickComment(this.comments[this.selectedCommentIndex]);

    } else if (event.type == "prev") {

      let halt = false;
      let commentId = this.comments[this.selectedCommentIndex].value;
      if (!commentId)
        return;

      // Avoid issues with spread annotations having same id
      while (commentId == this.comments[this.selectedCommentIndex].value && !halt) {
        this.selectedCommentIndex--;
        if (this.selectedCommentIndex < 0 ) {
          this.selectedCommentIndex = this.comments.length-1;
          halt = true;
        }
      }

      this.pickComment(this.comments[this.selectedCommentIndex]);

    } else if (event.type == "focus") {
      let element = document.querySelector('[data-comment="'+this.selectedComment.id+'"]');
      element.scrollIntoView(false);
    } else if (event.type == "close") {
      this.commentsAction = "none";
      this.rightPanelContent = "";
    }

  }

  private onCoverEvent(event) {
  }

  private onSwitchDiffHighlight(event) {
    if (event) {
      this.doc.get("text").showDiffHighlight();
    } else {
      this.doc.get("text").hideDiffHighlight();
    }

  }

}

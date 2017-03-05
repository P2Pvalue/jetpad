import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService, AppState, JetpadModalService } from '../core/services';
import { ErrorModalComponent, AlertModalComponent } from "../share/components";
import { EditorModule } from './index';


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

  private docid: string; // document/object id
  private doc: any;      // document/object

  private editor: any;   // swellrt editor component

  private selectionStyles: any = {}; // style annotations in current selection

  private headers: Array<any> = new Array<any>();

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

  // The canvas cover shows help in new documents
  // or other stuff in future
  private showCanvasCover: boolean = false;

  private errorModal: any = null;

  constructor(private appState: AppState, private backend: BackendService, private modalService: JetpadModalService, private route: ActivatedRoute) {

  }


  participants = [{
    name: 'pepe'
  },{
    name: 'emilio'
  },{
    name: 'rodrigo'
  },{
    name: 'fernando'
  },{
    name: 'casamayor'
  }];


  private static getSelectionStyles(editor: any, range: any) {
    return editor.getAnnotation(['paragraph/','style/', 'link'], range);
  }

  private showModalError(error) {

    if (this.errorModal) {
      this.errorModal.destroy();
      this.errorModal = null;
    }

    let modal$ = this.modalService.create(EditorModule, ErrorModalComponent, {
      message: error,
      ok: () => {
      }
    });

    modal$.subscribe((modal) => {
      setTimeout(() => {
        this.errorModal = modal;
          // close the modal after 5 seconds
          //modal.destroy();
      }, 5000)
    });

  }

  private showModalNotAvailable(msg: string) {

    let modal$ = this.modalService.create(EditorModule, AlertModalComponent, {
      message: msg,
      ok: () => {
      }
    });

    modal$.subscribe((modal) => {
      setTimeout(() => {
        // close the modal after 5 seconds
        //modal.destroy();
      }, 5000)
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
            let errorInfo = "Network error";
            if (error)
              errorInfo += ": "+error.statusMessage;
            this.appState.set("error", errorInfo);
          }

        };
        s.addConnectionHandler(this.connectionHandler);

        // keep the editor reference in the component
        this.editor = swellrt.Editor.createWithId("canvas-container", s);

        // Listen for cursor and selection changes
        this.editor.setSelectionHandler((range, editor, selection) => {

          // anytime seleciton changes, close link modal
          this.closeFloatingViews();

          // calculate caret coords
          if (selection && selection.anchorPosition) {
            this.caretPos.x = selection.anchorPosition.left;
            this.caretPos.y = selection.anchorPosition.top;
          }

          if (range) {
            // update toolbar state
            this.selectionStyles = EditorComponent.getSelectionStyles(editor, range);

            // show contextual menu
            if (this.selectionStyles.link) {
              this.visibleLinkContextMenu = true;

            } else  if (!range.isCollapsed()) {
              this.visibleContextMenu = true;
            }

          }

        });

        // listen to url parameters
        this.route.params.subscribe((param: any) => {
          this.open(param['id']);
        });
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
      // Show a welcome message in the doc canvas doc is empty
      this.showCanvasCover = this.doc.get("text").isEmpty();
      // Bind document's text to the editor
      this.editor.set(this.doc.get("text"));
      // Enable interactive editing now!
      this.editor.edit(true);
      // Needed in some browsers
      this.refreshHeadings();
    })
    .catch( error => {
      this.appState.set("error", "Error opening document "+id);
    });
  }

  initAnnotations() {

    let that = this;

    // ensure swellrt object is ready
    this.backend.get()
      .then( service =>{

        swellrt.Editor.AnnotationRegistry.setHandler("header", (type, annot, event) => {
          if (swellrt.Annotation.EVENT_MOUSE != type) {
            that.refreshHeadings();
          }
        });

      });
  }

  editStyle(event: any) {

    let range = this.editor.getSelection();
    if (!range) return;

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
      this.linkRange = this.editor.getSelection();
      let isText = this.linkRange && !this.linkRange.isCollapsed();

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
      this.showModalNotAvailable("Bookmarks will be available very soon.");
    }

    if ("comment" == action) {
      this.showModalNotAvailable("Comments will be available very soon.");
    }

  }

  private onCoverEvent(event) {
  }

}

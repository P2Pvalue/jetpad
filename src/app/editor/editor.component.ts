import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../core/services";

declare let swellrt: any;
declare let window: any;
declare let document: any;

@Component({
  selector: 'jp-editor',
  templateUrl: 'editor.component.html'
})

export class EditorComponent implements OnInit, OnDestroy {

  readonly STYLE_LINK: string = "link";

  docid: string; // document/object id
  doc: any;      // document/object

  editor: any;   // swellrt editor component

  selectionStyles: any = {}; // style annotations in current selection

  headers: Array<any> = new Array<any>();

  // To handle Links
  visibleLinkModal: boolean = false;
  inputLinkModal: any;
  linkRange: any;

  // Selected text contextual menu
  visibleContextMenu: boolean = false;

  // Specific context menu for links
  visibleLinkContextMenu: boolean = false;

  // Absolute Coordinates in the screen
  caretPos: any = { x: 0, y: 0 };
  caretPosNode: any;


  constructor(private backend: BackendService, private route: ActivatedRoute) {

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

  ngOnInit() {

    this.initAnnotations();

    window.onscroll = () => {
      this.clearFloatingViews();
    };

    this.backend.get()
      .then( s => {

        // keep the editor reference in the component
        this.editor = swellrt.Editor.createWithId("canvas-container", s);

        // Listen for cursor and selection changes
        this.editor.setSelectionHandler((range, editor, node) => {

          // anytime seleciton changes, close link modal
          this.clearFloatingViews();

          // calculate caret coords
          if (node) {
            this.calculateCaretPos(node);
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

  ngOnDestroy() {

    if (this.editor) {
      this.editor.clean();
    }

    if (this.doc) {
      this.backend.close(this.docid);
    }

  }


  calculateCaretPos(node) {
    if (node)
      this.caretPosNode = node;

    if (!this.caretPosNode)
      return;

    // http://stackoverflow.com/questions/16209153/how-to-get-the-position-and-size-of-a-html-text-node-using-javascript
    let r = document.createRange();
    r.selectNodeContents(this.caretPosNode);
    let rects = r.getClientRects();

    this.caretPos.x = rects[0].left;
    this.caretPos.y = rects[0].top;
  }

  refreshHeadings() {
    this.headers = this.editor.getAnnotation(["header"], swellrt.Editor.Range.ALL, true)["header"];
  }

  clearFloatingViews() {
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
      // Bind document's text to the editor
      this.editor.set(this.doc.get("text"));
      // Enable interactive editing now!
      this.editor.edit(true);

    })
    .catch( error => {
      console.log(error);
      // TODO handle severe error
    });
  }

  initAnnotations() {

    let that = this;

    // ensure swellrt object is ready
    this.backend.get()
      .then( service =>{

        swellrt.Annotation.Registry.setHandler("header", (type, annot, event) => {
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
      if (!this.linkRange || this.linkRange.isCollapsed()) {
        return;
      }

      // No link annotation present => get text on current selection
      let text = this.editor.getText(this.linkRange);
      this.inputLinkModal = {
        text: text ? text : '',
        url: text ? text : ''
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

    } else {

      if (link.url) {
        this.editor.setAnnotation(this.STYLE_LINK, link.url, this.linkRange);
      }

    }

    // clean modal's parameters
    this.linkRange = null;
    this.inputLinkModal = null;

  }

  linkContextAction(action: string) {

    this.visibleLinkContextMenu = false;

    if ("edit" == action) {
      this.showModalLink();
    }

    if ("delete" == action) {
      this.editLink({ text : "" });
    }
  }

}

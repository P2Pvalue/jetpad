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
  linkModalPos: any = { x: 100, y: 100 };
  visibleLinkModal: boolean = false;
  inputLinkModal: any;
  linkRange: any;

  readonly linkModalHeight: number = 204; // px
  readonly linkModalWidth: number = 216; // px

  // Selected text contextual menu
  selectionMenuPos: any = { x: 0, y: 0 };
  visibleSelectionMenu: boolean = false;
  selectionAnnotation: any;

  readonly selectionMenuHeight: number = 53; // px
  readonly selectionMenuWidth: number = 100; // px

  caretPos: any = { x: 100, y: 100, width: 0 };


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

    this.backend.createEditor('canvas-container')
      .then( e => {
        // TO REMOVE, FOR DEBUGGING
        window.editor = e;
        // keep the editor reference in the component
        this.editor = e;
        // Listen for cursor and selection changes
        this.editor.setSelectionHandler((range, editor, node) => {

          // update toolbar state
          this.selectionStyles = EditorComponent.getSelectionStyles(editor, range);
          window._node  = node;

          // calculate caret coords
          if (node) {
            let container = node.parentElement;
            this.caretPos.x = container.offsetLeft;
            this.caretPos.y = container.offsetTop;
            this.caretPos.width = container.offsetWidth;
            window._caret = this.caretPos;
          }


          // show contextual menu by setting the @selection annotation
          if (this.selectionAnnotation) {
            this.selectionAnnotation.clear();
            this.selectionAnnotation = null;
          }
          this.selectionAnnotation = editor.setAnnotation("@selection", "", range);

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

  refreshHeadings() {
    this.headers = this.editor.getAnnotation(["header"], swellrt.Editor.Range.ALL, true)["header"];
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

        // Note about the @selection Annotation:
        //
        // We define this annotation to show a contextual menú
        // with text tools on a text is selected.
        // We use the annotation handler to show and hide the menu
        // at the same time the annotation is rendered or removed
        //
        // An alternative approach is to use the editor's selection handler
        // (see editor.setSelectionHandler) and the node parameter.

        swellrt.Annotation.Registry.define("@selection","selection");
        swellrt.Annotation.Registry.setHandler("@selection", (type, annot, event) => {

          if (type == swellrt.Annotation.EVENT_ADDED) {
            var sel = annot.node;

            if (sel) {
              that.selectionMenuPos.x = sel.offsetLeft + ((sel.offsetWidth - that.selectionMenuWidth) / 2);
              that.selectionMenuPos.y = sel.offsetTop - that.selectionMenuHeight;
              that.visibleSelectionMenu = true;
            }

          } else if (type == swellrt.Annotation.EVENT_REMOVED) {
            that.visibleSelectionMenu = false;
          }
        });

      });



  }

  editStyle(event: any) {

    let range = this.editor.getSelection();

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

    // calculate position of the modal according to the current caret pos.
    this.linkModalPos.x = this.caretPos.x + ((this.caretPos.width - this.linkModalWidth) / 2);
    this.linkModalPos.y = this.caretPos.y - this.linkModalHeight;

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

//
// Below old implementation using SwellRT alpha
// To be removed
//

/*
  editor: any;
  title: any;
  documentId: any;
  //participants = [];
  privateDocument: any;

  outline: any;
  showOutline: boolean = false;

  refreshOutline: Function;


  formats: Array<Array<string>> = [
    //['paragraph-type'],
    //['font-family'],
    //['text-size'],
    ['bold', 'italic', 'underline', 'strike-through'],
    //['color', 'background-color'],
    ['text-left', 'text-center', 'text-right', 'text-justify'],
    //['link'],
    //['export'],
    ['text-dots', 'text-number']
    //['table', 'img']
  ];

  annotations: Array<any>;
  annotationMap = {
    'header': 'paragraph/header=*',
    'font-family': 'style/fontFamily=*',
    'font-size': 'style/fontSize=*',
    'bold': 'style/fontWeight=bold',
    'italic': 'style/fontStyle=italic',
    'underline': 'style/textDecoration=underline',
    'strike-through': 'style/textDecoration=line-through',
    'color': 'style/color=*',
    'bg-color': 'style/backgroundColor=*',
    'text-left': 'paragraph/textAlign=left',
    'text-center': 'paragraph/textAlign=center',
    'text-right': 'paragraph/textAlign=right',
    'text-justify': 'paragraph/textAlign=justify',
    'text-dots': 'paragraph/listStyleType=unordered',
    'text-number': 'paragraph/listStyleType=decimal'
  };
  buttons: Map<string, boolean> = new Map<string, boolean>();
  currentColor = '#000000';
  currentBgColor = '#FFFFFF';
  currentTextSize = '14px';
  currentTextType = 'none';
  currentTextFamily = 'Liberation Serif';


  constructor(private documentService: DocumentService, private route: ActivatedRoute) {
    //this.disableEditorToolbar();
    documentService.currentDocumentIsPrivate.subscribe(visibility => this.privateDocument = visibility);
    documentService.myDocuments.subscribe(document => {
      if(document.editorId === this.documentId) {
        this.participants = document.participants.slice();
        this.participants.unshift(document.author);
      }
    });
  }

  ngOnInit(){

    this.refreshOutline = () => {
      this.outline = this.editor.getAnnotationSet('paragraph/header');
    };


    let widgets = {
      'img-link': {
        onInit: (parentElement, state) => parentElement.innerHTML = `<img src="${state}">`,
        onChangeState: (parentElement, before, state) => parentElement.innerHTML = `<img src="${state}">`
      }
    };

    let annotations = {
      'paragraph/header': {
        onAdd: this.refreshOutline,
        onChange: this.refreshOutline,
        onRemove: this.refreshOutline
      },
      'link': {
        onEvent: function(range, event) {
          if (event.type === 'click') {
            event.stopPropagation();
            if(event.ctrlKey) {
              let annotation = range ? this.editor.getAnnotationInRange(range, 'link') : null;
              let link = annotation ? annotation.value : null;
              if (link) {
                let win = window.open(link, '_blank');
                win.focus();
              }
            }
          }
        }
      }
    };
    this.editor = DocumentService.editor('canvas-container', widgets, annotations);

    this.route.params.subscribe((param: any) => {
      this.documentId = param['id'];
      this.openDocument().then(() => {
        this.refreshOutline();
      });
    });
  }

  ngOnDestroy() {
    this.participants = [];
    this.documentId = undefined;
    this.documentService.close();
  }

  openDocument() {

    return this.documentService.open(this.documentId).then(cObject => {

      // Initialize the doc
      if (!cObject.root.get('doc')) {
        cObject.root.put('doc', cObject.createText(''));
      }

      // Initialize the doc's title
      if (!cObject.root.get('doc-title')) {
        cObject.root.put('doc-title', cObject.createString('New document'));
      }

      // Open the doc in the editor
      this.title = cObject.root.get('doc-title');
      this.editor.edit(cObject.root.get('doc'));

      this.editor.onSelectionChanged((range) => {
        if (range.lenght > 10) {
          //this.hideAssessment = false;
          //this.assesmentTop = range.node.parentElement.offsetTop + range.node.parentElement.offsetHeight;

        } else {
          //this.hideAssessment = true;
        }
        // this.selectedRange = range;
        this.annotations = range.annotations;
        this.updateEditorToolbar();
      });

      this.editorElement.addEventListener('focus', () => this.updateEditorToolbar());
      this.editorElement.addEventListener('blur', () => this.disableEditorToolbar());

      this.privateDocument = !this.documentService.publicDocument();
    })
      .catch(error => {
        console.log('Document doesn\'t exist or you don\'t have permission to open: ' + error);
      });
  }

  updateEditorToolbar() {
    for (let formatGroup of this.formats) {
      for (let format of formatGroup) {
        let [key, val] = this.annotationMap[format].split('=');
        this.buttons[format] = this.annotations[key] === val;
      }
    }
    this.currentColor = this.annotations['style/color'] || '#000000';
    this.currentBgColor = this.annotations['style/backgroundColor'] || '#FFFFFF';
    this.currentTextType = this.annotations['paragraph/header'] || 'none';
    this.currentTextSize = this.annotations['style/fontSize'] || '14px';
    this.currentTextFamily = this.annotations['style/fontFamily'] || 'Liberation Serif';
  }

  disableEditorToolbar() {
    for (let formatGroup of this.formats) {
      for (let format of formatGroup) {
        this.buttons[format] = false;
      }
    }
  }

  get editorElement() {
    return (<HTMLElement>document.querySelector('#canvas-container > div'));
  }
  */


}

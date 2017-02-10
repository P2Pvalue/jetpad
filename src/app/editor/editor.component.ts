import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../core/services";

declare let swellrt: any;
declare let window: any;

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


  constructor(private backend: BackendService, private route: ActivatedRoute) {

  }

  private static getSelectionAnnotations(editor: any, range: any) {
      return editor.getAnnotation(['paragraph/','style/', 'link'], range);
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

  ngOnInit() {

    this.backend.createEditor('canvas-container')
      .then( e => {
        // TO REMOVE -> FOR DEBUGGING
        window.editor = e;
        // keep the editor reference in the component
        this.editor = e;
        // Listen for cursor and selection changes
        this.editor.setSelectionHandler((range, editor) => {
          this.selectionStyles = EditorComponent.getSelectionAnnotations(editor, range);
          /*
          for (var s in this.selectionStyles)
            console.log(s + " => "+this.selectionStyles[s].value);
          */
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

  updateHeaders() {
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

      let that = this;
      swellrt.Annotation.Registry.setHandler("header", (type, annot, event) => {
        console.log("header event -> "+type);
        if (swellrt.Annotation.EVENT_MOUSE != type) {
          that.updateHeaders();
        }
      });

    })
    .catch( error => {
      console.log(error);
      // TODO handle severe error
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
    this.selectionStyles = EditorComponent.getSelectionAnnotations(this.editor, range);
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

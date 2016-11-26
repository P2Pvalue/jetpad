import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {DocumentService} from "../../services";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html'
})

export class EditorComponent implements OnInit, OnDestroy {

  _title: any;
  editor: any;

  documentId: any;
  participants = [];
  privateDocument: any;

  showOutline: boolean = false;

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

  textSizes = Array.from(new Array(72), (x,i) => i + 1).filter(x => x % 2 == 0 );
  currentTextSize = '14px';
  currentTextType = 'none';
  currentTextFamily = 'Arial';
  annotations: Array<any>;

  annotationMap = {
    'bold': 'style/fontWeight=bold',
    'italic': 'style/fontStyle=italic',
    'underline': 'style/textDecoration=underline',
    'strike-through': 'style/textDecoration=line-through',
    'text-left': 'paragraph/textAlign=left',
    'text-center': 'paragraph/textAlign=center',
    'text-right': 'paragraph/textAlign=right',
    'text-justify': 'paragraph/textAlign=justify',
    'text-dots': 'paragraph/listStyleType=unordered',
    'text-number': 'paragraph/listStyleType=decimal'
  };

  buttons: Map<string, boolean> = new Map<string, boolean>();

  constructor(private documentService: DocumentService, private route: ActivatedRoute) {
    this.disableEditorToolbar();
    documentService.currentDocumentIsPrivate.subscribe(visibility => this.privateDocument = visibility);
    documentService.myDocuments.subscribe(document => {
      if(document.editorId === this.documentId) {
        this.participants = document.participants.slice();
        this.participants.unshift(document.author);
      }
    });
  }

  get editorElement() {
    return (<HTMLElement>document.querySelector('#editor-container > div'));
  }

  get title() {
    return this._title && this._title.getValue();
  }

  set title(value) {
    if (this._title) {
      this._title.setValue(value);
    }
  }

  updateEditorToolbar() {
    for (let formatGroup of this.formats) {
      for (let format of formatGroup) {
        let [key, val] = this.annotationMap[format].split('=');
        this.buttons[format] = this.annotations[key] === val;
      }
    }
    this.currentTextType = this.annotations['paragraph/header'];
    if (this.currentTextType === null) {
      this.currentTextType = 'none';
    }
    this.currentTextSize = this.annotations['style/fontSize'];
    if (this.currentTextSize === null) {
      this.currentTextSize = '14px';
    }
    this.currentTextFamily = this.annotations['style/fontFamily'];
    if (this.currentTextFamily === null) {
      this.currentTextFamily = 'Arial';
    }
  }

  disableEditorToolbar() {
    for (let formatGroup of this.formats) {
      for (let format of formatGroup) {
        this.buttons[format] = false;
      }
    }
  }

  ngOnDestroy() {
    this.participants = [];
    this.documentId = undefined;
    this.documentService.close();
  }

  ngOnInit() {
    let widgets = {
      'img-link': {
        onInit: (parentElement, state) => parentElement.innerHTML = `<img src="${state}">`,
        onChangeState: (parentElement, before, state) => parentElement.innerHTML = `<img src="${state}">`
      }
    };

    this.editor = DocumentService.editor('editor-container', widgets, {});

    this.route.params.subscribe((param: any) => {
      this.documentId = param['id'];
      this.openDocument();
    });
  }

  openDocument() {

    this.documentService.open(this.documentId).then(cObject => {

      // Initialize the doc
      if (!cObject.root.get('doc')) {
        cObject.root.put('doc', cObject.createText(''));
      }

      // Initialize the doc's title
      if (!cObject.root.get('doc-title')) {
        cObject.root.put('doc-title', cObject.createString('New document'));
      }

      // Open the doc in the editor
      this._title = cObject.root.get('doc-title');
      this.editor.edit(cObject.root.get('doc'));

      this.editor.onSelectionChanged((range) => {
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

  annotate(format) {
    let [key, val] = this.annotationMap[format].split('=');
    let currentVal = this.annotations[key];
    if (currentVal === val) {
      val = null;
    }

    this.annotations[key] = val;
    this.editor.setAnnotation(key, val);
    this.editorElement.focus();
  }

  addImage(file) {
    let img = prompt('Image URL', 'http://lorempixel.com/600/600/');
    if (img) {
      this.editor.addWidget('img-link', img);
    }
  }

  changeTextType(textType) {
    this.currentTextType = textType;
    this.editor.setAnnotation('paragraph/header', textType);
  }

  changeTextSize(textSize) {
    this.currentTextSize = textSize;
    this.editor.setAnnotation('style/fontSize', textSize);
  }

  changeTextFamily(textFamily) {
    this.currentTextFamily = textFamily;
    this.editor.setAnnotation('style/fontFamily', textFamily)
  }
}

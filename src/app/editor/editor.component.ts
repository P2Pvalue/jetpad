import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DocumentService} from '../core/services';
import {ListenerService, UserService} from "../core/services";

@Component({
  selector: 'jp-editor',
  templateUrl: 'editor.component.html'
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
  currentTextFamily = 'Liberation Serif';
  currentColor = '#000000';
  currentBgColor = '#FFFFFF';
  annotations: Array<any>;
  hideAssessment = false;
  assesmentTop = 100;
  selectedRange = null;
  assessmentComment = '';
  hasVoted = false;
  outline: any;
  fontFamilies = ['Open Sans', 'Droid Serif', 'Liberation Sans', 'Liberation Serif', 'Roboto Mono'];

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

  constructor(private listenerService: ListenerService, private userService: UserService, private documentService: DocumentService, private route: ActivatedRoute) {
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
    return (<HTMLElement>document.querySelector('#canvas-container > div'));
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

  ngOnDestroy() {
    this.participants = [];
    this.documentId = undefined;
    this.documentService.close();
  }

  refreshOutline: Function;

  ngOnInit() {

    this.listenerService.bindListeners();
    this.userService.resume();

    this.refreshOutline = () => {
      this.outline = this.editor.getAnnotationSet('paragraph/header');
    }

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
      this._title = cObject.root.get('doc-title');
      this.editor.edit(cObject.root.get('doc'));

      this.editor.onSelectionChanged((range) => {
        if (range.lenght > 10) {
          this.hideAssessment = false;
          this.assesmentTop = range.node.parentElement.offsetTop + range.node.parentElement.offsetHeight;

        } else {
          this.hideAssessment = true;
        }
        this.selectedRange = range;
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

  annotate(format, value) {
    let [key, val] = this.annotationMap[format].split('=');
    if (val === '*') {
      val = value;
    }
    let currentVal = this.annotations[key];
    if (currentVal === val) {
      val = null;
    }

    // FIXME (SwellRT) Workarround for lists and paragraphs
    if (key === 'paragraph/header' || key === 'paragraph/listStyleType') {
      this.annotations['paragraph/header'] = 'none';
      this.annotations['paragraph/listStyleType'] = null;
      if (val === null) {
        key = 'paragraph/header';
        val = 'none';
      }
    }
    this.annotations[key] = val;
    this.editor.setAnnotation(key, val);
    this.editorElement.focus();
  }

  addLink() {
    let selection = this.editor.getSelection();
    let annotation = selection ? this.editor.getAnnotationInRange(selection, 'link') : null;
    let link = annotation ? annotation.value : null;
    link = prompt('Link URL', link ? link : 'http://');
    if (link) {
      this.editor.setAnnotation('link', link);
    } else {
      this.editor.clearAnnotation('link');
    }
    this.editorElement.focus();
  }

  addImage(file) {
    let img = prompt('Image URL', 'http://lorempixel.com/600/600/');
    if (img) {
      this.editor.addWidget('img-link', img);
    }
  }

  onVoted(agreed: boolean) {
    agreed ? this.assessmentComment = ' de acuerdo?' : this.assessmentComment = ' en desacuerdo?';
    this.hasVoted = true;
  }
}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'jp-editor',
  templateUrl: 'editor.component.html'
})

export class EditorComponent implements OnInit, OnDestroy {


ngOnInit() {

}

ngOnDestroy() {
  
}

//
// Below old implementation using SwellRT alpha
// To be removed
//

/*
  editor: any;
  title: any;
  documentId: any;
  participants = [];
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

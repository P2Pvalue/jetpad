import {Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, EditorService } from "../../services";

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html'
  })

export class EditorComponent implements OnInit, OnDestroy {

  _title: any;
  editor: any;

  wasError: boolean = false;
  msgError: string;

  formats: Array<Array<string>> = [
    ['bold', 'italic', 'underline', 'strikethrough'],
    // ['size', 'color_text', 'color_fill'],
    ['align_left', 'align_center', 'align_right'],
    ['list_bulleted', 'list_numbered']
  ];

  annotations: Array<any>;

  annotationMap = {
    'bold': 'style/fontWeight=bold',
    'italic': 'style/fontStyle=italic',
    'underline': 'style/textDecoration=underline',
    'strikethrough': 'style/textDecoration=line-through',
    'align_left': 'paragraph/textAlign=left',
    'align_center': 'paragraph/textAlign=center',
    'align_right': 'paragraph/textAlign=right',
    'list_bulleted': 'paragraph/listStyleType=unordered',
    'list_numbered': 'paragraph/listStyleType=decimal'
  };

  buttons: Map<string, boolean> = new Map<string, boolean>();

  constructor(
    private swellrt: EditorService,
    private userService: UserService,
    private route: ActivatedRoute
    ) {
      this.disableAllButtons();
  }

  get editorElem() {
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

  updateAllButtons() {
    for (let formatGroup of this.formats) {
      for (let format of formatGroup) {
        let [key, val] = this.annotationMap[format].split('=');
        this.buttons[format] = this.annotations && (this.annotations[key] === val);
      }
    }
  }

  disableAllButtons() {
    for (let formatGroup of this.formats) {
      for (let format of formatGroup) {
        this.buttons[format] = false;
      }
    }
  }

  ngOnDestroy() {
    this.swellrt.close();
  }

  ngOnInit() {

    let widgets = {

      'img-link' : {

        onInit: function(parentElement, state) {
          parentElement.innerHTML = `<img src="${state}">`;
        },

        onChangeState: function(parentElement, before, state) {
          parentElement.innerHTML = `<img src="${state}">`;
        }
      }

    };

    let annotations =  {};

    this.editor = EditorService.editor('editor-container', widgets, annotations);

    let user = this.userService.getUser();

      let id = this.route.snapshot.params['id'];
      this.swellrt.open(id).then(cObject => {

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
          this.updateAllButtons();
        });

        this.editorElem.addEventListener('focus', () => this.updateAllButtons());
        this.editorElem.addEventListener('blur', () => this.disableAllButtons());

      })
      .catch(error => {
        this.wasError = true;
        this.msgError = `Document doesn't exist or you don't have permission to open (${ error })`;
      });
  }

  annotate (format) {
    let [key, val] = this.annotationMap[format].split('=');
    let currentVal = this.annotations[key];
    if (currentVal === val) {
      val = null;
    }

    this.annotations[key] = val;
    this.editor.setAnnotation(key, val);
    this.editorElem.focus();
  }

  addImage (file) {
    let img = prompt('Image URL', 'http://lorempixel.com/600/600/');
    if (img) {
      this.editor.addWidget('img-link', img);
    }
  }
}

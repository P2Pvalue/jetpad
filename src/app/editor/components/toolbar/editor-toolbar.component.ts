import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

declare let window: any;

@Component({
  selector: 'jp-editor-toolbar',
  templateUrl: 'editor-toolbar.component.html'
})

export class EditorToolbarComponent implements OnInit {

  @Input() styles: any;
  @Output() styleSet: EventEmitter<any> = new EventEmitter();

  // old stuff

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

  buttons: Map<string, boolean> = new Map<string, boolean>();

  defaultHeading = '';

  defaultFontFamily = 'Open Sans';
  fontFamilies = ['Open Sans', 'Droid Serif', 'Liberation Sans', 'Liberation Serif', 'Roboto Mono'];

  textSizes = Array.from(new Array(72), (x,i) => i + 1).filter(x => x % 2 == 0 );

  ngOnInit() {

  }

  setStyle(style: string, value: any) {
    console.log("setting annotation "+style+" with value "+value)
    this.styleSet.emit({ name: style, value: value });
  }

}

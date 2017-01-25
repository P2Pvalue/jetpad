import {Component, Input} from "@angular/core";

@Component({
  selector: 'jp-editor-toolbar',
  templateUrl: 'editor-toolbar.component.html'
})

export class EditorToolbarComponent {
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

  fontFamilies = ['Open Sans', 'Droid Serif', 'Liberation Sans', 'Liberation Serif', 'Roboto Mono'];

  textSizes = Array.from(new Array(72), (x,i) => i + 1).filter(x => x % 2 == 0 );
}

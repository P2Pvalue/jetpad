 import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'jp-editor-canvas',
  templateUrl: 'editor-canvas.component.html'
})

export class EditorCanvasComponent  {
  @Input() public showCover: boolean = false;
  @Output() public coverEvent: EventEmitter<any> = new EventEmitter();

  public onClick(e) {
    this.showCover = false;
    this.coverEvent.emit('click');
  }
}

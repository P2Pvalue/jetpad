 import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'jp-editor-canvas',
  templateUrl: 'editor-canvas.component.html'
})

export class EditorCanvasComponent  {
  @Input() private showCover: boolean = false;
  @Output() private coverEvent: EventEmitter<any> = new EventEmitter();

  private onClick(e) {
    this.showCover = false;
    this.coverEvent.emit("click");
  }
}

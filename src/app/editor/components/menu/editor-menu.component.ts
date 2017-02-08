import { Component, Input, ViewChild, trigger, state, style, transition, animate } from '@angular/core';

@Component({
  selector: 'jp-editor-menu',
  templateUrl: 'editor-menu.component.html',
  animations: [
    trigger('outlineState', [
      state('inactive', style({
        display: 'none',
        transform: 'translateX(-30%)'
      })),
      state('active',   style({
        display: 'block',
        transform: 'translateX(0)'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})

export class EditorMenuComponent {

  @Input() collapsed: boolean;
  @Input() participants:any;
  @Input() entries:any = [
    {'text': 'titulo 1', 'type': 'h1'},
    {'text': 'titulo 1.1', 'type': 'h2'},
    {'text': 'titulo 2', 'type': 'h1'},
    {'text': 'titulo 2.1', 'type': 'h2'},
    {'text': 'titulo 2.2', 'type': 'h2'}
  ];
  @ViewChild('outline') outline:any;
  @ViewChild('popupExample') modal: any;

  showOutline: boolean = false;
  outlineState: string = 'inactive';
  toggleOutline() {
    console.log(this.outline);
    this.showOutline = !this.showOutline;
    this.outlineState = (this.outlineState == 'inactive') ? 'active': 'inactive';
  };

  openPopup() {
    this.modal.open(this.modal);
  }
}

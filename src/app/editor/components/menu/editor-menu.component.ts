import { Component, Input, ViewChild, trigger, state, style, transition, animate } from '@angular/core';
import { MyCustomModalComponent } from "./custom-modal.component";
import { EditorModule } from '../../index';
import { JetpadModalService } from '../../../core/services';


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

  constructor(private modalService: JetpadModalService){

  }

  toggleOutline() {
    console.log(this.outline);
    this.showOutline = !this.showOutline;
    this.outlineState = (this.outlineState == 'inactive') ? 'active': 'inactive';
  };

  openModal(boton:any): void{
    let modal$ = this.modalService.create(EditorModule, MyCustomModalComponent, {
      capullo: this.entries,
      select: (hola) => {
        alert('Selected ' + hola);
      },
      ok: (snacks) => {
        alert(snacks.join(', '));
      }
    });
    modal$.subscribe((ref) => {
      setTimeout(() => {
        // close the modal after 5 seconds
        //ref.destroy();
      }, 5000)
    })
  }
}

import { Component, Input } from "@angular/core";
import { EditorModule } from '../../index';
import { MyCustomModalComponent } from './custom-modal.component'
import { JetpadModalService } from '../../../core/services';

@Component({
  selector: 'jp-editor-header',
  templateUrl: 'editor-header.component.html',
})

export class EditorHeaderComponent {

  constructor(private modalService: JetpadModalService){

  }

  //document title
  @Input() title: string;
  @Input() participants: any;

  openModal(): void{
    let modal$ = this.modalService.create(EditorModule, MyCustomModalComponent, {
      capullo: ['uno','dos'],
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

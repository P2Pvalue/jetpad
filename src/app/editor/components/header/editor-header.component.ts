import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: 'jp-editor-header',
  templateUrl: 'editor-header.component.html',
})

export class EditorHeaderComponent {
  participants = [{
    name: 'pepe'
  },{
    name: 'emilio'
  },{
    name: 'rodrigo'
  },{
    name: 'fernando'
  },{
    name: 'casamayor'
  }];
}

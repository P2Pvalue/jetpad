import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionResolver } from "../core/resolver";
import {EditorComponent} from './components/canvas/editor-canvas.component';


const editorRoutes: Routes = [
  {
    path: 'edit/:id',
    component: EditorComponent,
    resolve: {
      session: SessionResolver
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(editorRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class EditorRoutingModule { }

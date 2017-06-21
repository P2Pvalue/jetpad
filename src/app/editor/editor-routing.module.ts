import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor.component';

const editorRoutes: Routes = [
  {
    path: 'edit/:id',
    component: EditorComponent
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

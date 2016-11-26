import {Component, Input} from "@angular/core";

@Component({
    selector: 'comment-assessment',
    template: `
        <div class="panel" [hidden]="!hasVoted">
          <div class="panel-body">
            <h5>¿Porqué está {{tipo}}</h5>
            {{texto}}
            <input type="text" placeholder="máximo 250 caracteres ...">
          </div>
        </div>
    `
})

export class CommentAssessment {
    @Input() tipo: string;
    @Input() hasVoted: boolean;
    @Input() texto: string;
}
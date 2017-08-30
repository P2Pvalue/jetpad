import { Modal } from '../../../core/services';
import { Component, OnInit } from '@angular/core';
import { CommentsService, SessionService } from '../../../core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'comments-modal',
  template: `
    <div class="modal show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" 
                data-dismiss="modal" aria-hidden="true" (click)="onCancel()">×</button>
            <h3 class="modal-title">
              Comments
            </h3>
          </div>

          <div class="modal-body scrollable-body">

          <jp-editor-comments
              [showInDialog]="true"
              [action]="action"
              [me]="me"
              [comment]="selectedComment$ | async"
              [selection]="selection"
              (commentEvent)="onCommentEvent($event)">
            </jp-editor-comments>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-primary"  (click)="onOk()">Close</button>
          </div>
        </div>
      </div>
    </div>
    `,
styles: [`

    .modal-content {
      height: inherit;
    }

    .scrollable-body {
      overflow-y: auto;
      max-height: 75vh;
      margin-bottom: 15px;
    }

  `]
})

@Modal()
export class CommentsModalComponent implements OnInit {

  // data
  public action: string;
  public me: any;
  public comment: any;
  public selection: any;

  public ok: Function;

  public destroy: Function;
  public closeModal: Function;
  public selectedComment$: Observable<any>;

  private user: any;

  constructor(private commentService: CommentsService, private sessionService: SessionService) {
      this.selectedComment$ = commentService.selectedComment$;
  }

  public ngOnInit(): void {
      this.sessionService.subject.subscribe((user) => {
          this.user = user;
      });
  }

  public onCancel(): void {
    this.onOk();
  }

  public onOk(): void {
    setTimeout(() => {
      this.closeModal();
    }, 150);
    this.ok();
  }

  public onCommentEvent(event) {
    if (event && event.type === 'close') {
      setTimeout(() => {
        this.closeModal();
      }, 150);
    }
    this.ok(event);

  }

}

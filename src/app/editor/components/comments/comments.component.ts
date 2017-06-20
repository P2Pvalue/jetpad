import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../core/model/comment';

declare let window: any;
declare let swellrt: any;

@Component({
    selector: 'jp-editor-comments',
    templateUrl: './comments.component.html'
})

export class CommentsComponent {

    @Input() public action: string = 'none'; // "edit", "create"

    // the current logged in user
    @Input() public me: any;

    // comment to edit
    @Input() public comment: Comment;

    // for new comments
    @Input() public selection: any;

    // array of comment annotations
    @Input() public comments: any[];

    @Input() public showInDialog: boolean;

    // notify actions to editor: new/delete comment
    @Output() public commentEvent: EventEmitter<any> = new EventEmitter();

    public isEditComment() {
        return (this.comment) ? true : false;
    }

    public isNewComment() {
        return this.action === 'new' && this.selection;
    }

    public getParticipantColor(user) {
        if (!user.profile.anonymous) {
            return user.profile.color;
        } else {
            return '#bdbdbd';
        }
    }

    public resolve() {
        this.commentEvent.emit({
            type: 'resolve',
            comment: this.comment.commentId
        });
    }

    public cancel() {
        this.action = 'none';
        this.comment = undefined;
        this.commentEvent.emit({
            type: 'close'
        });
    }

    public cancelReply(textarea) {
        if (!textarea.value) {
            this.cancel();
        } else {
            textarea.value = '';
        }

    }

    public getAnchorHref(elementId) {
        let link: string = window.location.origin + window.location.pathname;
        return link + '#' + elementId;
    }

    public getText() {
        let s = (this.action === 'edit' ? this.comment.selectedText : this.selection.text);
        if (!s) {
            return '(Not avilable)';
        }
        if (s.length > 120) {
            s = s.slice(0, 120);
            s += ' (...)';
        }
        return s;
    }

    public create(textarea: any) {
        this.action = 'none';
        this.commentEvent.emit({
            type: 'create',
            selection: this.selection,
            text: textarea.value
        });
        textarea.value = '';
    }

    public next() {
        this.commentEvent.emit({
            type: 'next'
        });
    }

    public prev() {
        this.commentEvent.emit({
            type: 'prev'
        });
    }

    public focus() {
        this.commentEvent.emit({
            type: 'focus',
            comment: this.comment.commentId
        });
    }

    public reply(textarea: any) {
        if (textarea.value && textarea.value.length > 0) {
            this.commentEvent.emit({
                type: 'replay',
                replay: textarea.value,
                comment: this.comment.commentId
            });
            textarea.value = '';
        }
    }

    public deleteReply(reply: any) {
        this.commentEvent.emit({
            type: 'delete',
            comment: this.comment.commentId,
            reply
        });
    }
}

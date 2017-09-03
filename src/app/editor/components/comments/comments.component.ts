import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../core/model/comment';
import { EditorService } from '../../../core/services/editor.service';

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

    @Input() public showInDialog: boolean;

    // notify actions to editor: new/delete comment
    @Output() public commentEvent: EventEmitter<any> = new EventEmitter();


    constructor(private editorService: EditorService) {

    }

    public isEditComment() {
        return (this.comment) && this.action !== 'new'  ? true : false;
    }

    public isNewComment() {
        return this.action === 'new' && this.selection;
    }

    public getParticipantProfile(participantAddress) {
        return this.editorService.getProfile(participantAddress);
    }

    public resolve() {
        this.commentEvent.emit({
            type: 'resolve',
            comment: this.comment
        });
    }

    public cancel() {
        this.commentEvent.emit({
            type: 'close'
        });
        this.comment = undefined;
        this.action = 'none';
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

    public trimText(text) {

        if (!text) {
            return '(Not avilable)';
        }
        if (text.length > 120) {
            text = text.slice(0, 120);
            text += ' (...)';
        }
        return text;
    }

    public create(textarea: any) {
        this.action = 'none';
        this.commentEvent.emit({
            type: 'create',
            range: this.selection.range,
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
            comment: this.comment
        });
    }

    public reply(textarea: any) {
        if (textarea.value && textarea.value.length > 0) {
            this.commentEvent.emit({
                type: 'reply',
                reply: textarea.value,
                comment: this.comment
            });
            textarea.value = '';
        }
    }

    public deleteReply(reply: any) {
        this.commentEvent.emit({
            type: 'delete',
            comment: this.comment,
            reply
        });
    }

    public focusReply() {
        let replyTextArea = document.getElementById('replyText');
        if (replyTextArea) {
            replyTextArea.scrollIntoView(false);
            replyTextArea.focus();
        }
    }
}

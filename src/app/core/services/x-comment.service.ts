import { Injectable } from '@angular/core';
import { SwellService } from './x-swell.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { Comment, CommentReplay } from '../model';

@Injectable()
export class CommentService {

    private static readonly ANNOTATION_KEY = 'comment';
    // private static readonly STATE_SUFFIX = '-state';

    public comments$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    public selectedComment$: BehaviorSubject<any> = new BehaviorSubject(null);

    private editor: any;

    private document: any;

    private currentComment: number;

    private commentsKey: string[] = [];

    private user: any;

    private annotationHighlight: any;

    constructor(private swellService: SwellService) {    }

    public initAnnotation() {
        this.swellService.getSdk().Editor.AnnotationRegistry.define('@mark', 'mark', {});
        this.swellService.getSdk().Editor.AnnotationRegistry.define('comment', 'comment', {});
        this.swellService.getSdk().Editor.AnnotationRegistry.setHandler('comment',
            (type, annot, event) => {
                if (this.swellService.getSdk().Annotation.EVENT_ADDED === type) {
                    this.refreshComments();
                }
                if (this.swellService.getSdk().Annotation.EVENT_REMOVED === type) {
                    this.refreshComments();
                }
            });
        this.swellService.getSdk().Editor.AnnotationRegistry.setHandler('@mark',
            (type, annot, event) => {
                if (this.swellService.getSdk().Annotation.EVENT_ADDED === type) {
                    console.log('highlight added');
                }
                if (this.swellService.getSdk().Annotation.EVENT_REMOVED === type) {
                    console.log('highlight removed');
                }
                if (this.swellService.getSdk().Annotation.EVENT_MOUSE === type
                    && event.type === 'mousedown') {
                    console.log('highlight mouse click');
                    console.log(event)
                }
            });
    }

    public initDocument(editor: any, document: any, user: any) {
        this.editor = editor;
        this.document = document;
        this.user = user;

        if (!this.document.get('comments')) {
            this.document.put('comments', this.swellService.getSdk().Map.create());
        }
        this.document.listen((event) => {
            if (event.key.indexOf('comment-') > -1) {
                this.refreshComments();
            }
        });
        this.currentComment = 0;
        this.refreshComments();
        if (this.commentsKey.length > 0) {
            let com = this.document.get('comments').get(this.commentsKey[0]);
            let ants = this.editor.getAnnotation('@mark', this.swellService.getSdk().Editor.Range.ALL);
            this.highlight(com, true, this.editor);
        }
    }

    public doSelectionHandler(range, editor, selection) {
        // TODO Are there any option to subscribe multiples
        // selection handlers in editor object???????
        if (selection && selection.range) {
            let ants = editor.getAnnotation([CommentService.ANNOTATION_KEY], range);
            if (ants && ants.comment) {
                let commentId = ants.comment.value;
                commentId = commentId.split(',').pop();
                this.currentComment =
                    this.commentsKey.findIndex((value) => value === commentId);
                this.refreshComments();
                this.highlight(this.document.get('comments').get(commentId), true, editor);
            }
        }
    }

    public createComment(range: any, commentText: string, user: any) {
        // generate id
        let timestamp = (new Date()).getTime();
        let sessionId = this.user.session.id;
        let id = 'comment-' + sessionId.slice(-5) + ('' + timestamp).slice(-5);

        // create data slot before annotation
        this.editor.setTextAnnotationOverlap(CommentService.ANNOTATION_KEY, id, range);

        let annotationParts = this.editor.seekTextAnnotationsByValue(
            CommentService.ANNOTATION_KEY, id, range);
        let firstReplay: CommentReplay = {
            author: this.parseAuthor(user),
            date: timestamp,
            text: commentText
        };
        let replies = [];
        replies.push(firstReplay);
        let comment: Comment = {
            commentId: id,
            user: this.parseAuthor(user),
            selectedText: this.calculateText(annotationParts),
            range: this.calculateContainerRange(annotationParts),
            focus: true,
            replies,
            isResolved: false
        };
        this.highlight(comment, true, this.editor);
        this.currentComment = this.document.get('comments').size() - 1;
        this.commentsKey.push(id);
        this.document.get('comments').put(id, comment);
        this.refreshComments();
        return comment;
    }

    public replay(commentId: string, text: string, user: any): any {
        let timestamp = (new Date()).getTime();
        let item: CommentReplay = {
            author: this.parseAuthor(user),
            date: timestamp,
            text
        };
        let old = this.document.get('comments').get(commentId);
        old.replies.push(item);
        this.document.get('comments').put(commentId, old);
        this.refreshComments();
    }

    public deleteReplay(commentId: string, reply: any) {
        let newObject = Object.assign({},
            this.document.get('comments').get(commentId),
            {replies: this.document.get('comments').get(commentId)
                .replies.filter((r) =>
                reply.author.profile.name !== r.author.profile.name || reply.date !== r.date)});
        this.document.get('comments').put(commentId, newObject);
        this.refreshComments();
    }

    public next() {
        if (!this.commentsKey[this.currentComment]) {
            return;
        }
        if (this.currentComment < this.document.get('comments').size() - 1) {
            this.currentComment++;
        }
        this.refreshComments();
    }

    public prev() {
        if (!this.commentsKey[this.currentComment]) {
            return;
        }
        if (this.currentComment > 0) {
            this.currentComment--;
        }
        this.refreshComments();
    }

    public resolve(commentId: string, user: any) {
        if (user && user.profile &&
            user.profile.name === this.document.get('comments')
                .get(commentId).user.profile.name) {
            this.setResolved(commentId);
            this.refreshComments();
        }
    }

    private refreshComments() {
        this.commentsKey = this.document.get('comments').keys();
        this.comments$.next(this.editor.seekTextAnnotations('comment',
            this.swellService.getSdk().Editor.Range.ALL)['comment']);
        this.selectedComment$.next(this.document
            .get('comments').get(this.commentsKey[this.currentComment]));
    }

    private setResolved(id: string) {
        let newObject = Object.assign({},
            this.document.get('comments').get(id),
            {isResolved: true});
        this.document.get('comments').put(id, newObject);
    }

    private calculateContainerRange(annotationParts: any) {
        let last = annotationParts[CommentService.ANNOTATION_KEY].length - 1;
        return this.swellService.getSdk().Editor.Range.create(
            annotationParts[CommentService.ANNOTATION_KEY][0].range.start,
            annotationParts[CommentService.ANNOTATION_KEY][last].range.end);
    }

    private calculateText(annotationParts: any) {
        let text: string = '';
        for (let i in annotationParts[CommentService.ANNOTATION_KEY]) {
            text += annotationParts[CommentService.ANNOTATION_KEY][i].text;
        }
        return text;
    }

    private parseAuthor(author: any) {
        return {
            profile: {
                name: author.profile.name,
                color: author.profile.color.cssColor,
                address: author.profile.address
            }
        };
    }

    private highlight(comment: any, activate: boolean, editor: any) {

        if (this.annotationHighlight) {
            this.annotationHighlight.clear();
            this.annotationHighlight = null;
        }

        if (activate) {
            editor.clearAnnotation('@mark', this.swellService.getSdk().Editor.Range.ALL);
            this.annotationHighlight = editor.setAnnotation('@mark',
                comment.commentId, comment.range);
        }
    }
}

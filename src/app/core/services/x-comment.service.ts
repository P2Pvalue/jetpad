import { Injectable } from '@angular/core';
import { SwellService } from './x-swell.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { Comment, CommentReplay } from '../model';

declare const swell: any;

@Injectable()
export class CommentService {

    private static readonly ANNOTATION_KEY = 'comment';

    /**
     * Gets the full text related with a comment
     *
     * @param editor editor's instance
     * @param commentId the comment id, value of a comment's annotations to find
     * @param range an initial range to look up comment's annotations
     */
    private static getCommentedText(editor: any, commentId: string, range: any) {

        let annotationParts = editor.seekTextAnnotationsByValue(
            CommentService.ANNOTATION_KEY, commentId, range);

        let text: string = '';

        for (let i in annotationParts[CommentService.ANNOTATION_KEY]) {
            if (annotationParts[CommentService.ANNOTATION_KEY][i]) {
                text += annotationParts[CommentService.ANNOTATION_KEY][i].text;
            }
        }
        return text;
    }

    /**
     * Get the minimun range of text spaning all comment's annotation for the
     * provided comment id.
     *
     * @param editor editor's instance
     * @param commentId the comment id, value of a comment's annotations to find
     * @param range an initial range to look up comment's annotations
     */
    private static getCommentContainerRange(editor: any, commentId: string, range: any) {

        let annotationParts = editor.seekTextAnnotationsByValue(
            CommentService.ANNOTATION_KEY, commentId, range);

        let length = annotationParts[CommentService.ANNOTATION_KEY].length;

        if (length > 0) {
            let last = annotationParts[CommentService.ANNOTATION_KEY].length - 1;
            return swell.Editor.Range.create(
                annotationParts[CommentService.ANNOTATION_KEY][0].range.start,
                annotationParts[CommentService.ANNOTATION_KEY][last].range.end);
        } else {
            return range;
        }
    }

    public comments$: BehaviorSubject<any> = new BehaviorSubject(null);

    public selectedComment$: BehaviorSubject<any> = new BehaviorSubject(null);

    private editor: any;

    private document: any;

    /**
     * Direct reference to swellrt's this.document.get('comments'),
     * a map of pairs { commentId, <Comment object> }
     */
    private comments: any;

    /** Track the selected comment by its key to avoid inconsistencies on remote updates */
    private selectedCommentId: string;

    /** The current selected comment */
    private selectedComment: any;

    /** A selected comment is highlighted in the editor with the transtion annotation @mark */
    private selectedCommentHighlightAnnotation: any;

    private user: any;

    constructor(private swellService: SwellService) {    }

    /** Call this method before Editor.createXXX()  */
    public initAnnotation() {
        SwellService.getSdk().Editor.AnnotationRegistry.define('@mark', 'mark', {});
        SwellService.getSdk().Editor.AnnotationRegistry.define('comment', 'comment', {});
        SwellService.getSdk().Editor.AnnotationRegistry.setHandler('comment',
            (type, annot, event) => {
                if (swell.Annotation.EVENT_ADDED === type) {
                    // TODO(Pablo) nothing to do
                }
                if (swell.Annotation.EVENT_REMOVED === type) {
                    // TODO(Pablo) check if the removed annotation is the current selected
                }
            });

        // TODO(Pablo) this is not necessary, please remove
        SwellService.getSdk().Editor.AnnotationRegistry.setHandler('@mark',
            (type, annot, event) => {
                if (swell.Annotation.EVENT_ADDED === type) {
                    console.log('highlight added');
                }
                if (swell.Annotation.EVENT_REMOVED === type) {
                    console.log('highlight removed');
                }
                if (swell.Annotation.EVENT_MOUSE === type
                    && event.type === 'mousedown') {
                    console.log('highlight mouse click');
                    console.log(event);
                }
            });
    }

    public initDocument(editor: any, document: any, user: any) {
        this.editor = editor;
        this.document = document;
        this.user = user;

        if (!this.document.get('comments')) {
            this.document.put('comments', swell.Map.create());
        }
        this.document.listen((event) => {
            // if selected comment is changed update it.
            if (event.key.startsWith('comment-') > 0 && this.comments.get(event.key)
                && this.selectedCommentId === event.key) {
                this.selectedComment = this.comments.get(event.key);
                this.notifyCurrentCommentChange();
            }
        });
        this.comments = this.document.get('comments');
        this.selectedCommentId = undefined;
    }

    public doSelectionHandler(range, editor, selection) {
        // TODO Are there any option to subscribe multiples
        // selection handlers in editor object???????
        if (selection && selection.range) {
            let ants = editor.getAnnotation([CommentService.ANNOTATION_KEY], range);
            if (ants && ants.comment) {
                let commentKey = ants.comment.value.split(',').pop();
                let comment = this.comments.get(commentKey);
                if (comment && !comment.isResolved) {
                    this.selectedCommentId = commentKey;
                    this.selectedComment = comment;
                    this.notifyCurrentCommentChange();
                    this.highlight(true);
                }
            }
        }
    }

    /**
     * Create a comment as response of a user interface action.
     *
     * @param range
     * @param commentText
     * @param user
     */
    public createComment(range: any, commentText: string, user: any) {

        // clear comments panels
        this.selectedComment = undefined;
        this.selectedCommentId = undefined;
        this.notifyCurrentCommentChange();

        // generate id
        let timestamp = (new Date()).getTime();
        let sessionId = this.user.session.id;
        let id = 'comment-' + sessionId.slice(-5) + ('' + timestamp).slice(-5);

        // create data slot before annotation <--- ????
        this.editor.setTextAnnotationOverlap(CommentService.ANNOTATION_KEY, id, range);

        let firstReplay: CommentReplay = {
            author: this.parseAuthor(user),
            date: timestamp,
            text: commentText
        };
        let replies = [];
        replies.push(firstReplay);
        let _range = range;
        let comment: Comment = {
            commentId: id,
            user: this.parseAuthor(user),
            selectedText: CommentService.getCommentedText(this.editor, id, range),
            range: _range,
            replies,
            isResolved: false
        };

        this.comments.put(id, comment);
        this.selectedCommentId = id;
        this.selectedComment =  this.comments.get(id);
        this.notifyCurrentCommentChange();
        this.highlight(true);
        return comment;
    }

    public reply(commentId: string, text: string, user: any): any {
        let timestamp = (new Date()).getTime();
        let item: CommentReplay = {
            author: this.parseAuthor(user),
            date: timestamp,
            text
        };
        let old = this.comments.get(commentId);
        old.replies.push(item);
        this.comments.put(commentId, old);
        this.notifyCurrentCommentChange();
    }

    public deleteReply(commentId: string, reply: any) {
        let newObject = Object.assign({},
            this.comments.get(commentId),
            {replies: this.comments.get(commentId)
                .replies.filter((r) =>
                    reply.author.profile.address !== r.author.profile.address
                    || reply.date !== r.date)});
        this.comments.put(commentId, newObject);
        this.notifyCurrentCommentChange();
    }

    public next() {
        let keys = this.comments.keys();
        let currentComment = keys.indexOf(this.selectedCommentId);
        if (currentComment < keys.length - 1) {
            this.selectedCommentId = keys[currentComment + 1];
            this.selectedComment = this.comments.get(this.selectedCommentId);
            this.notifyCurrentCommentChange();
            this.highlight(true);
        }
    }

    public prev() {

        let keys = this.comments.keys();
        let currentComment = keys.indexOf(this.selectedCommentId);
        if (currentComment > 0) {
            this.selectedCommentId = keys[currentComment - 1];
            this.selectedComment = this.comments.get(this.selectedCommentId);
            this.notifyCurrentCommentChange();
            this.highlight(true);
        }

    }

    public resolve(commentId: string, user: any) {
        if (user && user.profile &&
            user.profile.name === this.comments
                .get(commentId).user.profile.name) {
            this.setResolved(commentId);
            this.deleteAnnotationsOfComment(commentId);
        }
    }

    /**
     * Notifies observers about the current comment has been selected or changed.
     */
    private notifyCurrentCommentChange() {
        this.selectedComment$.next(this.selectedComment);
    }

    private setResolved(id: string) {
        let newObject = Object.assign({},
            this.comments.get(id),
            {isResolved: true});
        this.comments.put(id, newObject);
        this.notifyCurrentCommentChange();
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

    private deleteAnnotationsOfComment(comment) {
        let commentAnnotations = this.editor.seekTextAnnotations('comment',
            this.swellService.getSdk().Editor.Range.ALL)['comment'];
        commentAnnotations.forEach((item) => {
            let keys = item.value.split(',');
            let stop = false;
            keys.forEach((key) => {
                if (!stop && comment === key)  {
                    item.clear();
                    stop = true;
                }
            });
        });
    }

    /** Turn Highglight annotation on/off for the current selected comment  */
    private highlight(activate: boolean) {

        if (this.selectedCommentHighlightAnnotation) {
            this.selectedCommentHighlightAnnotation.clear();
            this.selectedCommentHighlightAnnotation = null;
        }

        if (activate) {
            // TODO(Pablo) not working!!!! sólo funciona si el comentario está recién creado!
            // quizás necesita depurar swellrt, pero esto antes funcionaba
            let containerRange
                = CommentService.getCommentContainerRange(
                    this.editor, this.selectedCommentId, this.selectedComment.range);
            this.selectedCommentHighlightAnnotation =
               this.editor.setAnnotation(
                   '@mark',
                    this.selectedCommentId,
                    containerRange);
        }
    }
}

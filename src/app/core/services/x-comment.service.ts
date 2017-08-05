import { Injectable } from '@angular/core';
import { SwellService } from './x-swell.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { Comment, CommentReplay } from '../model';

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
        let annotationParts = editor.getAnnotations(commentId, range);

        let text: string = '';

        for (let i in annotationParts[commentId]) {
            if (annotationParts[commentId][i]) {
                text += annotationParts[commentId][i].text;
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
        let annotations = editor.getAnnotations(commentId, range);
        if (annotations.hasOwnProperty(commentId)) {
            let comments = annotations[commentId];
            let length = comments.length;

            if (length > 0) {
                let last = comments[comments.length - 1];
                return SwellService.getSdk().Range.create(
                    comments[0].range.start,
                    comments[length - 1].range.end);
            } else {
                return range;
        }

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
    private selectedComment: any = null;

    /** A selected comment is highlighted in the editor with the transtion annotation @mark */
    private selectedCommentHighlightAnnotation: any;

    private user: any;

    /** Listen to remote changes in the current comment's data  */
    private selectedCommentRemoteListener: Function;

    constructor(private swellService: SwellService) {    }

    /** Call this method before Editor.createXXX()  */
    public initAnnotation() {


        SwellService.getSdk().Editor.AnnotationRegistry.define('@mark', 'mark', {});
        SwellService.getSdk().Editor.AnnotationRegistry.define('comment', 'comment', {});
        SwellService.getSdk().Editor.AnnotationRegistry.setHandler('comment',
            (event) => {

                if (event.domEvent) {
                    return;
                }

                if (event.type ===  SwellService.getSdk().AnnotationEvent.EVENT_REMOVED) {
                    // TODO remove annotation data
                }

            });
    }

    public initDocument(editor: any, document: any) {
        this.editor = editor;
        this.document = document;
        if (!this.document.node('comments')) {
            this.document.set('comments', SwellService.getSdk().Map.create());
        }
        this.comments = this.document.node('comments');
        this.selectedCommentId = undefined;

        this.selectedCommentRemoteListener = (event) => {

            if (event.type === SwellService.getSdk().Event.UPDATED_VALUE &&
                event.key === this.selectedCommentId) {

                if (event.target.isResolved) {
                    this.clearSelectedComment();
                } else {
                    this.selectedComment = Object.assign({}, this.comments.get(event.key));
                    this.notifyCurrentCommentChange();
                }
            }
        };

        this.comments.addListener(this.selectedCommentRemoteListener);

    }

    public doSelectionHandler(range, editor, selection) {

        if (selection && selection.range) {
            let anotations = editor.getAnnotations([CommentService.ANNOTATION_KEY], range);
            let annotationKeys = Object.getOwnPropertyNames(anotations);

            if (annotationKeys && annotationKeys.length > 0) {
                let annotationKey = annotationKeys[0];
                let commentAnnotation = anotations[annotationKey][0];
                let comment = this.comments.get(annotationKey);
                this.setSelectedComment(annotationKey, comment);
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
        this.clearSelectedComment();

        // generate id
        let timestamp = (new Date()).getTime();
        let sessionId = user.session.id;
        let id = 'comment/' + sessionId.slice(-5) + ('' + timestamp).slice(-5);

        this.editor.setAnnotationOverlap(id, id, range);

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
            selectedText: CommentService.getCommentedText(this.editor, id, range),
            range: {
                start: range.start,
                end: range.end
            },
            replies,
            isResolved: false
        };
        this.comments.put(id, comment);
        this.setSelectedComment(id, this.comments.get(id));
        return comment;
    }

    public reply(commentId: string, text: string, user: any): any {
        let timestamp = (new Date()).getTime();
        let item: CommentReplay = {
            author: this.parseAuthor(user),
            date: timestamp,
            text
        };
        let commentData = Object.assign({}, this.comments.get(commentId));
        commentData.replies.push(item);
        this.comments.put(commentId, commentData);
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
        // let allkeys = this.comments.keys();
        let allkeys = Object.getOwnPropertyNames(
            this.editor.getAnnotations('comment',  SwellService.getSdk().Range.ALL));
        let keys = [];
        // Filter out resolved comments
        allkeys.forEach((k) => {
            if (!this.comments.get(k).isResolved) {
                keys.push(k);
            }
        });
        if (keys.length >  0) {
            let currentComment = keys.indexOf(this.selectedCommentId);
            if (currentComment < keys.length - 1) {
                this.setSelectedComment(
                    keys[currentComment + 1],
                    this.comments.get(keys[currentComment + 1]));
            } else {
                this.setSelectedComment(keys[0], this.comments.get(keys[0]));
            }
        }
    }

    public prev() {
        // let allkeys = this.comments.keys();
        let allkeys = Object.getOwnPropertyNames(
            this.editor.getAnnotations('comment',  SwellService.getSdk().Range.ALL));
        let keys = [];
        // Filter out resolved comments
        allkeys.forEach((k) => {
            if (!this.comments.get(k).isResolved) {
                keys.push(k);
            }
        });
        if (keys.length > 0) {
            let currentComment = keys.indexOf(this.selectedCommentId);
            if (currentComment > 0) {
                this.setSelectedComment(
                    keys[currentComment - 1],
                    this.comments.get(keys[currentComment - 1]));
            } else {
                this.setSelectedComment(
                 keys[keys.length - 1],
                 this.comments.get(keys[keys.length - 1]));
            }
        }
    }

    public resolve(commentId: string) {
        this.setResolved(commentId);
        this.deleteAnnotationsOfComment(commentId);
        this.clearSelectedComment();
    }

    private clearSelectedComment() {
        this.highlight(false);
        this.selectedCommentId = undefined;
        this.selectedComment = undefined;
        this.notifyCurrentCommentChange();
    }

    private setSelectedComment(selectedCommentId: string, selectedComment: any) {

        this.selectedCommentId = selectedCommentId;
        this.selectedComment = Object.assign({}, selectedComment);

        let range = SwellService.getSdk().Range.create(
                       this.selectedComment.range.start,
                       this.selectedComment.range.end);
        this.selectedComment.selectedText 
            = CommentService.getCommentedText(
                        this.editor,
                        this.selectedCommentId,
                        range);

        this.notifyCurrentCommentChange();
        this.highlight(true);

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

    private deleteAnnotationsOfComment(commentId, comment = null) {
        this.editor.clearAnnotationOverlap(
            commentId,
            commentId,
            SwellService.getSdk().Range.ALL);
    }

    /** Turn Highglight annotation on/off for the current selected comment  */
    private highlight(activate: boolean) {

        if (this.selectedCommentHighlightAnnotation) {
            this.selectedCommentHighlightAnnotation = null;
            this.editor.clearAnnotation('@mark', SwellService.getSdk().Range.ALL);
        }

        if (activate) {
            let range = CommentService.getCommentContainerRange(
                        this.editor, this.selectedCommentId, SwellService.getSdk().Range.ALL);

            this.selectedCommentHighlightAnnotation =
               this.editor.setAnnotation(
                   '@mark',
                    '' + (new Date()).getTime(),
                   SwellService.getSdk().Range.create(
                       range.start,
                       range.end
                   ));
        }
    }
}

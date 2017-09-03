import { Injectable } from '@angular/core';
import { SwellService } from './swell.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { Comment, CommentReplay } from '../model';

@Injectable()
export class CommentsService {

    private static readonly ANNOTATION_KEY = 'comment';

    /**
     * Get the minimun range of text spaning all comment's annotations for the
     * provided comment id and its full text.
     *
     * @param editor editor's instance
     * @param commentId the comment id, value of a comment's annotations to find
     * @param range an initial range to look up comment's annotations
     */
    private static getCommentRangeAndText(editor: any, commentId: string, range: any) {

        let annotations = editor.getAnnotations(commentId, range);

        let calculatedRange = range;
        let calculatedText = '';

        if (!annotations.hasOwnProperty(commentId)) {
            return {
                range: calculatedRange,
                text: calculatedText
            };
        }

        // calculate range

        let comments = annotations[commentId];
        let length = comments.length;

        if (length > 0) {
            let last = comments[comments.length - 1];
            calculatedRange = {
                start: comments[0].range.start,
                end: comments[length - 1].range.end
            };
        }

        // calculate text

        for (let i in annotations[commentId]) {
            if (annotations[commentId][i]) {
                calculatedText += annotations[commentId][i].text;
            }
        }

        return {
            range: calculatedRange,
            text: calculatedText
        };
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
    private commentsChangeListener: Function;

    constructor(private swellService: SwellService) {    }

    /** Register custom annotations in swell. Call before creating editor instances. */
    public registerAnnotations() {

        SwellService.getSdk().Editor.AnnotationRegistry.define('@mark', 'mark', {});
        SwellService.getSdk().Editor.AnnotationRegistry.define('comment', 'comment', {});
        SwellService.getSdk().Editor.AnnotationRegistry.setHandler('comment',
            (event) => {

                if (event.domEvent) {
                    return;
                }

                if (event.type ===  SwellService.getSdk().AnnotationEvent.EVENT_CREATED) {
                    let comment = this.comments.get(event.annotation.key);
                    if (comment && comment.isResolved) {
                        comment.isResolved = false;
                        this.comments.set(event.annotation.key, Object.assign({}, comment));
                    }

                } else if (event.type ===  SwellService.getSdk().AnnotationEvent.EVENT_REMOVED) {
                    let comment = this.comments.get(event.annotation.key);
                    if (comment && !comment.isResolved) {
                        comment.isResolved = true;
                        this.comments.set(event.annotation.key, Object.assign({}, comment));
                    }
                }

            });
    }

    public getObjectKeys(o) {
        let result = [];
        // The array we will return
        for (let prop in o) {
            // For all enumerable properties
            if (o.hasOwnProperty(prop)) { // If it is an own property
                result.push(prop);
                // add it to the array.
            }
        }
        return result;
    }

    public setDocument(editor: any, document: any) {
        this.editor = editor;
        this.document = document;
        if (!this.document.node('comments')) {
            this.document.set('comments', SwellService.getSdk().Map.create());
        }


        //
        // Migrate comments from first jetpad version
        //

        // check if it's old comments map: one key 'comment' for all comments inside an array
        let oldAnnotationsArray: any[]
            = this.editor.getAnnotations(
                ['comment'],
                SwellService.getSdk().Editor.RANGE_ALL)['comment'];

        if (oldAnnotationsArray) {

            let newCommentsMap = {};

            // create new comments map
            if (!this.document.node('comments-temp')) {
                this.document.set('comments-temp', SwellService.getSdk().Map.create());
            }

            for (let k in oldAnnotationsArray) {
                if (!oldAnnotationsArray.hasOwnProperty(k)) { continue; }

                let _id = oldAnnotationsArray[k].value;
                let _state = this.document.node('comments').get(_id + '-state');
                let _replies: any[] = this.document.node('comments').get(_id);

                // recreate a new annotation
                let range = { start: oldAnnotationsArray[k].range.start,
                              end: oldAnnotationsArray[k].range.end };

                let replies = new Array();
                for (let _r of _replies) {
                    let r = {
                        author: _r.participantId,
                        date: _r.time,
                        text: _r.text
                    };
                    replies.push(r);
                }

                let comment: Comment = {
                    id: 'comment/' + _id,
                    resolved: _state.state !== 'open',
                    replies
                };

                if (!this.document.node('comments-temp').node(comment.id)) {
                    this.document.node('comments-temp').put(comment.id, comment);
                }

                // replace annotations

                this.editor.clearAnnotationOverlap(
                    'comment',
                    _id,
                    oldAnnotationsArray[k].range);

                this.editor.setAnnotationOverlap(comment.id, comment.id, range);

            }

            // replace map with comments data
            this.document.put('comments', this.document.node('comments-temp'));
            // keep comments-temp in case something went wrong
        }

        //
        // Migrate comments from first jetpad version - End
        //

        this.comments = this.document.node('comments');
        this.selectedCommentId = undefined;

        this.commentsChangeListener = (event) => {

            if (event.type === SwellService.getSdk().Event.UPDATED_VALUE &&
                event.key === this.selectedCommentId) {

                if (event.value) {
                    if (event.value.isResolved) {
                        this.clearSelectedComment();
                    } else {
                        this.setSelectedComment(event.key);
                    }
                }
            }
        };

        this.comments.addListener(this.commentsChangeListener);

    }

    public doSelectionHandler(range, editor, selection) {

        if (selection && selection.range) {
            let anotations = editor.getAnnotations([CommentsService.ANNOTATION_KEY], range);
            let annotationKeys = Object.getOwnPropertyNames(anotations);

            if (annotationKeys && annotationKeys.length > 0) {
                let annotationKey = annotationKeys[annotationKeys.length - 1];
                let commentAnnotation = anotations[annotationKey][0];
                let comment = this.comments.get(annotationKey);
                this.setSelectedComment(annotationKey);
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
        let commentId = 'comment/' + sessionId.slice(-5) + ('' + timestamp).slice(-5);

        this.editor.setAnnotationOverlap(commentId, commentId, range);

        let firstReplay: CommentReplay = {
            author: this.getUserId(user),
            date: timestamp,
            text: commentText
        };
        let replies = [];
        replies.push(firstReplay);

        let comment: Comment = {
            id: commentId,
            resolved: false,
            replies
        };
        this.comments.put(commentId, comment);
        this.setSelectedComment(commentId);
        return comment;
    }

    public reply(commentId: string, text: string, user: any): any {
        let timestamp = (new Date()).getTime();
        let item: CommentReplay = {
            author: this.getUserId(user),
            date: timestamp,
            text
        };
        let commentData = Object.assign({}, this.comments.get(commentId));
        commentData.replies.push(item);
        this.comments.put(commentId, commentData);
        // let the change handler for this.comments to update render
    }

    public deleteReply(commentId: string, reply: any) {
        let newObject = Object.assign({},
            this.comments.get(commentId),
            {replies: this.comments.get(commentId)
                .replies.filter((r) =>
                    reply.author !== r.author
                    || reply.date !== r.date)});
        this.comments.put(commentId, newObject);
        // let the change handler for this.comments to update render
    }

    public next() {
        // let allkeys = this.comments.keys();
        let allkeys = Object.getOwnPropertyNames(
            this.editor.getAnnotations('comment',  SwellService.getSdk().Editor.RANGE_ALL));
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
                    keys[currentComment + 1]);
            } else {
                this.setSelectedComment(keys[0]);
            }
        }
    }

    public prev() {
        // let allkeys = this.comments.keys();
        let allkeys = Object.getOwnPropertyNames(
            this.editor.getAnnotations('comment',  SwellService.getSdk().Editor.RANGE_ALL));
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
                    keys[currentComment - 1]);
            } else {
                this.setSelectedComment(
                 keys[keys.length - 1]);
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

    private setSelectedComment(commentId: string) {

        this.selectedCommentId = commentId;
        this.selectedComment = Object.assign({}, this.comments.get(commentId));

        let rangeAndText = CommentsService.getCommentRangeAndText(
                        this.editor,
                        commentId,
                        SwellService.getSdk().Editor.RANGE_ALL);

        this.selectedComment.selectedText = rangeAndText.text;

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

    private getUserId(user: any) {
        return user.profile.address;
    }

    private deleteAnnotationsOfComment(commentId, comment = null) {
        this.editor.clearAnnotationOverlap(
            commentId,
            commentId,
            SwellService.getSdk().Editor.RANGE_ALL);
    }

    /** Turn Highglight annotation on/off for the current selected comment  */
    private highlight(activate: boolean) {

        if (this.selectedCommentHighlightAnnotation) {
            this.selectedCommentHighlightAnnotation = null;
            this.editor.clearAnnotation('@mark', SwellService.getSdk().Editor.RANGE_ALL);
        }

        if (activate) {
            let range = CommentsService.getCommentRangeAndText(
                        this.editor,
                        this.selectedCommentId,
                        SwellService.getSdk().Editor.RANGE_ALL).range;

            this.selectedCommentHighlightAnnotation =
               this.editor.setAnnotation(
                   '@mark',
                    '' + (new Date()).getTime(), range);
        }
    }
}

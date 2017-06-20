export interface CommentReplay {
    author: any;
    text: string;
    date: number;
}

export interface Comment {
    commentId: string;
    selectedText: string;
    user: any;
    range: any; // merely the orignal range, that can actually change, use with caution.
    replies: CommentReplay[];
    isResolved: boolean;
}

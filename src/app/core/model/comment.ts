export interface CommentReplay {
    author: any;
    text: string;
    date: number;
}

export interface Comment {
    commentId: string;
    selectedText: string;
    user: any;
    range: any;
    focus: boolean;
    replies: CommentReplay[];
    isResolved: boolean;
}

export interface CommentReplay {
    author: string;
    text: string;
    date: number;
}

export interface Comment {
    id: string;
    replies: CommentReplay[];
    resolved: boolean;
}


declare let swellrt: any;

/**
  A Comment stands for a group of comment annotations sharing
  the same id.

  CommendsData is a SwellRT map<Key,Value>
  each comment use two different Keys:
  <comment-id> : array of replies
  <comment-id>-state : state of the comment

*/
export class Comment {

  public static readonly ANNOTATION_KEY = 'comment';
  public static readonly STATE_SUFFIX = '-state';


  private static calculateText(annotationParts: any) {
    let text: string = ""
    for (let i in annotationParts[Comment.ANNOTATION_KEY]) {
      text += annotationParts[Comment.ANNOTATION_KEY][i].text;
    }
    return text;
  }

  private static calculateContainerRange(annotationParts: any) {
    let last = annotationParts[Comment.ANNOTATION_KEY].length - 1;
    return swellrt.Editor.Range.create(
      annotationParts[Comment.ANNOTATION_KEY][0].range.start,
      annotationParts[Comment.ANNOTATION_KEY][last].range.end);
  }

  public static create(range: any, commentText: string, user: any, editor: any, commentsData: any) {

    // generate id
    let timestamp = (new Date()).getTime();
    let sessionId = user.session.id;
    let id = sessionId.slice(-5)+ (""+timestamp).slice(-5);

    // set annotation
    // let anot = editor.setAnnotation(Comment.ANNOTATION_KEY, id, range);
    editor.setTextAnnotationOverlap(Comment.ANNOTATION_KEY, id, range);
    let annotationParts = editor.seekTextAnnotationsByValue(Comment.ANNOTATION_KEY, id, range);

    commentsData.put(id, swellrt.List.create());
    commentsData.put(id+Comment.STATE_SUFFIX, {
      state: "open"
    })

    let comment = new Comment(id, user, editor, commentsData)
    comment.containerRange = Comment.calculateContainerRange(annotationParts);;
    comment.text = Comment.calculateText(annotationParts);;
    comment.reply(commentText, user);

    return comment;
  }

  public static get(id: string, annotation: any, user: any, editor: any, commentsData: any) {
    let comment = new Comment(id, user, editor, commentsData);
    let annotationParts = editor.seekTextAnnotationsByValue(Comment.ANNOTATION_KEY, id, swellrt.Editor.Range.ALL);
    comment.containerRange = Comment.calculateContainerRange(annotationParts);;
    comment.text = Comment.calculateText(annotationParts);;
    return comment;
  }


  private annotationHighlight: any;
  private containerRange: any;
  private text: string;

  constructor(public readonly id: string, private user: any, private editor: any, private commentsData: any) {
  }


  public getText() {
    return this.text;
  }

  public isResolved() {
    return this.commentsData.get(this.id+Comment.STATE_SUFFIX).state == "resolved";
  }

  public getItems() {

    // adapt a swellrt list to a pure js array
    // avoid using native js proxy view of swellrt
    // to keep as much compatibility as possible
    let array = new Array();
    let comments = this.commentsData.get(this.id);

    for (let i = 0; i < comments.size(); i++)
      array.push(comments.get(i));

    return array;
  }

  public deleteItem(index) {
      let comments = this.commentsData.get(this.id);
      comments.remove(index);
  }

  public highlight(activate: boolean) {

    if (this.annotationHighlight) {
      this.annotationHighlight.clear();
      this.annotationHighlight = undefined;
    }

    if (activate) {
        this.annotationHighlight = this.editor.setAnnotation('@mark',""+(new Date()).getTime(), this.containerRange);
    }
  }

  /** First replay is the comment */
  public reply(text: string, user: any) {

    let timestamp = (new Date()).getTime();
    let item = {
      participantId: this.user.profile.address,
      time: timestamp,
      text: text
    };

    this.commentsData.get(this.id).add(item);
  }

  public resolve() {
    this.commentsData.put(this.id+Comment.STATE_SUFFIX, {
      state: "resolved",
      participantId: this.user.profile.address
    });
    this.highlight(false);
    this.editor.clearTextAnnotationOverlap(Comment.ANNOTATION_KEY, this.id, this.containerRange);
  }

}

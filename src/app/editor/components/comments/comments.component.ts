import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BackendService } from "../../../core/services";
import * as Moment from "moment";
import { Comment } from "../../comment";

declare let window: any;
declare let swellrt: any;

@Component({
    selector: 'jp-editor-comments',
    templateUrl: './comments.component.html'
})

export class CommentsComponent {

  @Input() action: string = "none"; // "edit", "create"

  // the current logged in user
  @Input() me: any;

  // comment to edit
  @Input() comment: Comment;

  // for new comments
  @Input() selection: any;

  // array of comment annotations
  @Input() comments: Array<any>;

    // notify actions to editor: new/delete comment
  @Output() commentEvent: EventEmitter<any> = new EventEmitter();

  private profilesManager: any;

  constructor(private backend: BackendService) {

  }

  public ngOnInit() {
    this.backend.get()
      .then( s => {
        this.profilesManager = s.profilesManager;
      });
  }

  public isEditComment() {
    return this.action == "edit" && this.comment;
  }

  public isNewComment() {
    return this.action == "new" && this.selection;
  }

  private getMomentFromNow(timestamp) {
    return Moment(timestamp).fromNow();
  }

  public getParticipantSession(participantId) {
    // A safe value
    if (!this.profilesManager) {
      return {
          session: {
            online: false,
          },
          profile: {
            name: "(Unknown)",
            shortName: "(Unknown)",
            imageUrl: null,
            color: {
              cssColor: "rgb(255, 255, 255)"
            }
          }
      };
    }

    let profile = this.profilesManager.getProfile(swellrt.Participant.of(participantId));
    let participantSession = {
        profile: profile,
        session: {
          online: false
        }
      };


    return participantSession;
  }

  private create(textarea: any) {
    this.action = "none";
    this.commentEvent.emit({
      type: "create",
      selection: this.selection,
      text: textarea.value
    });
  }

  private next() {
    this.commentEvent.emit({
      type: "next"
    });
  }

  private prev() {
    this.commentEvent.emit({
      type: "prev"
    });
  }

  private focus() {
    this.commentEvent.emit({
      type: "focus"
    });
  }

  private reply(textarea: any) {
    if (textarea.value && textarea.value.length > 0) {
      this.comment.reply(textarea.value, this.me);
      textarea.value = "";
    }
  }

  public resolve() {
    this.action = "none";
    this.comment.resolve();
    this.comment = undefined;
  }

  public cancel() {
    this.action = "none";
    this.comment = undefined;
    this.commentEvent.emit({
      type: "close"
    });
  }

  public cancelReply(textarea) {
    if (!textarea.value) {
      this.cancel();
    } else {
      textarea.value = "";
    }

  }

  public getAnchorHref(elementId) {
    let link:string = window.location.origin + window.location.pathname;
    return link + "#" + elementId;
  }

  public getText() {
    let s = (this.action == "edit" ? this.comment.getText() : this.selection.text);
    if (!s) return "(Not avilable)";
    if (s.length > 120) {
      s = s.slice(0, 120);
      s += " (...)";
    }
    return s;
  }

}

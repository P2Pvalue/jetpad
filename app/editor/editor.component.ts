import { Component } from 'angular2/core';
import { OnInit } from 'angular2/core';
import { UserPanelComponent } from '../user-panel.component';
import { RouteParams } from 'angular2/router';
import { SwellRTService } from '../service/swellrt.service';
import { CObject } from '../data/cobject';


@Component({
    selector: 'editor',
    template: `

        <div class="row">

          <!-- Left bar -->
          <div class="col-md-3">

            <user-panel></user-panel>

            <div class="panel panel-default">

              <div class="panel-heading">

                <div id="editor-sidebar" class="btn-toolbar">
                  <div class="btn-group">
                    <button type="button" class="btn btn-default">
                      <span class="material-icons">toc</span>
                    </button>
                    <button type="button" class="btn btn-default">
                      <span class="material-icons">people</span>
                    </button>
                    <button type="button" class="btn btn-default">
                      <span class="material-icons">chat</span>
                    </button>
                  </div>
                </div>

              </div>

              <div class="panel-body">

                <!-- Outline -->

                <div id="editor-outline">
                  <ul>
                  <li><h4>Introduction</h4></li>
                  <h4>Abstract</h4>
                  <h4>Definitions</h4>
                  <h4>Definitive Solution</h4>
                  </ul>
                </div>


                <!-- Participants -->
                <!--
                <div id="editor-participants">

                  <div class="media">
                    <div class="media-left media-middle">
                      <a href="#">
                        <img class="media-object" height="40" src="images/user.jpeg" alt="">
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="media-heading">Andrés Reyero</h5>
                      <span>

                      </span>
                    </div>
                  </div>

                  <div class="media">
                    <div class="media-left media-middle">
                      <a href="#">
                        <img class="media-object" height="40" src="images/user.jpeg" alt="">
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="media-heading">Juana de Arco</h5>
                      <span>

                      </span>
                    </div>
                  </div>

                  <div class="media">
                    <div class="media-left media-middle">
                      <a href="#">
                        <img class="media-object" height="40" src="images/user.jpeg" alt="">
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="media-heading">Luis Tosar</h5>
                      <span>

                      </span>
                    </div>
                  </div>

                  <div class="media">
                    <div class="media-left media-middle">
                      <a href="#">
                        <img class="media-object" height="40" src="images/anonymous.png" alt="">
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="media-heading">Anonymous #1</h5>
                      <span>

                      </span>
                    </div>
                  </div>

                  <div class="media">
                    <div class="media-left media-middle">
                      <a href="#">
                        <img class="media-object" height="40" src="images/anonymous.png" alt="">
                      </a>
                    </div>
                    <div class="media-body">
                      <h5 class="media-heading">Anonymous #2</h5>
                      <span>

                      </span>
                    </div>
                  </div>


                </div>
                -->

              </div>

            </div><!-- panel -->



          </div><!-- Left bar -->

          <!-- Main area -->
          <div class="col-md-9">

            <div class="alert alert-dismissible alert-danger" *ngIf="wasError">
              <button type="button" class="close" data-dismiss="alert" (click)="wasError = false">×</button>
              <strong>{{msgError}}</strong>
            </div>

            <div class="panel panel-default">
              <div class="panel-body">
                <h4>{{title}}</h4>
              </div>
            </div>

              <div class="panel panel-default">
                <div class="panel-heading">

                  <div id="editor-toolbar" class="btn-toolbar">
                    <div class="btn-group">
                        <button type="button" class="btn btn-default">
                          <span class="material-icons">format_bold</span>
                        </button>
                        <button type="button" class="btn btn-default">
                          <span class="material-icons">format_italic</span>
                        </button>
                        <button type="button" class="btn btn-default">
                          <span class="material-icons">format_underlined</span>
                        </button>
                    </div>

                    <div class="btn-group">
                      <button type="button" class="btn btn-default">
                        <span class="material-icons">format_size</span>
                      </button>
                      <button type="button" class="btn btn-default">
                        <span class="material-icons">format_color_text</span>
                      </button>
                      <button type="button" class="btn btn-default">
                        <span class="material-icons">format_color_fill</span>
                      </button>
                    </div>

                    <div class="btn-group">
                      <button type="button" class="btn btn-default">
                        <span class="material-icons">format_align_left</span>
                      </button>
                      <button type="button" class="btn btn-default">
                        <span class="material-icons">format_align_center</span>
                      </button>
                      <button type="button" class="btn btn-default">
                        <span class="material-icons">format_align_right</span>
                      </button>
                    </div>

                </div>

                </div>


                <div id="editor-container" class="panel-body" style="min-height: 600px;">
                </div>

              </div>

          </div>

        </div>

    `,

    directives:[UserPanelComponent],
    providers: [SwellRTService]
  })



export class EditorComponent implements OnInit {

  editor: any;
  title: string;

  wasError: boolean = false;
  msgError: string;


  constructor(private _swellrt: SwellRTService,
    private _routeParams: RouteParams) {

  }

  ngOnInit() {

    if (!this.editor) {
      this.editor = this._swellrt.editor("editor-container");
    } else {
      this.editor.cleanUp();
    }

    this._swellrt.getUser().then(user => {

      this._swellrt.open(this._routeParams.get('id')).then(
        cObject => {

          // Initialize the doc
          if (!cObject.root.get("doc")) {
              cObject.root.put("doc", cObject.createText(""));
          }

          // Initialize the doc's title
          if (!cObject.root.get("doc-title")) {
            cObject.root.put("doc-title", cObject.createString("New document"));
          }

          // Open the doc in the editor
          this.title = cObject.root.get("doc-title").getValue();
          this.editor.edit(cObject.root.get("doc"));

        })
        .catch( error => {
          this.wasError = true;
          this.msgError = "Document doesn't exist or you don't have permission to open ("+error+")";
        });

    })
    .catch( error => {
      this.wasError = true;
      this.msgError = "There is any session open.";
    });
  }

}

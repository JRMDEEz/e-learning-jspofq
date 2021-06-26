import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../../firebaseHelper';
@Component({
  selector: 'instructions',
  templateUrl: '/assignment.instructions.template'
})
export class AssignmentInstructionsViewComponent {
  viewMode;
  courseId;
  assignmentId;
  instructions;
  submissionExists;
  type;
  assignmentTypes = firebaseData.AssignmentTypes;
  editorConfig: AngularEditorConfig = {
    editable: false,
    enableToolbar: false,
    showToolbar: false,
    sanitize: true,
    outline: false
  };
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.assignmentId = this.route.snapshot.queryParams.assignmentId;
    this.getassignment(this.courseId, this.assignmentId);
  }
  getassignment(courseId, assignmentId) {
    console.log('getting');
    this.viewMode = viewType.loading;
    this.firebaseHelper
      .getAssignment(courseId, assignmentId)
      .then((assignment: firebaseData.Assignment) => {
        this.viewMode = viewType.loaded;
        this.instructions = assignment.instructions;
        this.type = assignment.type;
        this.firebaseHelper
          .doesSubmissionExists(courseId, assignmentId)
          .then(exists => {
            this.viewMode = viewType.loaded;
            this.submissionExists = exists;
          })
          .catch(err => {
            this.viewMode = viewType.notfound;
            console.log('Error getting documents: ', err);
          });
        console.log('TYPE' + assignment.type);
        return;
      })
      .catch(err => {
        this.viewMode = viewType.notfound;
        console.log('Error getting documents: ', err);
        return;
      });
    return;
  }
}
enum viewType {
  loading,
  loaded,
  notfound
}

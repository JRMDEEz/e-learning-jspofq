import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebaseData from '../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../firebaseHelper';
@Component({
  selector: 'assignment',
  templateUrl: '/module.assignment.template'
})
export class StudentModuleAssignmentsViewComponent {
  /*viewMode;
  courseId;
  assignmentId;
  submissionId;
  type;
  tabs = [];
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
        this.firebaseHelper
          .doesSubmissionExists(courseId, assignmentId)
          .then(submissionId => {
            this.viewMode = viewType.loaded;
            this.submissionId = submissionId;
          })
          .catch(err => {
            this.viewMode = viewType.notfound;
            console.log('Error getting documents: ', err);
          });

        this.type = assignment.type;
      })
      .catch(err => {
        this.viewMode = viewType.notfound;
        console.log('Error getting documents: ', err);
      });
  }*/
}
enum viewType {
  loading,
  loaded,
  notfound
}

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../firebaseData';
import { firebaseHelper } from '../../../../../firebaseHelper';
import * as values from '../../../../../values';
@Component({
  selector: 'config',
  templateUrl: '/course.assignments.template'
})
export class TeacherCourseAssignmentsViewComponent {
  items = [];
  viewMode;
  courseId;
  assignmentTypes = firebaseData.AssignmentTypes;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.getassignments(this.courseId);
  }
  getassignments(courseId) {
    console.log('getting');
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getAssignments(courseId)
      .then((assignments: firebaseData.Assignments) => {
        console.log('got');
        this.viewMode = values.viewTypes.loaded;
        assignments.assignmentList.forEach(assignment => {
          this.add(assignment);
        });
        return;
      })
      .catch(err => {
        this.viewMode = values.viewTypes.notFound;
        console.log('Error getting documents: ', err);
        return;
      });
    return;
  }
  add(assignment: firebaseData.Assignment) {
    console.log('LOG: ' + assignment.due);
    let formattedDate;
    let formattedTime;
    if (assignment.due != null) {
      console.log('convert');
      const datepipe: DatePipe = new DatePipe('en-US');
      formattedDate = datepipe.transform(assignment.due, 'd MMMM');
      formattedTime = datepipe.transform(assignment.due, 'h:mm a');
    }
    this.items.push({
      id: assignment.id,
      type: firebaseData.assignmentTypeAttributes[assignment.type].icon,
      title: assignment.title == null ? 'untitled' : assignment.title,
      maxScore: assignment.maxScore,
      due:
        assignment.due == null
          ? null
          : {
              date: formattedDate,
              time: formattedTime
            }
    });
  }
  addAssignment(assignmentType: firebaseData.AssignmentTypes) {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .newAssignment(this.courseId, assignmentType)
      .then((newAssignment: firebase.default.firestore.DocumentData) => {
        this.router.navigate(['../assignment'], {
          queryParamsHandling: 'merge',
          queryParams: { assignmentId: newAssignment.id, new: true },
          relativeTo: this.route
        });
      });
  }
  clear() {
    this.items = [];
  }
}

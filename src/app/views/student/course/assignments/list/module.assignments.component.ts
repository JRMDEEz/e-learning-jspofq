import { DatePipe } from '@angular/common';
import { DateFormatter } from '@angular/common/src/pipes/intl';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebaseData from '../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../firebaseHelper';
@Component({
  selector: 'assignments',
  templateUrl: '/module.assignments.template'
})
export class StudentModuleAssignmentsListViewComponent {
  items = [];
  viewMode;
  courseId;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.getassignments(this.courseId);
  }
  getassignments(courseId) {
    console.log('getting');
    this.viewMode = viewType.loading;
    this.firebaseHelper
      .getAssignments(courseId)
      .then((assignments: firebaseData.Assignments) => {
        console.log('got');
        this.viewMode = viewType.loaded;
        assignments.assignmentList.forEach(assignment => {
          this.add(assignment);
        });
        return;
      })
      .catch(err => {
        this.viewMode = viewType.notfound;
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
      title: assignment.title,
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
  clear() {
    this.items = [];
  }
}
enum viewType {
  loading,
  loaded,
  notfound
}

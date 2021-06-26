import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebaseData from '../../../../firebaseData';
import { firebaseHelper } from '../../../../firebaseHelper';
import * as values from '../../../../values';
@Component({
  selector: 'module',
  templateUrl: '/course.template'
})
export class TeacherCourseViewComponent {
  viewMode;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute) {}
  courseId;
  thumbnail;
  title;
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.getcourses();
  }
  getcourses() {
    console.log('getting');
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getCourse(this.courseId)
      .then((course: firebaseData.Course) => {
        console.log('got');
        this.viewMode = values.viewTypes.loaded;
        this.title = course.title;
        this.thumbnail = course.thumbnail;
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.log('Error getting documents: ', err);
        return;
      });
  }
}

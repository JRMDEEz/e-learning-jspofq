import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebaseData from '../../../../firebaseData';
import { firebaseHelper } from '../../../../firebaseHelper';
import * as values from '../../../../values';
@Component({
  selector: 'home',
  templateUrl: '/home.template'
})
export class TeacherHomeViewComponent {
  items = [];
  viewMode;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.getcourses();
  }
  getcourses() {
    console.log('getting');
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getCourses()
      .then((courses: firebaseData.Courses) => {
        console.log('got');
        this.viewMode = values.viewTypes.loaded;
        courses.courseList.forEach(course => {
          console.log(course.title);
          this.add(course);
        });
        return;
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.log('Error getting documents: ', err);
        return;
      });
    return;
  }
  add(course: firebaseData.Course) {
    this.items.push({
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail,
      subject: course.subject,
      students: course.students != null ? course.students.length : 0
    });
  }
  clear() {
    this.items = [];
  }
  addCourse() {
    this.firebaseHelper
      .newCourse()
      .then((newCourse: firebase.default.firestore.DocumentData) => {
        this.router.navigate(['../course/config'], {
          queryParams: { courseId: newCourse.id, new: true },
          relativeTo: this.route
        });
      });
  }
}
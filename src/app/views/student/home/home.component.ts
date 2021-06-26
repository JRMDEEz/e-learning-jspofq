import { Component } from '@angular/core';
import * as firebaseData from '../../../../firebaseData';
import { firebaseHelper } from '../../../../firebaseHelper';
@Component({
  selector: 'home',
  templateUrl: '/home.template'
})
export class StudentHomeViewComponent {
  items = [];
  viewMode;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  ngOnInit() {
    this.getcourses();
  }
  getcourses() {
    console.log('getting');
    this.viewMode = viewType.loading;
    this.firebaseHelper
      .getCourses()
      .then((courses: firebaseData.Courses) => {
        console.log('got');
        this.viewMode = viewType.loaded;
        courses.courseList.forEach(course => {
          this.add(course);
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
  add(course: firebaseData.Course) {
    this.items.push({
      id: course.id,
      title: course.title,
      thumbnail: course.thumbnail
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

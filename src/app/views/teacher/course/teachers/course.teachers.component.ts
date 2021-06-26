import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../firebaseData';
import { firebaseHelper } from '../../../../../firebaseHelper';
import * as values from '../../../../../values';
@Component({
  selector: 'teachers',
  templateUrl: '/course.teachers.template'
})
export class TeacherCourseTeachersViewComponent {
  viewMode;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  courseId;
  course;
  items = [];
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;

    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getCourse(this.courseId)
      .then((course: firebaseData.Course) => {
        this.course = course;
        this.getUsers();
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.log('Error getting documents: ', err);
      });
  }
  getUsers() {
    this.firebaseHelper
      .getUsers(this.course.teachers)
      .then((users: firebaseData.Users) => {
        this.viewMode = values.viewTypes.loaded;
        //verry inefficient maybe can get by using data().get(userid)??
        this.addAll(users);
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.log('Error getting documents: ', err);
      });
  }
  search;
  usersList = [];
  selectedUsers = [];
  hasNext;
  modalMode;
  searchTeachers() {
    this.lastquery = null;
    this.usersList = [];
    this.getTeachers();
  }
  userSelected(user) {
    if (user.selected) {
      this.selectedUsers.slice;
      for (let i = 0; i < this.selectedUsers.length; i++) {
        if (this.selectedUsers[i].id == user.id) {
          this.selectedUsers.slice(i, 1);
          break;
        }
      }
    } else {
      this.selectedUsers.push(user);
    }
  }
  private lastquery;
  getTeachers() {
    this.modalMode = values.viewTypes.loading;
    this.firebaseHelper
      .getAllTeachers(this.search, this.lastquery)
      .then((snapshot: firebase.default.firestore.QuerySnapshot) => {
        this.hasNext = snapshot.docs.length != 0;
        if (this.hasNext) {
          this.lastquery = snapshot.docs[snapshot.docs.length - 1];
        }
        var users = firebaseData.Users.Converter.fromFirestore(snapshot);
        users.userList.forEach((user: firebaseData.User) => {
          var matched = false;
          this.course.teachers.forEach(student => {
            if (student == user.id) {
              matched = true;
              return;
            }
          });
          if (!matched) {
            var selected;
            this.selectedUsers.forEach(seluser => {
              selected = seluser.id == user.id;
            });
            this.usersList.push({
              profile: user.profile,
              userName: user.userName,
              id: user.id,
              selected: selected
            });
          }
        });
        this.modalMode = values.viewTypes.loaded;
      })
      .catch(err => {
        this.modalMode = values.viewTypes.error;
        console.log('Error getting documents: ', err);
      });
  }
  addTeachers() {
    this.viewMode = values.viewTypes.loading;
    var addUsers = this.course.teachers;
    if (addUsers == null) addUsers = [];
    this.selectedUsers.forEach(user => {
      if (user.selected) {
        addUsers.push(user.id);
        this.items.push(user);
      }
    });
    this.firebaseHelper
      .submitCourse(this.courseId, this.course)
      .then((doc: firebase.default.firestore.DocumentData) => {
        this.getUsers();
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.log('Error getting documents: ', err);
      });
  }
  addAll(users: firebaseData.Users) {
    this.items = [];
    users.userList.forEach((user: firebaseData.User) => {
      this.items.push({
        profile: user.profile,
        userName: user.userName,
        id: user.id
      });
    });
  }
}

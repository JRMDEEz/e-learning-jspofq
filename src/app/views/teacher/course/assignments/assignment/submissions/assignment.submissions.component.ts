import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import firebase from 'firebase/app';
import * as firebaseData from '../../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../../firebaseHelper';
import * as values from '../../../../../../../values';
@Component({
  selector: 'submissions',
  templateUrl: '/assignment.submissions.template'
})
export class TeacherAssignmentSubmissionsViewComponent {
  viewMode;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  courseId;
  assignmentId;
  items = [];
  due;
  filterByDisplay = ['All', 'Submitted', 'Not Submitted'];
  filterBy = FilterBy.all;
  FilterBy = FilterBy;
  timenow = firebase.firestore.Timestamp.now().toMillis();
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.assignmentId = this.route.snapshot.queryParams.assignmentId;

    this.viewMode = values.viewTypes.loading;
    this.getSubmissions();
  }
  users;
  submissions;
  refreshList() {
    this.items = [];
    this.viewMode = values.viewTypes.loading;
    //verry inefficient maybe can get by using data().get(userid)??
    this.users.userList.forEach((user: firebaseData.User) => {
      var submitted = false;
      this.submissions.submissionList.forEach(
        (submission: firebaseData.Submission) => {
          if (submission.id == user.id) {
            submitted = true;
            if (
              this.filterBy == FilterBy.all ||
              this.filterBy == FilterBy.submitted
            )
              this.add(submission, user);
            return;
          }
        }
      );
      if (!submitted) {
        if (
          this.filterBy == FilterBy.all ||
          this.filterBy == FilterBy.notSubmitted
        )
          this.add(null, user);
      }
    });
    this.viewMode = values.viewTypes.loaded;
  }
  getSubmissions() {
    this.firebaseHelper
      .getSubmissions(this.courseId, this.assignmentId)
      .then((submissions: firebaseData.Submissions) => {
        this.firebaseHelper
          .getAssignment(this.courseId, this.assignmentId)
          .then((assignment: firebaseData.Assignment) => {
            this.due = assignment.due;
            this.firebaseHelper
              .getCourse(this.courseId)
              .then((course: firebaseData.Course) => {
                this.firebaseHelper
                  .getUsers(course.students)
                  .then((users: firebaseData.Users) => {
                    this.users = users;
                    this.submissions = submissions;
                    this.refreshList();
                  })
                  .catch(err => {
                    this.viewMode = values.viewTypes.error;
                    console.log('Error getting documents: ', err);
                  });
              })
              .catch(err => {
                this.viewMode = values.viewTypes.error;
                console.log('Error getting documents: ', err);
              });
          })
          .catch(err => {
            this.viewMode = values.viewTypes.error;
            console.log('Error getting documents: ', err);
          });
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.log('Error getting documents: ', err);
      });
  }
  add(submission: firebaseData.Submission, user: firebaseData.User) {
    var formattedDate;
    var formattedTime;
    if (submission != null) {
      console.log('convert');
      const datepipe: DatePipe = new DatePipe('en-US');
      formattedDate = datepipe.transform(submission.createdAt, 'd MMMM');
      formattedTime = datepipe.transform(submission.createdAt, 'h:mm a');
    }
    this.items.push({
      profile:
        'https://firebasestorage.googleapis.com/v0/b/e-learning-88aa0.appspot.com/o/assets%2Fdefault-user.png?alt=media&token=ae184283-9555-45ed-bf96-9cab7391f4bc',
      userName: user.userName,
      id: user.id,
      submitted:
        submission == null
          ? null
          : {
              milis: submission.createdAt,
              date: formattedDate,
              time: formattedTime
            },
      score: submission == null ? null : submission.score
    });
  }
}
enum FilterBy {
  all,
  submitted,
  notSubmitted
}

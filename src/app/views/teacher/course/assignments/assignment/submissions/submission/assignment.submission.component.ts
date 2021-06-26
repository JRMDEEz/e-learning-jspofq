import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../../../firebaseHelper';
import * as values from '../../../../../../../../values';
@Component({
  selector: 'submissions',
  templateUrl: '/assignment.submission.template'
})
export class TeacherAssignmentSubmissionViewComponent {
  courseId;
  assignmentId;
  submissionId;
  assignmentTypes = firebaseData.AssignmentTypes;
  assignment: firebaseData.Assignment;
  submission;
  viewMode;
  selectedStudent: number = 0;
  students = [];
  submitted;
  selectedScale = [];
  editmode = false;
  flags = firebaseData.FlagTypes;
  flagAttr = firebaseData.flagTypeAttributes;
  editorConfig: AngularEditorConfig = {
    editable: false,
    enableToolbar: false,
    showToolbar: false,
    sanitize: true,
    outline: false
  };
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.assignmentId = this.route.snapshot.queryParams.assignmentId;
    this.getCourse();
    this.flags.missing;
  }
  getCourse() {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getCourse(this.courseId)
      .then((course: firebaseData.Course) => {
        if (course.students != null) {
          this.firebaseHelper
            .getUsers(course.students)
            .then((users: firebaseData.Users) => {
              this.addAll(users);
              this.getAssignment();
            })
            .catch(err => {
              console.log(err);
              this.viewMode = values.viewTypes.error;
            });
        } else {
          this.getAssignment();
        }
      })
      .catch(err => {
        console.log(err);
        this.viewMode = values.viewTypes.error;
      });
  }
  refreshSelected() {
    if (this.assignment.rubric != null) {
      this.selectedScale = [];
      for (
        let rubrics = 0;
        rubrics < this.assignment.rubric.length;
        rubrics++
      ) {
        var highestrealative = 0;
        if (this.submission.submission.rubric == null) break;
        var comparison = this.submission.submission.rubric[rubrics];
        console.log('COMp ' + comparison);
        for (
          let scales = 0;
          scales < this.assignment.rubric[rubrics].scale.length;
          scales++
        ) {
          var currentscale = this.assignment.rubric[rubrics].scale[scales]
            .scaleNumber;

          if (comparison == null) {
            console.log('vreaking.. ');
            highestrealative = null;
            break;
          }
          console.log('SCALE ' + currentscale);
          if (currentscale <= comparison) {
            highestrealative = scales;
          }
        }
        console.log('RELATIVE ' + highestrealative);
        this.selectedScale.push(highestrealative);
      }
    }
  }
  saveRubric() {
    this.submission.submission.score = firebaseData.RubricSubmissionToMaxScore(
      this.submission.submission.rubric
    );
    this.editmode = true;
  }
  getAssignment() {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getAssignment(this.courseId, this.assignmentId)
      .then((assignment: firebaseData.Assignment) => {
        this.assignment = assignment;
        this.route.queryParams.subscribe(p => {
          this.submissionId = p.submissionId;
          this.getSubmission();
        });
      })
      .catch(err => {
        console.log(err);
        this.viewMode = values.viewTypes.error;
      });
  }
  displaySubmitted() {
    const datepipe: DatePipe = new DatePipe('en-US');
    this.submitted = null;
    if (this.submission.submission.createdAt != null) {
      this.submitted = datepipe.transform(
        this.submission.submission.createdAt,
        'MMMM d, h:mm a'
      );
    }
  }
  getSubmission() {
    this.viewMode = values.viewTypes.loading;
    if (this.assignment.type == firebaseData.AssignmentTypes.dropbox) {
      this.firebaseHelper
        .getDropboxSubmission(
          this.courseId,
          this.assignmentId,
          this.submissionId
        )
        .then((dropboxSub: firebaseData.DropboxSubmission) => {
          this.submission = dropboxSub;
          this.displaySubmitted();
          this.refreshSelected();
          this.viewMode = values.viewTypes.loaded;
        })
        .catch(err => {
          console.log(err);
          this.viewMode = values.viewTypes.error;
        });
    }
    if (this.assignment.type == firebaseData.AssignmentTypes.essay) {
      console.log('essay');
      this.firebaseHelper
        .getEssaySubmission(this.courseId, this.assignmentId, this.submissionId)
        .then((essaySub: firebaseData.EssaySubmission) => {
          this.submission = essaySub;
          console.log(this.submission.essay);
          this.displaySubmitted();
          this.refreshSelected();
          this.viewMode = values.viewTypes.loaded;
        })
        .catch(err => {
          console.log(err);
          this.viewMode = values.viewTypes.error;
        });
    }
  }
  resetRubric() {
    this.submission.submission.rubric = null;
    this.refreshSelected();
  }
  sanitizeRubric() {
    if (this.submission.submission.rubric == null)
      this.submission.submission.rubric = [];
    for (let i = 0; i < this.assignment.rubric.length; i++) {
      if (this.submission.submission.rubric.length < i) {
        this.submission.submission.rubric.push(null);
      }
    }
  }
  addAll(users: firebaseData.Users) {
    var submissionId = this.route.snapshot.queryParams.submissionId;
    this.students = [];
    var pos = 0;
    users.userList.forEach((user: firebaseData.User) => {
      if (submissionId == user.id) {
        this.selectedStudent = pos;
        console.log(user.userName);
      }
      this.students.push({
        profile: user.profile,
        userName: user.userName,
        id: user.id
      });
      pos++;
    });
  }
  nextSubmission() {
    if (this.editmode) {
      this.submitDropbox().then(() => {
        this.selectedStudent++;
        this.setSelectedStudent();
      });
    } else {
      this.selectedStudent++;
      this.setSelectedStudent();
    }
  }
  setSelectedStudent() {
    this.router.navigate([], {
      queryParams: { submissionId: this.students[this.selectedStudent].id },
      queryParamsHandling: 'merge',
      relativeTo: this.route
    });
  }
  previousSubmission() {
    if (this.editmode) {
      this.submitDropbox().then(() => {
        this.selectedStudent--;
        this.setSelectedStudent();
      });
    } else {
      this.selectedStudent--;
      this.setSelectedStudent();
    }
  }
  setFlag(flags) {
    this.submission.submission.flags = flags;
    console.log(this.submission.submission.flags);
    //submit submission or show save
    this.submitDropbox();
  }
  submitDropbox() {
    return new Promise(resolve => {
      this.viewMode = values.viewTypes.loading;
      if (this.assignment.type == firebaseData.AssignmentTypes.dropbox) {
        this.firebaseHelper
          .submitDropbox(
            this.courseId,
            this.assignmentId,
            this.submission,
            this.students[this.selectedStudent].id
          )
          .then(doc => {
            this.viewMode = values.viewTypes.loaded;
            this.editmode = false;
            resolve(doc);
          })
          .catch(err => {
            console.log(err);
            this.viewMode = values.viewTypes.error;
          });
      }
    });
  }
}

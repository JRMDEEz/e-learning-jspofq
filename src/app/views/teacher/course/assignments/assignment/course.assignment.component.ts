import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../firebaseHelper';
import firebase from 'firebase/app';
import * as values from '../../../../../../values';
@Component({
  selector: 'assignment',
  templateUrl: '/course.assignment.template'
})
export class TeacherCourseAssignmentViewComponent {
  timeNow;
  given;
  changeDate;
  viewMode;
  courseId;
  assignmentId;
  editmode;
  due;
  start;
  submissions;
  toGrade = 0;
  studentDue = 0;
  graded = 0;
  studentSubmitted = 0;
  assignmentType = firebaseData.AssignmentTypes;
  assignmentIcon = firebaseData.assignmentTypeAttributes;
  assignment: firebaseData.Assignment;
  editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']]
  };
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.assignmentId = this.route.snapshot.queryParams.assignmentId;
    this.getassignment(this.courseId, this.assignmentId);
    this.initCalendar();
  }
  getassignment(courseId, assignmentId) {
    console.log('getting');
    this.toGrade = 0;
    this.studentDue = 0;
    this.graded = 0;
    this.studentSubmitted = 0;
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getAssignment(courseId, assignmentId)
      .then((assignment: firebaseData.Assignment) => {
        this.firebaseHelper
          .getCourse(courseId)
          .then((course: firebaseData.Course) => {
            this.firebaseHelper
              .getSubmissions(courseId, assignmentId)
              .then((submissions: firebaseData.Submissions) => {
                this.studentSubmitted = submissions.submissionList.length;
                submissions.submissionList.forEach(
                  (submission: firebaseData.Submission) => {
                    if (submission.score == null) {
                      this.toGrade++;
                    }
                  }
                );
                this.studentDue =
                  course.students.length - this.studentSubmitted;
                this.graded = submissions.submissionList.length - this.toGrade;

                this.assignment = assignment;
                this.refreshDateUI();
                this.viewMode = values.viewTypes.loaded;
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
  refreshDateUI() {
    const datepipe: DatePipe = new DatePipe('en-US');
    this.start = null;
    this.due = null;
    this.given = false;
    this.timeNow = firebase.firestore.Timestamp.now().toMillis();
    console.log('NOw: ' + this.timeNow);
    if (this.assignment.start != null) {
      this.start = datepipe.transform(this.assignment.start, 'MMMM d, h:mm a');
      this.given =
        this.assignment.start <= firebase.firestore.Timestamp.now().toMillis();
      console.log('GIVEN: ' + this.given);
      console.log(this.assignment.start);
    }
    if (this.assignment.due != null)
      this.due = datepipe.transform(this.assignment.due, 'MMMM d, h:mm a');
  }
  isHomeRoute() {
    return !this.router.url.includes('/submission');
  }
  deleteAssignment() {
    this.firebaseHelper
      .deleteAssignment(this.courseId, this.assignmentId)
      .then(() => {
        this.router.navigate(['../assignments'], {
          queryParamsHandling: 'merge',
          relativeTo: this.route
        });
      });
  }
  saveAssignment() {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .submitAssignment(this.courseId, this.assignmentId, this.assignment)
      .then(result => {
        this.viewMode = values.viewTypes.loaded;
        this.editMode(false);
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.log('Error getting documents: ', err);
      });
  }
  discardChanges() {
    this.getassignment(this.courseId, this.assignmentId);
    this.editMode(false);
  }
  editMode(state: boolean) {
    this.editmode = state;
    this.editorConfig.editable = state;
    this.editorConfig.enableToolbar = state;
    this.editorConfig.showToolbar = state;
    this.refreshDateUI();
  }
  giveNow() {
    this.assignment.start = firebase.firestore.Timestamp.now().toMillis();
    this.saveAssignment();
  }
  take() {
    this.assignment.start = null;
    this.saveAssignment();
  }
  editOrSave() {
    if (this.editmode) {
      if (
        this.assignment.due == null ||
        this.assignment.start < this.assignment.due
      )
        this.saveAssignment();
    } else {
      this.editMode(true);
    }
  }

  calendar = {
    time: {
      hour: new Date().getHours(),
      minutes: new Date().getMinutes(),
      format: null
    },
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
    years: [],
    months: [
      'January',
      'Febuary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    format12: ['am', 'pm'],
    selectedDate: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate()
    },

    weeks: []
  };
  refreshCalendar() {
    var year = this.calendar.year;
    this.calendar.weeks = [];
    var month = this.calendar.month;
    var maxdays = new Date(year, month + 1, 0).getDate();
    var start = new Date(year, month, 1).getDay();
    var days = [];
    for (let i = 0; i < maxdays; i++) {
      if (i == 0) {
        for (let j = 0; j < start; j++) {
          days.push(null);
        }
      }
      days.push(i + 1);
      if (days.length >= 7 || i + 1 >= maxdays) {
        if (days.length < 7) {
          var filler = 7 - days.length;
          for (let k = 1; k <= filler; k++) {
            days.push(null);
          }
        }
        this.calendar.weeks.push({ days: days });
        days = [];
      }
    }
  }
  initCalendar() {
    var H = new Date().getHours();
    var h = H % 12 || 12;
    var ampm = H < 12 || H === 24 ? 'am' : 'pm';
    this.calendar.time.hour = h;
    this.calendar.time.format = ampm;
    var year = this.calendar.year;
    for (let i = year - 15; i < year + 10; i++) {
      this.calendar.years.push(i);
    }
    this.refreshCalendar();
  }
  resetCalendar() {
    var H = new Date().getHours();
    var h = H % 12 || 12;
    var ampm = H < 12 || H === 24 ? 'am' : 'pm';
    this.calendar.time.hour = h;
    this.calendar.time.format = ampm;
    this.calendar.time.minutes = new Date().getMinutes();
    console.log('resetting');
    this.calendar.year = new Date().getFullYear();
    this.calendar.month = new Date().getMonth();
    this.calendar.day = new Date().getDate();

    this.calendar.selectedDate.year = new Date().getFullYear();
    this.calendar.selectedDate.month = new Date().getMonth();
    this.calendar.selectedDate.day = new Date().getDate();
    this.refreshCalendar();
  }
  dateSelect() {
    var selectedDate = new Date(
      this.calendar.selectedDate.year,
      this.calendar.selectedDate.month,
      this.calendar.selectedDate.day,
      this.calendar.time.format == 'pm'
        ? this.calendar.time.hour + 12
        : this.calendar.time.hour,
      this.calendar.time.minutes
    );
    switch (this.changeDate) {
      case 0:
        this.assignment.start = selectedDate.getTime();
        break;
      case 1:
        this.assignment.due = selectedDate.getTime();
        break;
    }
    this.refreshDateUI();
  }

  changeGradingStyle() {
    if (this.assignment.rubric == null) {
      this.assignment.rubric = [];
      if (this.assignment.maxScore != null)
        this.assignment.rubric = [
          {
            criteriaTitle: 'Max Grade',
            criteriaDescription: 'Auto Import from previous grading style',
            scale: [
              {
                scaleTitle: 'Needs Work',
                scaleNumber:
                  Math.round(
                    (this.assignment.maxScore / 3 + Number.EPSILON) * 100
                  ) / 100
              },
              {
                scaleTitle: 'Poor',
                scaleNumber:
                  Math.round(
                    (this.assignment.maxScore / 2 + Number.EPSILON) * 100
                  ) / 100
              },
              {
                scaleTitle: 'Competent',
                scaleNumber:
                  Math.round(
                    (this.assignment.maxScore / 1.5 + Number.EPSILON) * 100
                  ) / 100
              },
              { scaleTitle: 'Excellent', scaleNumber: this.assignment.maxScore }
            ]
          }
        ];
      this.assignment.maxScore = firebaseData.RubricToMaxScore(
        this.assignment.rubric
      );
    } else {
      if (this.assignment.rubric != null)
        this.assignment.maxScore ==
          firebaseData.RubricToMaxScore(this.assignment.rubric);
      this.assignment.rubric = null;
    }
  }
  saveRubric() {
    this.assignment.maxScore = firebaseData.RubricToMaxScore(
      this.assignment.rubric
    );
  }
  addScale() {
    console.log('adding s');
    this.assignment.rubric = values.Rubric.addScale(this.assignment.rubric);
  }
  removeScale() {
    console.log('rem s');
    this.assignment.rubric = values.Rubric.removeScale(this.assignment.rubric);
  }
  addCriteria() {
    console.log('adding c');
    this.assignment.rubric.push(
      values.Rubric.addCriteria(this.assignment.rubric)
    );
  }
  removeCriteria(pos) {
    console.log('rem c' + pos);
    this.assignment.rubric.splice(pos, 1);
    console.log(this.assignment.rubric.length);
  }
  canDeactivate(): boolean {
    return !this.editmode;
  }
}

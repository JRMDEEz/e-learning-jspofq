import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../firebaseHelper';
import * as values from '../../../../../../values';
@Component({
  selector: 'module',
  templateUrl: '/module.sections.template'
})
export class TeacherModuleSectionsViewComponent {
  moduleId;
  courseId;
  items;
  editmode = false;
  viewMode = values.viewTypes.loading;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.moduleId = this.route.snapshot.queryParams.moduleId;
    this.getLessons();
  }
  getLessons() {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getLessons(this.courseId, this.moduleId)
      .then((result: firebaseData.Lessons) => {
        this.addAll(result);
        this.asyncLoad();
      })
      .catch(err => {
        values.viewTypes.notFound;
        console.error(err);
      });
  }
  asyncLoad() {
    if (this.items != null && module != null) {
      this.viewMode = values.viewTypes.loaded;
    }
  }
  addAll(lessons: firebaseData.Lessons) {
    this.items = [];
    lessons.lessonList.forEach((lesson: firebaseData.Lesson) => {
      this.items.push({
        id: lesson.id,
        title: lesson.title
      });
    });
  }
  addLesson() {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .newLesson(this.courseId, this.moduleId)
      .then((newLesson: firebase.default.firestore.DocumentData) => {
        this.router.navigate(['../section'], {
          queryParamsHandling: 'merge',
          queryParams: { lessonId: newLesson.id, new: true },
          relativeTo: this.route
        });
        this.viewMode = values.viewTypes.loaded;
      });
  }
  clear() {
    this.items = [];
  }
}

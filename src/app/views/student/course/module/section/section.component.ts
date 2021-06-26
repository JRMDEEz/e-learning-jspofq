import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../firebaseHelper';

@Component({
  selector: 'lesson-section',
  templateUrl: '/section.template'
})
export class StudentLessonViewComponent {
  moduleId;
  courseId;
  itemPicked = { module: {}, lesson: {} };
  items = [];
  editorConfig: AngularEditorConfig = {
    editable: false,
    enableToolbar: false,
    showToolbar: false,
    sanitize: true,
    outline: false
  };
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.moduleId = this.route.snapshot.queryParams.moduleId;
    this.getModules(this.courseId);
  }
  getModules(courseId) {
    this.firebaseHelper
      .getModules(courseId)
      .then((result: firebaseData.Modules) => {
        result.moduleList.forEach((module: firebaseData.Module) => {
          this.addModule(module);
        });
      });
  }
  getLessons(courseId, moduleId, pos) {
    this.firebaseHelper
      .getLessons(courseId, moduleId)
      .then((result: firebaseData.Lessons) => {
        this.addLessons(pos, result);
      })
      .catch(err => console.error(err));
  }
  addModule(module: firebaseData.Module) {
    this.items.push({
      id: module.id,
      title: module.title,
      lessons: null
    });
  }
  addLessons(pos, lessons: firebaseData.Lessons) {
    if (this.items[pos].lessons == null) this.items[pos].lessons = [];
    lessons.lessonList.forEach((lesson: firebaseData.Lesson) => {
      this.items[pos].lessons.push({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content
      });
    });
  }
  moduleClicked(pos) {
    if (this.items[pos].lessons == null) {
      this.getLessons(this.courseId, this.items[pos].id, pos);
    }
  }
  itemClicked(module, lesson) {
    this.itemPicked.module = module;
    this.itemPicked.lesson = lesson;
  }
  clear() {
    this.items = [];
  }
}

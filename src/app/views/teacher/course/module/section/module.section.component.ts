import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../../firebaseData';
import { firebaseHelper } from '../../../../../../firebaseHelper';
import * as values from '../../../../../../values';

@Component({
  selector: 'module-section',
  templateUrl: '/module.section.template'
})
export class TeacherModuleSectionViewComponent {
  moduleId;
  courseId;
  lessonId;
  lesson: firebaseData.Lesson;
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
  viewMode;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.moduleId = this.route.snapshot.queryParams.moduleId;
    this.lessonId = this.route.snapshot.queryParams.lessonId;
    var editmode = this.route.snapshot.queryParams.new;
    if (editmode != null) this.editMode(editmode);
    this.getLessons();
    console.log('ASD');
  }
  getLessons() {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getLesson(this.courseId, this.moduleId, this.lessonId)
      .then((result: firebaseData.Lesson) => {
        this.viewMode = values.viewTypes.loaded;
        this.lesson = result;
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.error(err);
      });
  }
  editMode(state: boolean) {
    this.editorConfig.editable = state;
    this.editorConfig.enableToolbar = state;
    this.editorConfig.showToolbar = state;
  }
  editOrSave() {
    if (this.editorConfig.enableToolbar) {
      this.saveLesson();
    } else {
      this.editMode(true);
    }
  }
  deleteLesson() {
    this.firebaseHelper
      .deleteLesson(this.courseId, this.moduleId, this.lessonId)
      .then(() => {
        this.router.navigate(['../../module'], {
          queryParams: { courseId: this.courseId, moduleId: this.moduleId },
          relativeTo: this.route
        });
      });
  }
  discardChanges() {
    this.getLessons();
    this.editMode(false);
  }
  saveLesson() {
    console.log(this.lesson.content);
    console.log(this.lesson.title);
    this.firebaseHelper
      .submitLesson(this.courseId, this.moduleId, this.lessonId, this.lesson)
      .then(result => {
        this.editMode(false);
      })
      .catch(err => console.error(err));
  }
}

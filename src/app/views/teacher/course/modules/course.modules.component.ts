import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebaseData from '../../../../../firebaseData';
import { firebaseHelper } from '../../../../../firebaseHelper';
import * as values from '../../../../../values';
@Component({
  selector: 'modules',
  templateUrl: '/course.modules.template'
})
export class TeacherModulesViewComponent {
  items;
  viewMode;
  courseId;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.getmodules(this.courseId);
  }
  getmodules(courseId) {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getModules(courseId)
      .then((modules: firebaseData.Modules) => {
        this.viewMode = values.viewTypes.loaded;
        this.setItems(modules);
        return;
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.log('Error getting documents: ', err);
        return;
      });
    return;
  }
  setItems(modules: firebaseData.Modules) {
    this.items = [];
    modules.moduleList.forEach((module: firebaseData.Module) => {
      this.items.push({
        id: module.id,
        title: module.title,
        thumbnail: module.thumbnail,
        description: module.description
      });
    });
  }
  addModule() {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .newModule(this.courseId)
      .then((newModule: firebase.default.firestore.DocumentData) => {
        this.router.navigate(['../module'], {
          queryParamsHandling: 'merge',
          queryParams: { moduleId: newModule.id, new: true },
          relativeTo: this.route
        });
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.log(err);
      });
  }
}

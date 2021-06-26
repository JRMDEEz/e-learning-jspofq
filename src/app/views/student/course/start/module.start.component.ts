import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebaseData from '../../../../../firebaseData';
import { firebaseHelper } from '../../../../../firebaseHelper';
@Component({
  selector: 'start',
  templateUrl: '/module.start.template'
})
export class StudentModuleStartViewComponent {
  items = [];
  viewMode;
  courseId;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.getmodules(this.courseId);
  }
  getmodules(courseId) {
    console.log('getting');
    this.viewMode = viewType.loading;
    this.firebaseHelper
      .getModules(courseId)
      .then((modules: firebaseData.Modules) => {
        console.log('got');
        this.viewMode = viewType.loaded;
        modules.moduleList.forEach(module => {
          console.log(module.id);
          this.add(module);
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
  add(module: firebaseData.Module) {
    this.items.push({
      id: module.id,
      title: module.title,
      thumbnail: module.thumbnail,
      description: module.description
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

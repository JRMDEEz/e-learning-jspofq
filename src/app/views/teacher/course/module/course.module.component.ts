import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../../firebaseData';
import { firebaseHelper } from '../../../../../firebaseHelper';
import * as values from '../../../../../values';
import firebase from '@firebase/app';
import 'firebase/storage';
@Component({
  selector: 'module',
  templateUrl: '/course.module.template'
})
export class TeacherModuleViewComponent {
  moduleId;
  courseId;
  items;
  editmode = false;
  module: firebaseData.Module;
  viewMode = values.viewTypes.loading;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    this.moduleId = this.route.snapshot.queryParams.moduleId;
    var editmode = this.route.snapshot.queryParams.new;
    if (editmode != null) this.editMode(editmode);
    this.getModule();
  }
  getModule() {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getModule(this.courseId, this.moduleId)
      .then((module: firebaseData.Module) => {
        this.module = module;
        this.module.title;
        this.uploadPhoto.url = module.thumbnail;
        this.viewMode = values.viewTypes.loaded;
      });
  }
  saveModule() {
    this.firebaseHelper
      .submitModule(this.courseId, this.moduleId, this.module)
      .then(result => {
        this.editMode(false);
      })
      .catch(err => console.error(err));
  }
  clear() {
    this.items = [];
  }
  discardChanges() {
    this.cancelFile();
    this.getModule();
    this.editMode(false);
  }
  editMode(state: boolean) {
    this.editmode = state;
  }
  editOrSave() {
    if (this.editmode) {
      this.saveModule();
    } else {
      this.editMode(true);
    }
  }
  isHomeRoute() {
    return !this.router.url.includes('/section');
  }
  uploadPhoto = { progress: '0%', url: undefined, uploadTask: undefined };
  addFile(fileList: FileList) {
    fileList[0].size;
    this.uploadPhoto.url = undefined;
    this.uploadPhoto = {
      progress: '0%',
      url: undefined,
      uploadTask: undefined
    };
    this.UploadFile(fileList[0]);
  }
  UploadFile(FileInput: File) {
    this.uploadPhoto.uploadTask = this.firebaseHelper.uploadFile(FileInput);
    this.uploadPhoto.uploadTask.then(result => {
      this.uploadPhoto.uploadTask.snapshot.ref
        .getDownloadURL()
        .then(downloadURL => {
          console.log('DONE!');
          this.module.thumbnail = downloadURL;
          this.uploadPhoto.url = downloadURL;
          this.uploadPhoto.uploadTask = undefined;
        });
    });
    // Listen for state changes, errors, and completion of the upload.
    this.uploadPhoto.uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      snapshot => {
        this.uploadPhoto.progress =
          ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) +
          '%';
        console.log(this.uploadPhoto.progress);
      },
      error => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
        this.uploadPhoto.uploadTask = undefined;
      }
    );
  }
  cancelFile() {
    if (this.uploadPhoto.uploadTask != undefined) {
      this.uploadPhoto.uploadTask.cancel();
    }
  }

  deleteModule() {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper.deleteModule(this.courseId, this.moduleId).then(() => {
      this.router.navigate(['../modules'], {
        queryParams: { courseId: this.courseId, moduleId: this.moduleId },
        relativeTo: this.route
      });
      this.viewMode = values.viewTypes.loaded;
    });
  }
  canDeactivate(): boolean {
    return !this.editmode;
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import firebase from '@firebase/app';
import 'firebase/storage';
import * as firebaseData from '../../../../../firebaseData';
import { firebaseHelper } from '../../../../../firebaseHelper';
import * as values from '../../../../../values';
@Component({
  selector: 'config',
  templateUrl: '/course.config.template'
})
export class TeacherCourseConfigurationViewComponent {
  moduleId;
  courseId;
  editmode = false;
  viewMode = values.viewTypes.loading;
  course: firebaseData.Course;
  private firebaseHelper: firebaseHelper = firebaseHelper.getInstance();
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.courseId = this.route.snapshot.queryParams.courseId;
    var editmode = this.route.snapshot.queryParams.new;
    if (editmode != null) this.editMode(editmode);
    this.getCourse(this.courseId);
  }
  getCourse(courseId) {
    this.viewMode = values.viewTypes.loading;
    this.firebaseHelper
      .getCourse(courseId)
      .then((course: firebaseData.Course) => {
        this.viewMode = values.viewTypes.loaded;
        this.course = course;
        this.uploadPhoto.url = course.thumbnail;
      })
      .catch(err => {
        console.error(err);
        this.viewMode = values.viewTypes.notFound;
      });
  }
  uploadPhoto = { progress: '0%', url: undefined, uploadTask: undefined };
  addFile(fileList: FileList) {
    fileList[0].size
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
          this.course.thumbnail = downloadURL;
          this.uploadPhoto.url = downloadURL;
          this.uploadPhoto.uploadTask = undefined;
        });
    });
    // Listen for state changes, errors, and completion of the upload.
    this.uploadPhoto.uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      snapshot => {
        this.uploadPhoto.progress =
          ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
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
  deleteCourse() {
    this.firebaseHelper.deleteCourse(this.courseId).then(() => {
      this.router.navigate(['../../home'], {
        relativeTo: this.route
      });
    });
  }
  saveCourse() {
    this.firebaseHelper
      .submitCourse(this.courseId, this.course)
      .then(result => {
        this.editMode(false);
      })
      .catch(err => console.error(err));
  }
  discardChanges() {
    this.cancelFile();
    this.getCourse(this.courseId);
    this.editMode(false);
  }
  editMode(state: boolean) {
    this.editmode = state;
  }
  editOrSave() {
    if (this.editmode) {
      this.saveCourse();
    } else {
      this.editMode(true);
    }
  }
}

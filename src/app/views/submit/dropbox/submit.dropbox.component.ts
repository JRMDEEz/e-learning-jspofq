import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import firebase from '@firebase/app';
import 'firebase/storage';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebaseData from '../../../../firebaseData';
import { firebaseHelper } from '../../../../firebaseHelper';
import firebase from 'firebase';
@Component({
  selector: 'dropbox',
  templateUrl: '/submit.dropbox.template'
})
export class DropboxSubmitViewComponent {
  viewMode;
  courseId;
  createdAt;
  uploadList = [];
  assignmentId;
  instructions;
  submissionId;
  private submission: firebaseData.DropboxSubmission;
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
    this.getassignment(this.courseId, this.assignmentId);
  }
  getassignment(courseId, assignmentId) {
    console.log('getting');
    this.viewMode = viewType.loading;
    this.firebaseHelper
      .getAssignment(courseId, assignmentId)
      .then((assignment: firebaseData.Assignment) => {
        this.firebaseHelper
          .getcurrentUser()
          .then((user: firebase.default.User) => {
            this.viewMode = viewType.loaded;
            this.instructions = assignment.instructions;
            this.firebaseHelper
              .getDropboxSubmission(courseId, assignmentId, user.uid)
              .then((submission: firebaseData.DropboxSubmission) => {
                this.submission = submission;
                if (submission != null) this.uploadList = submission.files;
              });
          })
          .catch(err => {
            this.viewMode = viewType.notfound;
            console.log('Error getting user: ', err);
          });
      })
      .catch(err => {
        this.viewMode = viewType.notfound;
        console.log('Error getting documents: ', err);
      });
  }
  addFile(fileList: FileList) {
    if (this.uploadList == null) this.uploadList = [];
    for (let i = 0; i < fileList.length; i++) {
      this.UploadFile(
        fileList[i],
        this.uploadList.push({
          name: fileList[i].name,
          size: (fileList[i].size / (1024 * 1024)).toFixed(2) + 'Mb',
          progress: '0%',
          url: undefined,
          uploadTask: undefined
        })
      );
    }
  }
  SubmitSubmission() {
    var uploads = [];
    this.uploadList.forEach(upload => {
      uploads.push({
        name: upload.name,
        size: upload.size,
        url: upload.url
      });
    });
    if (this.submission != null) {
      this.submission.files = uploads;
      this.firebaseHelper
        .getcurrentUser()
        .then((user: firebase.default.User) => {
          this.firebaseHelper
            .submitDropbox(
              this.courseId,
              this.assignmentId,
              this.submission,
              user.uid
            )
            .then(() => {
              this.onUploadSuccess();
            });
        });

      return;
    }
    this.firebaseHelper
      .submitnewDropbox(this.courseId, this.assignmentId, uploads)
      .then(() => {
        this.onUploadSuccess();
      });
  }
  onUploadSuccess() {
    console.log('DROPBOX UPLOAD SUCCESSFULL');
    this.router.navigate(['../../view'], {
      queryParamsHandling: 'merge',
      relativeTo: this.route
    });
  }
  removeFile(pos) {
    if (this.uploadList[pos].uploadTask != undefined) {
      this.uploadList[pos].uploadTask.cancel();
    }
    this.uploadList.splice(pos, 1);
  }
  UploadFile(FileInput: File, pos) {
    pos--;
    this.uploadList[pos].uploadTask = this.firebaseHelper.uploadFile(FileInput);
    this.uploadList[pos].uploadTask.then(result => {
      this.uploadList[pos].uploadTask.snapshot.ref
        .getDownloadURL()
        .then(downloadURL => {
          console.log('DONE!');
          this.uploadList[pos].url = downloadURL;
          this.uploadList[pos].uploadTask = undefined;
        });
    });
    // Listen for state changes, errors, and completion of the upload.
    this.uploadList[pos].uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      snapshot => {
        this.uploadList[pos].progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '%';
        console.log(this.uploadList[pos].progress);
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
      }
    );
  }
}
enum viewType {
  loading,
  loaded,
  notfound
}

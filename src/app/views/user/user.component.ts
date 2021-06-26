import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firebaseHelper, SignInProvider } from '../../../firebaseHelper';
import * as firebaseData from '../../../firebaseData';
import { el } from '@angular/platform-browser/testing/src/browser_util';
import * as values from '../../../values';
@Component({
  selector: 'welcome',
  templateUrl: '/user.template.html'
})
export class UserViewComponent {
  private firebasehelper: firebaseHelper = firebaseHelper.getInstance();
  userId;
  viewMode;
  user: firebaseData.User;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.userId = this.route.snapshot.queryParams.userId;
    this.viewMode = values.viewTypes.loading;
    if (this.userId == undefined) {
      this.firebasehelper
        .getcurrentUser()
        .then((currentUser: firebase.default.User) => {
          this.userId = currentUser.uid;
          this.getUser(this.userId);
        })
        .catch(err => {
          this.viewMode = values.viewTypes.error;
          console.error(err);
        });
    } else {
      this.getUser(this.userId);
    }
  }
  getUser(uid) {
    this.firebasehelper
      .getUser(uid)
      .then((user: firebaseData.User) => {
        this.viewMode = values.viewTypes.loaded;
        this.user = user;
      })
      .catch(err => {
        this.viewMode = values.viewTypes.error;
        console.error(err);
      });
  }
}
